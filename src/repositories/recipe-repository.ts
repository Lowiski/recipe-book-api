import { and, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { recipes, users } from "@/db/schema";
import type { CreateRecipeInput, UpdateRecipeInput } from "@/schema/recipe-schema";

export class RecipeRepository {
  // Admin view: every recipe joined with its owner's display name.
  async findAllWithOwners() {
    return db
      .select({
        ...getTableColumns(recipes),
        ownerName: users.name,
      })
      .from(recipes)
      .innerJoin(users, eq(recipes.userId, users.id));
  }

  async findAllByOwner(userId: string) {
    return db.select().from(recipes).where(eq(recipes.userId, userId));
  }

  // The owner filter enforces ownership at the database level.
  async findById(id: string, ownerId?: string) {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(
        and(
          eq(recipes.id, id),
          ownerId ? eq(recipes.userId, ownerId) : undefined,
        ),
      )
      .limit(1);
    return recipe;
  }

  async create(data: CreateRecipeInput, userId: string) {
    const [recipe] = await db
      .insert(recipes)
      .values({ ...data, userId })
      .returning();
    return recipe;
  }

  async update(id: string, data: UpdateRecipeInput, ownerId: string) {
    const [recipe] = await db
      .update(recipes)
      .set(data)
      .where(and(eq(recipes.id, id), eq(recipes.userId, ownerId)))
      .returning();
    return recipe;
  }

  async delete(id: string, ownerId: string) {
    const [recipe] = await db
      .delete(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.userId, ownerId)))
      .returning();
    return recipe;
  }
}
