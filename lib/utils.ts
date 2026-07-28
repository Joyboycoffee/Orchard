import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes cleanly using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric price into INR currency string (or custom currency)
 */
export function formatCurrency(
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a Date object or timestamp string into readable format
 */
export function formatDate(
  dateInput: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

/**
 * Converts a string into a URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncates text with trailing ellipsis
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Calculates discount percentage from original price and discounted price
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (!originalPrice || originalPrice <= salePrice) return 0;
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Generates a unique, professional Order Number (e.g. ORCH-20260727-8942)
 */
export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORCH-${dateStr}-${random}`;
}

/**
 * Calculates estimated delivery date based on pincode / lead time days
 */
export function getEstimatedDeliveryDate(leadTimeDays: number = 4): {
  minDate: string;
  maxDate: string;
} {
  const min = new Date();
  min.setDate(min.getDate() + leadTimeDays);

  const max = new Date();
  max.setDate(max.getDate() + leadTimeDays + 3);

  return {
    minDate: formatDate(min, { month: "short", day: "numeric" }),
    maxDate: formatDate(max, { month: "short", day: "numeric", year: "numeric" }),
  };
}

/**
 * Mask sensitive email addresses (e.g., g***v@gmail.com)
 */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (user.length <= 2) return `${user}***@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

/**
 * Standard API JSON response structure helper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export function createSuccessResponse<T>(
  data: T,
  message: string = "Operation successful"
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function createErrorResponse(
  error: string,
  errors?: Record<string, string[]>
): ApiResponse {
  return {
    success: false,
    error,
    errors,
  };
}
