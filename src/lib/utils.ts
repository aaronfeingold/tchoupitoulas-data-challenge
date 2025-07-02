import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  parse,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utility functions
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy");
}

export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd");
}

export function parseDate(dateStr: string): Date {
  // Try different date formats commonly used
  const formats = [
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "MM-dd-yyyy",
    "MMM dd, yyyy",
    "dd/MM/yyyy",
  ];

  for (const formatStr of formats) {
    try {
      const parsed = parse(dateStr, formatStr, new Date());
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch (error) {
      console.error(`Failed to parse date with format ${formatStr}:`, error);
      continue;
    }
  }

  // Fallback to native Date parsing
  const fallback = new Date(dateStr);
  if (!isNaN(fallback.getTime())) {
    return fallback;
  }

  throw new Error(`Unable to parse date: ${dateStr}`);
}

export function getDateRange(date: Date, type: "month" | "year") {
  switch (type) {
    case "month":
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    case "year":
      return {
        start: startOfYear(date),
        end: endOfYear(date),
      };
    default:
      throw new Error(`Invalid date range type: ${type}`);
  }
}

export function getDaysBetween(startDate: Date, endDate: Date): number {
  return differenceInDays(endDate, startDate);
}

// Number formatting utilities
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatPercentage(num: number, decimals: number = 1): string {
  return `${(num * 100).toFixed(decimals)}%`;
}
