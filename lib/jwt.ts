import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "orchard_super_secret_jwt_key_32chars_min";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "orchard_super_secret_refresh_key_32chars_min";

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  fullName: string;
}

/**
 * Sign an Access Token (valid for 1 day)
 */
export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

/**
 * Sign a Refresh Token (valid for 7 days)
 */
export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verify Refresh Token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = "orchard_token";
export const REFRESH_COOKIE_NAME = "orchard_refresh_token";
