import { RecipeRepository } from "@/repositories/recipe-repository";
import { UserRepository } from "@/repositories/user-repository";
import type { CreateRecipeInput } from "@/schema/recipe-schema";
import { created, fail } from "@/utils/api-result";

export async function createRecipeService(data: CreateRecipeInput, userId: string) {
  try {
    const user = await new UserRepository().findById(userId);
    if (!user) return fail(401, "Authentication required");

    const recipe = await new RecipeRepository().create(data, userId);
    return created({ recipe }, "Recipe created");
  } catch (error) {
    console.error("createRecipeService Error", error);
    return fail(500, "Unable to create recipe");
  }
}
