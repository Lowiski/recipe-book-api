import { Router } from "express";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { CsrfMiddleware } from "@/middlewares/csrf-middleware";
import { SchemaMiddleware } from "@/middlewares/schema-middleware";
import { RoleValidatorMiddleware } from "@/middlewares/role-validator-middleware";
import { RecipeController } from "@/controllers/recipe-controller";
import { createRecipeSchema, recipeIdSchema, updateRecipeSchema } from "@/schema/recipe-schema";

const router = Router();
const authMiddleware = new AuthMiddleware();
const csrfMiddleware = new CsrfMiddleware();
const schemaMiddleware = new SchemaMiddleware();
const roleValidator = new RoleValidatorMiddleware();
const recipeController = new RecipeController();

// ADMIN only: every recipe across all accounts.
router.get(
  "/v1/get-all-recipes",
  authMiddleware.execute,
  roleValidator.validate("ADMIN"),
  recipeController.getAllRecipes,
);

// USER: manage your own recipes.
router.get(
  "/v1/get-recipes",
  authMiddleware.execute,
  roleValidator.validate("USER"),
  recipeController.getRecipes,
);
router.get(
  "/v1/get-recipe/:id",
  authMiddleware.execute,
  roleValidator.validate("USER"),
  schemaMiddleware.validate(recipeIdSchema),
  recipeController.getRecipe,
);
router.post(
  "/v1/create-recipe",
  authMiddleware.execute,
  csrfMiddleware.execute,
  roleValidator.validate("USER"),
  schemaMiddleware.validate(createRecipeSchema),
  recipeController.createRecipe,
);
router.post(
  "/v1/update-recipe/:id",
  authMiddleware.execute,
  csrfMiddleware.execute,
  roleValidator.validate("USER"),
  schemaMiddleware.validate(updateRecipeSchema),
  recipeController.updateRecipe,
);
router.post(
  "/v1/delete-recipe/:id",
  authMiddleware.execute,
  csrfMiddleware.execute,
  roleValidator.validate("USER"),
  schemaMiddleware.validate(recipeIdSchema),
  recipeController.deleteRecipe,
);

export default router;
