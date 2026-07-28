"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/utils";

export async function addAddressAction(data: {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return createErrorResponse("Authentication required");
    }

    const existingCount = await prisma.address.count({
      where: { userId: user.userId },
    });

    const isFirst = existingCount === 0;

    if (isFirst || data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.userId,
        fullName: data.fullName,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country || "India",
        isDefault: isFirst || Boolean(data.isDefault),
      },
    });

    return createSuccessResponse(address, "Address added successfully!");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to add address";
    return createErrorResponse(errMessage);
  }
}
