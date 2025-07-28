"use server";

import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "./cache";

// Utility function to revalidate all caches when data changes
export async function revalidateAllCaches() {
  Object.values(CACHE_TAGS).forEach((tag) => {
    revalidateTag(tag);
  });
}