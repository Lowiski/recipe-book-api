import bcrypt from "bcrypt";
import { UserRepository } from "@/repositories/user-repository";
import { created, fail } from "@/utils/api-result";

const EMAIL_IN_USE = "Email already exists";

export async function signupService(name: string, email: string, password: string) {
  const userRepository = new UserRepository();

  try {
    const existing = await userRepository.findByEmail(email);
    if (existing) return fail(400, EMAIL_IN_USE);

    // Hash before storing; a plain password never reaches the database.
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: passwordHash });

    return created({ user }, "Account created successfully!");
  } catch (error) {
    console.error("signupService Error", error);
    return fail(500, "Unable to create account");
  }
}
