// services/refreshTokenService.ts
import crypto from "crypto";
import { db } from "@/db";
import { refreshTokens } from "@/db/schema/auth";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";

export class RefreshTokenService {
  async create(userId: string, daysValid = 7) {
    const token = crypto.randomBytes(40).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      tokenHash,
      userId,
      expiresAt,
    });

    return token;
  }

  async validate(token: string, userId: string) {
    const tokens = await db.query.refreshTokens.findMany({
      where: and(
        eq(refreshTokens.userId, userId),
        gt(refreshTokens.expiresAt, new Date())
      ),
    });

    for (const stored of tokens) {
      if (await bcrypt.compare(token, stored.tokenHash)) {
        return true;
      }
    }
    return false;
  }

  async revoke(token: string, userId: string) {
    const tokens = await db.query.refreshTokens.findMany({
      where: eq(refreshTokens.userId, userId),
    });

    for (const stored of tokens) {
      if (await bcrypt.compare(token, stored.tokenHash)) {
        await db.delete(refreshTokens).where(eq(refreshTokens.id, stored.id));
      }
    }
  }
}
