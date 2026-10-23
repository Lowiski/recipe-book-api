import { RecipeRepository } from "@/repositories/recipe-repository";
import { UserRepository } from "@/repositories/user-repository";
import type { UpdateRecipeInput } from "@/schema/recipe-schema";
import { fail, ok } from "@/utils/api-result";

export async function updateRecipeService(
  id: string,
  data: UpdateRecipeInput,
  userId: string,
) {
  const recipeRepository = new RecipeRepository();

  try {
    const user = await new UserRepository().findById(userId);
    if (!user) return fail(401, "Authentication required");

    const recipe = await recipeRepository.update(id, data, userId);
    if (!recipe) return fail(404, "Recipe not found");

    return ok({ recipe }, "Recipe updated");
  } catch (error) {
    console.error("updateRecipeService Error", error);
    return fail(500, "Unable to update recipe");
  }
}
