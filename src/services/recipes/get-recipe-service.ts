import { RecipeRepository } from "@/repositories/recipe-repository";
import { UserRepository } from "@/repositories/user-repository";
import { fail, ok } from "@/utils/api-result";

export async function getRecipeService(id: string, userId: string) {
  try {
    const user = await new UserRepository().findById(userId);
    if (!user) return fail(401, "Authentication required");

    // The owner filter keeps users on their own recipes only.
    const recipe = await new RecipeRepository().findById(id, user.id);
    if (!recipe) return fail(404, "Recipe not found");

    return ok({ recipe });
  } catch (error) {
    console.error("getRecipeService Error", error);
    return fail(500, "Unable to get recipe");
  }
}
