import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import {
  csrfCookieOptions,
  csrfSessionCookieName,
  generateCsrfToken,
} from "@/lib/csrf";
import { ok } from "@/utils/api-result";

// Issues a CSRF token bound to the browser's anonymous session cookie.
// The frontend fetches this before any signup/login request.
export function getCsrfTokenService(req: Request, res: Response) {
  if (!req.cookies[csrfSessionCookieName]) {
    const sessionId = randomBytes(32).toString("hex");
    req.cookies[csrfSessionCookieName] = sessionId;
    res.cookie(csrfSessionCookieName, sessionId, csrfCookieOptions);
  }

  const csrfToken = generateCsrfToken(req, res);
  res.setHeader("Cache-Control", "no-store");
  return ok({ csrfToken });
}
