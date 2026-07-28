"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/lib/passwords";
import {
  signAccessToken,
  signRefreshToken,
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "@/lib/jwt";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/utils";

// Validation Schemas
const RegisterSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const AddressSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().min(10, "Valid phone number required"),
  street: z.string().min(3, "Street address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().min(6, "Valid 6-digit pincode required"),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
});

/**
 * Server Action: Register User
 */
export async function registerAction(formData: z.infer<typeof RegisterSchema>) {
  try {
    const validated = RegisterSchema.parse(formData);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return createErrorResponse("An account with this email already exists.");
    }

    const passwordHash = await hashPassword(validated.password);

    const newUser = await prisma.user.create({
      data: {
        fullName: validated.fullName,
        email: validated.email,
        passwordHash,
        phone: validated.phone || null,
        cart: { create: {} },
        wishlist: { create: {} },
      },
    });

    // Generate JWT Tokens
    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // Set Cookies
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 1 day
      path: "/",
    });

    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800, // 7 days
      path: "/",
    });

    return createSuccessResponse(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        },
      },
      "Account created successfully!"
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Registration failed";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Login User
 */
export async function loginAction(formData: z.infer<typeof LoginSchema>) {
  try {
    const validated = LoginSchema.parse(formData);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user || user.isDeleted || !user.isActive) {
      return createErrorResponse("Invalid email or password.");
    }

    const isValidPassword = await comparePassword(validated.password, user.passwordHash);

    if (!isValidPassword) {
      return createErrorResponse("Invalid email or password.");
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });

    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800,
      path: "/",
    });

    return createSuccessResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      "Logged in successfully!"
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Login failed";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Logout User
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
  return createSuccessResponse(null, "Logged out successfully");
}

/**
 * Server Action: Add Address
 */
export async function addAddressAction(formData: z.infer<typeof AddressSchema>) {
  try {
    const session = await requireAuth();
    const validated = AddressSchema.parse(formData);

    if (validated.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...validated,
        userId: session.userId,
        isDefault: validated.isDefault ?? false,
      },
    });

    return createSuccessResponse(address, "Address added successfully");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to add address";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Delete Address
 */
export async function deleteAddressAction(addressId: string) {
  try {
    const session = await requireAuth();

    await prisma.address.deleteMany({
      where: {
        id: addressId,
        userId: session.userId,
      },
    });

    return createSuccessResponse(null, "Address deleted successfully");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete address";
    return createErrorResponse(errMessage);
  }
}
