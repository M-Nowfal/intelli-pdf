import bcrypt from "bcryptjs";

export async function hash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
}

export async function compare(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}