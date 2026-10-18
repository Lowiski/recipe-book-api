import { RecipeRepository } from "@/repositories/recipe-repository";
import { UserRepository } from "@/repositories/user-repository";
import { fail, ok } from "@/utils/api-result";

export async function getRecipesService(userId: string) {
  try {
    const user = await new UserRepository().findById(userId);
    if (!user) return fail(401, "Authentication required");

    const recipes = await new RecipeRepository().findAllByOwner(user.id);
    return ok({ recipes });
  } catch (error) {
    console.error("getRecipesService Error", error);
    return fail(500, "Unable to get recipes");
  }
}
