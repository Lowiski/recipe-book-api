import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type JwtPayload } from "@/lib/jwt";

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
  authMethod?: "bearer" | "cookie";
};

export class AuthMiddleware {
  // Accepts the access token from an Authorization header (API clients)
  // or from the HttpOnly cookie (browser clients).
  execute = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    let accessToken = extractBearerToken(req.headers.authorization);
    const authMethod: "bearer" | "cookie" = accessToken ? "bearer" : "cookie";

    if (!accessToken && req.cookies) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      return res
        .status(401)
        .json({ code: 401, status: "error", message: "Authentication required" });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return res
        .status(401)
        .json({ code: 401, status: "error", message: "Invalid or expired token" });
    }

    authReq.user = payload;
    authReq.authMethod = authMethod;
    return next();
  };
}

function extractBearerToken(header?: string) {
  if (!header) return undefined;
  const [scheme, token] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return undefined;
  return token.trim();
}
