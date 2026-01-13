import { Request, Response } from "express";
import { DbClient } from "@/db";
import { User } from "@/db/schema/users";

export type ContextUser = {
  id?: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  timeZone?: string;
  createdAt?: Date;
  updatedAt?: Date;
} | null;

export interface Context {
  db: DbClient;
  user: ContextUser;
  res?: Response | undefined;
  req?: Request | undefined;
}

export function createContext(
  db: DbClient,
  user: ContextUser = null,
  res?: Response,
  req?: Request
): Context {
  return {
    db,
    user,
    res,
    req,
  };
}

export type GraphqlContext = Context;
