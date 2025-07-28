// Barrel export file for all actions
// This maintains backward compatibility while providing organized separation of concerns

// Cache utilities
export {
  CACHE_TAGS,
  CACHE_DURATION,
  revalidateAllCaches,
} from "./cache";

// Hall of Fame data operations
export {
  getAllEntries,
  getYearlyTotals,
  getMonthlyTotals,
  getDailyTotalsForMonth,
  getTopHallOfFamers,
  getUniqueNames,
  getEntriesForName,
  getLongestGap,
  getLongestStreak,
  getYoungest,
  getFastest,
} from "./hall-of-fame";

// User profile management
export {
  updateUserProfile,
  getUserProfile,
  toggleEmailNotifications,
  exportUserData,
  deleteUserAccount,
} from "./user";