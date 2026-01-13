import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request } from "express";
import passport from "passport";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

// Define the user type for Passport
interface User {
  id: string;
  email: string;
  name?: string | null;
  displayName?: string | null;
}

// Serialize user into the session
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: { id: true, email: true, name: true },
    });

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Export a function to configure the Google strategy
export const configureGoogleStrategy = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      "Google OAuth credentials not found. Google login will be disabled."
    );
    return;
  }

  // Google OAuth Strategy
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
        passReqToCallback: true,
        scope: ["profile", "email"],
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        try {
          // Find or create user using Drizzle's insert with onConflictDoUpdate
          const [user] = await db
            .insert(users)
            .values({
              email: profile.emails[0].value,
              name: profile.name?.givenName,
            })
            .onConflictDoUpdate({
              target: users.email,
              set: {
                name: profile.name?.givenName,
                updatedAt: new Date(),
              },
            })
            .returning();

          if (!user) {
            return done(new Error("Failed to create or update user"), null);
          }

          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
          });
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};

// Configure the Google strategy when this module is imported
configureGoogleStrategy();

export default passport;
