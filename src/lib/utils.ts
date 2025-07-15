import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utility functions
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Age formatting utility
export function formatAge(days: number): string {
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  const months = Math.floor(remainingDays / 30);
  const finalDays = remainingDays % 30;

  const parts = [];
  if (years > 0) {
    parts.push(`${years}y`);
  }
  if (months > 0) {
    parts.push(`${months}m`);
  }
  if (finalDays > 0 || parts.length === 0) {
    parts.push(`${finalDays}d`);
  }

  return parts.join(" ");
}

// Elapsed time formatting utility
export function formatElapsedTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
}
