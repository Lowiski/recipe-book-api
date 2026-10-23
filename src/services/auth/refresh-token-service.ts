import { UserRepository } from "@/repositories/user-repository";
import { TokenRepository } from "@/repositories/token-repository";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt";
import { fail, ok } from "@/utils/api-result";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function refreshTokenService(refreshToken?: string) {
  const tokenRepository = new TokenRepository();
  const userRepository = new UserRepository();

  try {
    if (!refreshToken) return fail(401, "Missing refresh token");

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) return fail(401, "Invalid or expired refresh token");

    const dbToken = await tokenRepository.findActiveRefreshToken(refreshToken);
    if (!dbToken) {
      return fail(401, "Token is no longer valid or has already been used");
    }

    const user = await userRepository.findById(payload.sub);
    if (!user) return fail(404, "User not found");

    const consumed = await tokenRepository.consumeToken(dbToken.id);
    if (!consumed) return fail(401, "Refresh token has already been used");

    const accessToken = signAccessToken(user.id, user.role);
    const newRefreshToken = signRefreshToken(user.id, user.role);

    await tokenRepository.createRefreshToken({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    return ok({ accessToken, refreshToken: newRefreshToken }, "Token refreshed");
  } catch (error) {
    console.error("refreshTokenService Error", error);
    return fail(500, "Failed to refresh token");
  }
}
