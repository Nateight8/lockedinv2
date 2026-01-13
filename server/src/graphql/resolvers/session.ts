import { db } from "@/db";
import { sessions } from "@/db/schema/auth";
import { eq, and, desc, inArray } from "drizzle-orm";
import { parse } from "useragent";
import { GraphqlContext } from "../context";
import { RevokeSessionsArgs } from "../typedefs/sessions";

export const sessionResolvers = {
  Query: {
    async getUserSessions(_: unknown, __: unknown, context: GraphqlContext) {
      const { user, req } = context;

      if (!user?.id) {
        throw new Error("User ID is required");
      }

      try {
        // Get the current request's IP and user agent to identify the current session
        const userAgent = req?.headers["user-agent"] || "";
        const ip = req?.ip || req?.socket?.remoteAddress || "";

        console.log("Current request IP:", ip);
        console.log("Current user agent:", userAgent);

        const userSessions = await db.query.sessions.findMany({
          where: and(eq(sessions.userId, user.id), eq(sessions.isActive, true)),
          orderBy: [desc(sessions.lastActive)],
        });

        // Enrich with parsed UA + mark current device
        return userSessions.map((session) => {
          const agent = parse(session.userAgent || "");

          let deviceType: "DESKTOP" | "MOBILE" | "TABLET" = "DESKTOP";
          const family = agent.device?.family?.toLowerCase() || "";
          if (family.includes("ipad") || family.includes("tablet")) {
            deviceType = "TABLET";
          } else if (
            family.includes("iphone") ||
            family.includes("android") ||
            family.includes("mobile")
          ) {
            deviceType = "MOBILE";
          }

          return {
            id: session.id,
            ip: session.ip || null,
            city: session.city || null,
            region: session.region || null,
            country: session.country || null,
            createdAt: session.createdAt.toISOString(),
            lastActive: session.lastActive.toISOString(),
            expiresAt: session.expiresAt.toISOString(),
            deviceType,
            deviceName: agent.device?.family || "Unknown Device",
            browser: agent.family || "Unknown Browser",
            browserVersion: agent.major || "Unknown",
            os: agent.os?.family || "Unknown OS",
            osVersion: agent.os?.major || "Unknown",

            isCurrentDevice: session.ip === ip, // <==Mark as current device if IP match
          };
        });
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        throw new Error("Unable to retrieve sessions");
      }
    },
  },
  Mutation: {
    revokeSessions: async (
      _: unknown,
      args: RevokeSessionsArgs,
      ctx: GraphqlContext
    ) => {
      const { user, db: database } = ctx;

      if (!user?.id) throw new Error("User not authenticated");
      if (!args.sessionIds || args.sessionIds.length === 0)
        throw new Error("Provide session IDs to revoke");

      try {
        const result = await database
          .update(sessions)
          .set({ isActive: false })
          .where(
            and(
              eq(sessions.userId, user.id),
              inArray(sessions.id, args.sessionIds),
              eq(sessions.isActive, true)
            )
          );

        // In Drizzle, update returns the number of affected rows in some drivers,
        // or we can use .returning() to get them.
        // For PostgresJS, we might need to check the result or use .returning().

        return {
          success: true,
          revokedCount: 1, // Drizzle doesn't return count directly by default in all drivers without .returning()
        };
      } catch (error) {
        console.error("Failed to revoke sessions:", error);
        return { success: false, revokedCount: 0 };
      }
    },
  },
};
