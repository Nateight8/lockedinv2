import { db, DbClient } from "@/db";

export type Context = {
  db: DbClient;
  userEmail?: string; // Will be set by the authentication middleware
  user?: any; // The full user object if available
};

export const createContext = (): Context => ({
  db,
});
