import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { tokens } from "@/db/schema";

type CreateTokenData = {
  userId: string;
  token: string;
  expiresAt: Date;
};

export class TokenRepository {
  async createRefreshToken(data: CreateTokenData) {
    const [token] = await db
      .insert(tokens)
      .values({
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt.toISOString(),
        type: "REFRESH",
      })
      .returning();
    return token;
  }

  async findActiveRefreshToken(token: string) {
    const now = new Date().toISOString();
    const [active] = await db
      .select()
      .from(tokens)
      .where(
        and(
          eq(tokens.token, token),
          eq(tokens.type, "REFRESH"),
          isNull(tokens.consumedAt),
          isNull(tokens.revokedAt),
          gt(tokens.expiresAt, now),
        ),
      )
      .limit(1);
    return active;
  }

  async consumeToken(id: string) {
    const [token] = await db
      .update(tokens)
      .set({ consumedAt: new Date().toISOString() })
      .where(and(eq(tokens.id, id), isNull(tokens.consumedAt), isNull(tokens.revokedAt)))
      .returning();
    return token;
  }

  async revokeToken(id: string) {
    const [token] = await db
      .update(tokens)
      .set({ revokedAt: new Date().toISOString() })
      .where(eq(tokens.id, id))
      .returning();
    return token;
  }
}
