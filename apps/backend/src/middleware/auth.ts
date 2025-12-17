import bcrypt from 'bcryptjs';
import { HTTPException } from 'hono/http-exception';

export interface PasswordProtectedEntity {
  passwordHash: string | null;
}

export async function requirePasswordAuth(
  entity: PasswordProtectedEntity,
  providedPassword?: string | null,
): Promise<void> {
  if (!entity.passwordHash) {
    return;
  }

  if (!providedPassword) {
    throw new HTTPException(401, { message: 'Password is required' });
  }

  const isValid = await bcrypt.compare(providedPassword, entity.passwordHash);
  if (!isValid) {
    throw new HTTPException(401, { message: 'Invalid password' });
  }
}
