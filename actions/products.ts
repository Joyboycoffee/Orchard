"use server";

import { prisma } from "@/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "@/lib/utils";

export interface GetProductsParams {
  categorySlug?: string;
  subcategorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  variety?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popularity";
  page?: number;
  limit?: number;
  featuredOnly?: boolean;
}

/**
 * Server Action: Get Products with Search, Filters, and Pagination
 */
export async function getProductsAction(params: GetProductsParams = {}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      isDeleted: false,
    };

    if (params.featuredOnly) {
      where.isFeatured = true;
    }

    if (params.categorySlug) {
      where.category = { slug: params.categorySlug };
    }

    if (params.subcategorySlug) {
      where.subcategory = { slug: params.subcategorySlug };
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { variety: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.minPrice || params.maxPrice) {
      where.basePrice = {};
      if (params.minPrice) where.basePrice.gte = params.minPrice;
      if (params.maxPrice) where.basePrice.lte = params.maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sortBy === "price_asc") orderBy = { basePrice: "asc" };
    if (params.sortBy === "price_desc") orderBy = { basePrice: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { name: true, slug: true } },
          subcategory: { select: { name: true, slug: true } },
          images: { orderBy: { isPrimary: "desc" } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
          : 5.0;

      return {
        ...p,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: p.reviews.length,
      };
    });

    return createSuccessResponse({
      products: formattedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch products";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Get Single Product Detail by Slug
 */
export async function getProductBySlugAction(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        subcategory: true,
        brand: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        reviews: {
          include: {
            user: { select: { fullName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        questions: {
          include: {
            user: { select: { fullName: true } },
            answers: {
              include: { user: { select: { fullName: true } } },
            },
          },
        },
      },
    });

    if (!product || product.isDeleted || !product.isActive) {
      return createErrorResponse("Product not found");
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        : 5.0;

    return createSuccessResponse({
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch product details";
    return createErrorResponse(errMessage);
  }
}
