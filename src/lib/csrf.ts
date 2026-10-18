import { randomBytes } from "node:crypto";
import { doubleCsrf } from "csrf-csrf";
import { ENV, IS_PRODUCTION } from "@/config/env";

export const csrfCookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? ("none" as const) : ("lax" as const),
  path: "/",
};

// The __Host- prefix requires Secure + path=/ and is only valid over HTTPS.
export const csrfSessionCookieName = IS_PRODUCTION
  ? "__Host-csrf-session"
  : "csrf-session";
export const csrfTokenCookieName = IS_PRODUCTION
  ? "__Host-csrf-token"
  : "csrf-token";

const csrfSecret = ENV.CSRF_SECRET || randomBytes(32).toString("hex");

export const { generateCsrfToken, validateRequest } = doubleCsrf({
  getSecret: () => csrfSecret,
  // Bind the CSRF token to the browser's cookie session so a stolen
  // token from one session cannot be used in another.
  getSessionIdentifier: (req) =>
    req.cookies?.refreshToken ||
    req.cookies?.accessToken ||
    req.cookies?.[csrfSessionCookieName] ||
    "",
  cookieName: csrfTokenCookieName,
  cookieOptions: csrfCookieOptions,
  getCsrfTokenFromRequest: (req) => req.get("x-csrf-token"),
});
