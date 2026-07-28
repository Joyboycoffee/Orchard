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

/**
 * Server Action: Create Product (Admin Only)
 */
export async function createProductAction(data: {
  name: string;
  categorySlug: string;
  sku: string;
  basePrice: number;
  salePrice?: number;
  stockQuantity: number;
  imageUrl: string;
  shortDescription: string;
  description: string;
}) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const category = await prisma.category.findUnique({
      where: { slug: data.categorySlug },
    });

    if (!category) {
      return createErrorResponse("Category not found");
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
        sku: data.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        shortDescription: data.shortDescription,
        description: data.description || data.shortDescription,
        categoryId: category.id,
        basePrice: Number(data.basePrice),
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        stockQuantity: Number(data.stockQuantity),
        isFeatured: true,
        images: {
          create: [
            {
              url: data.imageUrl || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
              altText: data.name,
              isPrimary: true,
            },
          ],
        },
      },
    });

    return createSuccessResponse(product, "Product created successfully!");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create product";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Update Product (Admin Only)
 */
export async function updateProductAction(
  productId: string,
  data: {
    name?: string;
    basePrice?: number;
    salePrice?: number;
    stockQuantity?: number;
    imageUrl?: string;
    shortDescription?: string;
  }
) {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.basePrice !== undefined && { basePrice: Number(data.basePrice) }),
        ...(data.salePrice !== undefined && { salePrice: data.salePrice ? Number(data.salePrice) : null }),
        ...(data.stockQuantity !== undefined && { stockQuantity: Number(data.stockQuantity) }),
        ...(data.shortDescription && { shortDescription: data.shortDescription }),
      },
    });

    if (data.imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId } });
      await prisma.productImage.create({
        data: {
          productId,
          url: data.imageUrl,
          altText: product.name,
          isPrimary: true,
        },
      });
    }

    return createSuccessResponse(product, "Product updated successfully!");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update product";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Delete Product (Admin Only)
 */
export async function deleteProductAction(productId: string) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true, isActive: false },
    });
    return createSuccessResponse(null, "Product deleted successfully!");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete product";
    return createErrorResponse(errMessage);
  }
}

