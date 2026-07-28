import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAccessToken, TokenPayload } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

/**
 * Retrieves current authenticated user session payload from cookies
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;
  return verifyAccessToken(token);
}

/**
 * Enforces authenticated session; throws error or returns payload
 */
export async function requireAuth(): Promise<TokenPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }
  return user;
}

/**
 * Enforces Admin or Super Admin role
 */
export async function requireAdmin(): Promise<TokenPayload> {
  const user = await requireAuth();
  if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new Error("FORBIDDEN: Admin permissions required");
  }
  return user;
}

/**
 * Fetches full DB user object for current user
 */
export async function getFullDbUser() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return null;

  return prisma.user.findUnique({
    where: { id: sessionUser.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      avatarUrl: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      addresses: {
        orderBy: { isDefault: "desc" },
      },
    },
  });
}
