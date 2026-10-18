import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { ENV } from "@/config/env";

export type JwtPayload = {
  sub: string;
  role: string;
  type: "access" | "refresh";
};

export enum TokenExpiry {
  ACCESS_TOKEN = "15m",
  REFRESH_TOKEN = "7d",
}

export function signAccessToken(userId: string, role: string) {
  const payload: JwtPayload = { sub: userId, role, type: "access" };
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: TokenExpiry.ACCESS_TOKEN,
    jwtid: randomUUID(),
  });
}

export function signRefreshToken(userId: string, role: string) {
  const payload: JwtPayload = { sub: userId, role, type: "refresh" };
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: TokenExpiry.REFRESH_TOKEN,
    jwtid: randomUUID(),
  });
}

function verify(token: string, expectedType: "access" | "refresh") {
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    return payload.type === expectedType ? payload : null;
  } catch {
    return null;
  }
}

export function verifyAccessToken(token: string) {
  return verify(token, "access");
}

export function verifyRefreshToken(token: string) {
  return verify(token, "refresh");
}

export function toMilliseconds(duration?: string | number) {
  if (duration === undefined) return undefined;
  if (typeof duration === "number") return duration * 1000;

  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return undefined;

  const value = Number(match[1]);
  switch (match[2]) {
    case "s":
      return value * 1_000;
    case "m":
      return value * 60 * 1_000;
    case "h":
      return value * 60 * 60 * 1_000;
    case "d":
      return value * 24 * 60 * 60 * 1_000;
    default:
      return undefined;
  }
}
