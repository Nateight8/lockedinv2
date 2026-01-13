import { GraphQLError } from "graphql";
import { isValidIANA } from "@/graphql/utils/time-zone"; // <-- helper for time zone validation
import { GraphqlContext } from "../context";
import { UpdateProfileInput } from "../typedefs/user";
import { redisUtil } from "@/lib/redis";
import { createHash } from "crypto";
import { accountDeletionQueue } from "@/queues/accountDeletion";
import { extractIp, extractUserAgent } from "@/auth/services/sessionService";
import { users, refreshTokens, sessions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, ctx: GraphqlContext) => {
      const { user, db } = ctx;

      if (!user?.id) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });

      if (!updatedUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return updatedUser;
    },
  },

  Mutation: {
    deleteAccount: async (_: unknown, __: unknown, ctx: GraphqlContext) => {
      if (!ctx?.user?.id) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const userId = ctx.user.id;
      const db = ctx.db;

      try {
        // 1️⃣ Mark user as "pending deletion" (soft delete)
        const now = new Date();

        await db
          .update(users)
          .set({ deletedAt: now })
          .where(eq(users.id, userId));

        // 2️⃣ Clear sensitive tokens immediately
        await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));

        // 3️⃣ Schedule permanent deletion in BullMQ
        // The delay is GRACE_PERIOD in ms
        const gracePeriodMs =
          parseInt(process.env.GRACE_PERIOD_DAYS || "7", 10) *
          24 *
          60 *
          60 *
          1000;

        await accountDeletionQueue.add(
          "permanentDeleteUser",
          { userId },
          { delay: gracePeriodMs }
        );

        // 4️⃣ Clear auth cookies
        ctx.res?.clearCookie("auth_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        ctx.res?.clearCookie("refresh_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return {
          success: true,
          message: `Account is scheduled for deletion in ${
            process.env.GRACE_PERIOD_DAYS || 7
          } days.`,
        };
      } catch (error) {
        console.error("Failed to schedule account deletion:", error);
        throw new GraphQLError("Failed to delete account", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    },

    updateProfile: async (
      _: unknown,
      { input }: { input: UpdateProfileInput },
      ctx: GraphqlContext
    ) => {
      if (!ctx?.user?.id) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const db = ctx.db;
      const { displayName, phone, timeZone, dateOfBirth, image } = input;

      if (timeZone && !isValidIANA(timeZone)) {
        throw new GraphQLError("Invalid timeZone", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!existingUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Only include fields that are provided in the input
      const data: Record<string, any> = {};

      // Basic profile information
      if (displayName !== undefined) data.displayName = displayName;
      if (phone !== undefined) data.phone = phone;
      if (timeZone !== undefined) data.timeZone = timeZone;

      // User preferences and display settings
      if (displayName !== undefined) data.displayName = displayName;
      if (image !== undefined) data.image = image;

      // Parse date string to Date object for database storage
      if (dateOfBirth !== undefined) data.dateOfBirth = new Date(dateOfBirth);

      // Mark as isOnboard if name is provided and it's not yet true
      if (!existingUser.isOnboard && displayName) {
        data.isOnboard = true;
      }

      try {
        await db.update(users).set(data).where(eq(users.id, ctx.user.id));

        if (data.isOnboard) {
          ctx.res?.cookie("is_onboarded", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
          });
        }

        return { success: true };
      } catch (e: any) {
        console.error("Update profile error:", e);
        if (e?.code === "P2002") {
          const field = e?.meta?.target?.[0] ?? "field";
          throw new GraphQLError(`${field} already in use`, {
            extensions: {
              code: "BAD_USER_INPUT",
              details: e.message,
              meta: e.meta,
            },
          });
        }
        throw new GraphQLError(e.message || "Failed to update profile", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: e.message,
            stack: process.env.NODE_ENV === "development" ? e.stack : undefined,
          },
        });
      }
    },

    logout: async (_: unknown, __: unknown, ctx: GraphqlContext) => {
      const { user, db, res, req } = ctx;
      if (!user?.id) {
        return { success: true }; // Already logged out
      }

      try {
        const refreshTokenValue = req?.cookies?.refresh_token;
        if (refreshTokenValue) {
          // Hash it for DB lookup
          const refreshTokenHash = createHash("sha256")
            .update(refreshTokenValue)
            .digest("hex");

          // Delete refresh token from DB
          await db
            .delete(refreshTokens)
            .where(
              and(
                eq(refreshTokens.tokenHash, refreshTokenHash),
                eq(refreshTokens.userId, user.id)
              )
            );
        }

        // 🔑 Mark session inactive
        if (!req) {
          throw new Error("Request object is not available");
        }

        const userAgent = extractUserAgent(req);

        // Cast req to any to satisfy the SessionRequest interface
        const ip = extractIp(req as any);

        await db
          .update(sessions)
          .set({ isActive: false })
          .where(
            and(
              eq(sessions.userId, user.id),
              eq(sessions.userAgent, userAgent),
              eq(sessions.ip, ip),
              eq(sessions.isActive, true)
            )
          );

        // Clear cookies
        res?.clearCookie("auth_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        res?.clearCookie("refresh_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return { success: true };
      } catch (err) {
        console.error("Logout error:", err);
        return { success: false };
      }
    },
  },
};
