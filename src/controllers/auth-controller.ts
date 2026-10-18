import type { Request, Response } from "express";
import {
  signupService,
  loginService,
  refreshTokenService,
  logoutService,
  getUserSessionService,
  getCsrfTokenService,
} from "@/services/auth";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth-cookies";
import type { AuthenticatedRequest } from "@/middlewares/auth-middleware";

export class AuthController {
  getCsrfToken = (req: Request, res: Response) => {
    const result = getCsrfTokenService(req, res);
    return res.status(result.code).json(result);
  };

  signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body ?? {};
    const result = await signupService(name, email, password);
    return res.status(result.code).json(result);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const result = await loginService(email, password);

    // Move the issued tokens out of the JSON body and into HttpOnly cookies.
    if (result.code === 200 && result.data?.accessToken && result.data?.refreshToken) {
      setAuthCookies(res, result.data);
    }

    return res.status(result.code).json(result);
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;
    const result = await refreshTokenService(refreshToken);

    if (result.code === 200 && result.data?.accessToken && result.data?.refreshToken) {
      setAuthCookies(res, result.data);
    }

    return res.status(result.code).json(result);
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;
    const result = await logoutService(refreshToken);
    if (result.code === 200) clearAuthCookies(res);
    return res.status(result.code).json(result);
  };

  userSession = async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user!.sub;
    const result = await getUserSessionService(userId);
    return res.status(result.code).json(result);
  };
}
