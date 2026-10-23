import type { Response } from "express";
import { IS_PRODUCTION } from "@/config/env";
import { toMilliseconds, TokenExpiry } from "@/lib/jwt";
import {
  csrfCookieOptions,
  csrfSessionCookieName,
  csrfTokenCookieName,
} from "@/lib/csrf";

function authCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge,
  };
}

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
) {
  res.cookie(
    "accessToken",
    tokens.accessToken,
    authCookieOptions(toMilliseconds(TokenExpiry.ACCESS_TOKEN)),
  );
  res.cookie(
    "refreshToken",
    tokens.refreshToken,
    authCookieOptions(toMilliseconds(TokenExpiry.REFRESH_TOKEN)),
  );
}

export function clearAuthCookies(res: Response) {
  const options = { ...authCookieOptions(), expires: new Date(0) };
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
  res.clearCookie(csrfSessionCookieName, csrfCookieOptions);
  res.clearCookie(csrfTokenCookieName, csrfCookieOptions);
}
