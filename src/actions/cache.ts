"use server";

import { revalidateTag } from "next/cache";

// Cache tags for different types of data
export const CACHE_TAGS = {
  ALL_ENTRIES: "all-entries",
  YEARLY_TOTALS: "yearly-totals",
  MONTHLY_TOTALS: "monthly-totals",
  DAILY_TOTALS: "daily-totals",
  NAMES: "names",
  STATS: "stats",
  USER_PROFILE: "user-profile",
} as const;

// Cache duration in seconds (24 hours)
export const CACHE_DURATION = 24 * 60 * 60;

// Utility function to revalidate all caches when data changes
export async function revalidateAllCaches() {
  Object.values(CACHE_TAGS).forEach((tag) => {
    revalidateTag(tag);
  });
}