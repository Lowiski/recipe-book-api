import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

const publicFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  createdAt: users.createdAt,
  role: users.role,
  emailVerified: users.emailVerified,
};

export type PublicUser = typeof publicFields;

export class UserRepository {
  async findById(id: string) {
    const [user] = await db
      .select(publicFields)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async create(data: { name: string; email: string; password: string }) {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning(publicFields);
    return user;
  }
}
