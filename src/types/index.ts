export interface DashboardStats {
  totalEntries: number;
  uniqueNames: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
  averagePerMonth: number;
}

export interface YearlyData {
  year: string;
  count: number;
}

export interface MonthlyData {
  year: string;
  month: string;
  count: number;
  monthName?: string;
}

export interface DailyData {
  date: string;
  count: number;
  day?: number;
}

export interface NameData {
  name: string;
  count: number;
  firstEntry?: string;
  totalEntries?: number;
}

export interface GapData {
  gap: number;
  startDate: string | null;
  endDate: string | null;
}

export interface StreakData {
  streak: number;
  startDate: string | null;
  endDate: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
}
