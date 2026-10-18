import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "@/middlewares/auth-middleware";
import { verifyRefreshToken } from "@/lib/jwt";
import {
  validateRequest,
  csrfSessionCookieName,
  csrfTokenCookieName,
} from "@/lib/csrf";

export class CsrfMiddleware {
  // Runs after AuthMiddleware: a verified Bearer token is not a browser
  // session, so CSRF protection does not apply to it.
  execute = (req: Request, res: Response, next: NextFunction) => {
    if ((req as AuthenticatedRequest).authMethod === "bearer") return next();
    return this.validate(req, res, next);
  };

  // Used on signup/login: browsers must present a CSRF token, while
  // cookie-free JSON clients (e.g. Postman scripts) may skip it.
  auth = (req: Request, res: Response, next: NextFunction) => {
    const browserRequest =
      req.get("origin") ||
      req.get("referer") ||
      req.get("sec-fetch-site") ||
      req.cookies?.accessToken ||
      req.cookies?.refreshToken ||
      req.cookies?.[csrfSessionCookieName] ||
      req.cookies?.[csrfTokenCookieName];

    if (!browserRequest && req.is("application/json")) return next();
    return this.validate(req, res, next);
  };

  // A body-supplied refresh token without any cookies skips CSRF; that
  // pattern is for non-browser clients only.
  refreshToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body?.refreshToken;
    if (
      !req.cookies?.accessToken &&
      !req.cookies?.refreshToken &&
      typeof token === "string" &&
      verifyRefreshToken(token)
    ) {
      return next();
    }
    return this.validate(req, res, next);
  };

  private validate(req: Request, res: Response, next: NextFunction) {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    if (validateRequest(req)) return next();
    return res
      .status(403)
      .json({ code: 403, status: "error", message: "Invalid or missing CSRF token" });
  }
}
