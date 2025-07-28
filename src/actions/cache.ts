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

// Re-export server action from separate file
export { revalidateAllCaches } from "./cache-server";