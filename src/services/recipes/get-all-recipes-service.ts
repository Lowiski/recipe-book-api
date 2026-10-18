import { RecipeRepository } from "@/repositories/recipe-repository";
import { fail, ok } from "@/utils/api-result";

export async function getAllRecipesService() {
  try {
    const recipes = await new RecipeRepository().findAllWithOwners();
    return ok({ recipes });
  } catch (error) {
    console.error("getAllRecipesService Error", error);
    return fail(500, "Unable to get all recipes");
  }
}
