import { Router } from "express";
import authRoutes from "@/routes/auth-routes";
import recipeRoutes from "@/routes/recipe-routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/recipes", recipeRoutes);

export default router;
