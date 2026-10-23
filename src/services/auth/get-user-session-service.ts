import { UserRepository } from "@/repositories/user-repository";
import { fail, ok } from "@/utils/api-result";

export async function getUserSessionService(userId: string) {
  const userRepository = new UserRepository();

  try {
    const user = await userRepository.findById(userId);
    if (!user) return fail(404, "User not found");

    return ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("getUserSessionService Error", error);
    return fail(500, "Failed to fetch user data");
  }
}
