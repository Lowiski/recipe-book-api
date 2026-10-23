import { TokenRepository } from "@/repositories/token-repository";
import { fail, ok } from "@/utils/api-result";

export async function logoutService(refreshToken?: string) {
  const tokenRepository = new TokenRepository();

  try {
    if (refreshToken) {
      const dbToken = await tokenRepository.findActiveRefreshToken(refreshToken);
      if (dbToken) await tokenRepository.revokeToken(dbToken.id);
    }
    return ok(undefined, "Successfully logged out");
  } catch (error) {
    console.error("logoutService Error", error);
    return fail(500, "Failed to logout");
  }
}
