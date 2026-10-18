import { RecipeRepository } from "@/repositories/recipe-repository";
import { UserRepository } from "@/repositories/user-repository";
import { fail, ok } from "@/utils/api-result";

export async function deleteRecipeService(id: string, userId: string) {
  const recipeRepository = new RecipeRepository();

  try {
    const user = await new UserRepository().findById(userId);
    if (!user) return fail(401, "Authentication required");

    const recipe = await recipeRepository.delete(id, userId);
    if (!recipe) return fail(404, "Recipe not found");

    return ok({ recipe }, "Recipe deleted");
  } catch (error) {
    console.error("deleteRecipeService Error", error);
    return fail(500, "Unable to delete recipe");
  }
}
