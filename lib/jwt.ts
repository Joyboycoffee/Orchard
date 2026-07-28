import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "orchard_super_secret_jwt_key_32chars_min"
);
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "orchard_super_secret_refresh_key_32chars_min"
);

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  fullName: string;
}

/**
 * Sign an Access Token (valid for 1 day) - Edge & Node compatible
 */
export async function signAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

/**
 * Sign a Refresh Token (valid for 7 days) - Edge & Node compatible
 */
export async function signRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_REFRESH_SECRET);
}

/**
 * Verify Access Token (Edge & Node compatible)
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as Role,
      fullName: payload.fullName as string,
    };
  } catch {
    return null;
  }
}

/**
 * Verify Refresh Token (Edge & Node compatible)
 */
export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as Role,
      fullName: payload.fullName as string,
    };
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = "orchard_token";
export const REFRESH_COOKIE_NAME = "orchard_refresh_token";
