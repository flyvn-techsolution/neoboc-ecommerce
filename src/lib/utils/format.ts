import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string,
  locale: string = "vi-VN",
  currency: string = "VND"
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}

export function formatDate(
  date: Date | string,
  locale: string = "vi-VN",
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(dateObj);
}

export function formatNumber(
  value: number,
  locale: string = "vi-VN"
): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return `${value.toFixed(decimals)}%`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function normalizeImageSrc(
  src: string | null | undefined
): string | null {
  if (!src) return null;

  const value = src.trim();
  if (!value) return null;

  if (value.startsWith("/")) return value;

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
  if (hasScheme) {
    try {
      const parsed = new URL(value);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString();
      }
      return null;
    } catch {
      return null;
    }
  }

  return `/${value.replace(/^\.?\/*/, "")}`;
}

export function toImageArray(images: unknown): string[] {
  const normalizeList = (values: unknown[]): string[] =>
    values.flatMap((value) => {
      if (typeof value !== "string") return [];
      const normalized = normalizeImageSrc(value);
      return normalized ? [normalized] : [];
    });

  if (Array.isArray(images)) {
    return normalizeList(images);
  }

  if (typeof images === "string") {
    const trimmed = images.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return normalizeList(parsed);
      }
    } catch {
      // fallback to single raw url/path below
    }

    const normalized = normalizeImageSrc(trimmed);
    return normalized ? [normalized] : [];
  }

  return [];
}
