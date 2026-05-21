import {
  randomBytes,
  scrypt as _scrypt,
  timingSafeEqual,
  createHash,
} from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

/** Hash a password with scrypt + random salt. Format: salt:hash (hex). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const keyBuf = Buffer.from(key, "hex");
  if (keyBuf.length !== derived.length) return false;
  return timingSafeEqual(keyBuf, derived);
}

/** Cryptographically random URL-safe token. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** SHA-256 hex digest — used to store API keys without keeping the plaintext. */
export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
