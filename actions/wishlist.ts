"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/utils";

/**
 * Server Action: Get User Wishlist
 */
export async function getWishlistAction() {
  try {
    const session = await requireAuth();

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true } } },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: session.userId },
        include: { items: { include: { product: { include: { images: true } } } } },
      });
    }

    return createSuccessResponse(wishlist.items);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to load wishlist";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Toggle Product Wishlist Status
 */
export async function toggleWishlistAction(productId: string) {
  try {
    const session = await requireAuth();

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: session.userId } });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return createSuccessResponse({ inWishlist: false }, "Removed from wishlist");
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      return createSuccessResponse({ inWishlist: true }, "Added to wishlist");
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update wishlist";
    return createErrorResponse(errMessage);
  }
}
