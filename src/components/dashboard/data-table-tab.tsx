"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
  GripVertical,
  RefreshCw,
  X,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { getAllEntries, revalidateAllCaches } from "@/lib/actions";
import { formatDate, formatAge, formatElapsedTime } from "@/lib/utils";
import { HallOfFameEntry } from "@/lib/schema";

type SortColumn = keyof HallOfFameEntry | null;
type SortDirection = "asc" | "desc";

// Custom long-press hook
const useLongPress = (callback: () => void, ms = 500) => {
  const [startLongPress, setStartLongPress] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (startLongPress) {
      timeoutRef.current = setTimeout(callback, ms);
    } else {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [startLongPress, callback, ms]);

  const start = useCallback(() => {
    setStartLongPress(true);
  }, []);

  const stop = useCallback(() => {
    setStartLongPress(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};

// Mobile-friendly tooltip component
const MobileTooltip = ({
  children,
  content,
  isOpen,
  onOpenChange,
  longPressHandlers,
}: {
  children: React.ReactNode;
  content: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  longPressHandlers: ReturnType<typeof useLongPress>;
}) => (
  <>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-4 max-w-sm mx-4 max-h-64 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Full Content</h3>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm break-words">{content}</p>
        </div>
      </div>
    )}
    <div {...longPressHandlers}>{children}</div>
  </>
);

export function DataTableTab() {
  const {
    data: entriesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-entries"],
    queryFn: getAllEntries,
  });

  // Function to handle cache revalidation and data refresh
  const handleRefresh = async () => {
    try {
      await revalidateAllCaches();
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Long-press handlers for tooltips
  const nameLongPress = useLongPress(() => {}, 500);
  const notesLongPress = useLongPress(() => {}, 500);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // State for sorting
  const [sortColumn, setSortColumn] = useState<SortColumn>("parsedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // State for filtering
  const [globalSearch, setGlobalSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState({
    participantNumber: "",
    name: "",
    parsedDate: "",
    notes: "",
    elapsedTime: "",
    completionCount: "",
    age: "",
  });

  // State for column widths (in pixels)
  const [columnWidths, setColumnWidths] = useState({
    participantNumber: 60, // Just wide enough for 5 digits
    name: 230, // Wider for long names
    parsedDate: 105,
    notes: 150,
    elapsedTime: 80,
    completionCount: 100,
    age: 80,
  });

  // State for tooltip
  const [tooltipVisible, setTooltipVisible] = useState<Record<string, boolean>>(
    {}
  );

  // Refs for resize functionality
  const tableRef = useRef<HTMLTableElement>(null);
  const isResizing = useRef<string | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Wrap entries derivation in useMemo to fix react-hooks/exhaustive-deps warning
  const entries = useMemo(() => {
    return entriesData?.success ? entriesData.data || [] : [];
  }, [entriesData]);

  // Filtered and sorted data
  const filteredAndSortedEntries = useMemo(() => {
    let filteredEntries = [...entries];

    // Apply global search
    if (globalSearch) {
      filteredEntries = filteredEntries.filter((entry) =>
        Object.values(entry).some((value) =>
          value?.toString().toLowerCase().includes(globalSearch.toLowerCase())
        )
      );
    }

    // Apply column filters
    if (columnFilters.participantNumber) {
      filteredEntries = filteredEntries.filter((entry) =>
        entry.participantNumber
          .toString()
          .includes(columnFilters.participantNumber)
      );
    }
    if (columnFilters.name) {
      filteredEntries = filteredEntries.filter((entry) =>
        entry.name.toLowerCase().includes(columnFilters.name.toLowerCase())
      );
    }

    if (columnFilters.parsedDate) {
      filteredEntries = filteredEntries.filter((entry) =>
        formatDate(entry.parsedDate)
          .toLowerCase()
          .includes(columnFilters.parsedDate.toLowerCase())
      );
    }

    if (columnFilters.notes) {
      filteredEntries = filteredEntries.filter(
        (entry) =>
          entry.notes
            ?.toLowerCase()
            .includes(columnFilters.notes.toLowerCase()) ?? false
      );
    }

    if (columnFilters.elapsedTime) {
      filteredEntries = filteredEntries.filter(
        (entry) =>
          entry.elapsedTime?.toString().includes(columnFilters.elapsedTime) ??
          false
      );
    }

    if (columnFilters.completionCount) {
      filteredEntries = filteredEntries.filter(
        (entry) =>
          entry.completionCount
            ?.toString()
            .includes(columnFilters.completionCount) ?? false
      );
    }

    if (columnFilters.age) {
      filteredEntries = filteredEntries.filter(
        (entry) => entry.age?.toString().includes(columnFilters.age) ?? false
      );
    }

    // Apply sorting
    if (sortColumn) {
      filteredEntries.sort((a, b) => {
        // Replace 'any' types with proper union types
        let aValue: string | number | Date | null = a[sortColumn];
        let bValue: string | number | Date | null = b[sortColumn];

        // Handle null values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortDirection === "asc" ? -1 : 1;
        if (bValue == null) return sortDirection === "asc" ? 1 : -1;

        // Handle date sorting
        if (sortColumn === "parsedDate") {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }

        // Handle string sorting
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredEntries;
  }, [entries, globalSearch, columnFilters, sortColumn, sortDirection]);

  // Paginated data
  const totalPages = Math.ceil(filteredAndSortedEntries.length / pageSize);
  const paginatedEntries = useMemo(() => {
    if (pageSize === filteredAndSortedEntries.length) {
      return filteredAndSortedEntries; // Show all
    }
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedEntries.slice(start, end);
  }, [filteredAndSortedEntries, currentPage, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [globalSearch, columnFilters]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [column]: value }));
    setCurrentPage(1);
  };

  // Tooltip handlers
  const handleTooltipToggle = (entryId: string, show: boolean) => {
    setTooltipVisible((prev) => ({ ...prev, [entryId]: show }));
  };

  // Resize handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    const diff = e.clientX - startX.current;
    const newWidth = Math.max(80, startWidth.current + diff); // Minimum width of 80px

    setColumnWidths((prev) => ({
      ...prev,
      [isResizing.current!]: newWidth,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [handleMouseMove]);

  const handleMouseDown = (
    column: keyof typeof columnWidths,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = column;
    startX.current = e.clientX;
    startWidth.current = columnWidths[column];

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Set responsive column widths based on screen size
  useEffect(() => {
    const updateColumnWidths = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint

      setColumnWidths({
        participantNumber: isDesktop ? 80 : 70,
        name: isDesktop ? 250 : 200,
        parsedDate: isDesktop ? 120 : 100,
        notes: isDesktop ? 150 : 130,
        elapsedTime: isDesktop ? 80 : 75,
        completionCount: isDesktop ? 100 : 90,
        age: isDesktop ? 80 : 75,
      });
    };

    updateColumnWidths();
    window.addEventListener("resize", updateColumnWidths);

    return () => window.removeEventListener("resize", updateColumnWidths);
  }, []);

  const SortableHeader = ({
    column,
    children,
  }: {
    column: SortColumn;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer select-none relative border-r border-border/50"
      onClick={() => handleSort(column)}
      style={{
        width: column
          ? columnWidths[column as keyof typeof columnWidths]
          : "auto",
        minWidth: column
          ? columnWidths[column as keyof typeof columnWidths]
          : "auto",
        maxWidth: column
          ? columnWidths[column as keyof typeof columnWidths]
          : "auto",
      }}
    >
      <div className="flex items-start gap-1 pr-2">
        <div className="flex-1 min-w-0">{children}</div>
        <div className="flex flex-col flex-shrink-0">
          <ChevronUp
            className={`h-3 w-3 ${
              sortColumn === column && sortDirection === "asc"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 -mt-1 ${
              sortColumn === column && sortDirection === "desc"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          />
        </div>
      </div>
      {column && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 flex items-center justify-center group"
          onMouseDown={(e) =>
            handleMouseDown(column as keyof typeof columnWidths, e)
          }
        >
          <GripVertical className="h-3 w-3 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </TableHead>
  );

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-4 w-4 mr-2 flex-shrink-0" /> Hall of Famers
        </CardTitle>
        <CardDescription>
          Total:{filteredAndSortedEntries.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-xs sm:text-sm"
            >
              <RefreshCw
                className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                const newPageSize =
                  value === "all"
                    ? filteredAndSortedEntries.length
                    : parseInt(value);
                setPageSize(newPageSize);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-32 text-xs sm:text-sm">
                <SelectValue className="text-xs sm:text-sm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20" className="text-xs sm:text-sm">
                  20 per page
                </SelectItem>
                <SelectItem value="50" className="text-xs sm:text-sm">
                  50 per page
                </SelectItem>
                <SelectItem value="100" className="text-xs sm:text-sm">
                  100 per page
                </SelectItem>
                <SelectItem value="all" className="text-xs sm:text-sm">
                  Show all
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Column Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Filter name..."
              value={columnFilters.name}
              onChange={(e) => handleColumnFilterChange("name", e.target.value)}
              className="pl-8 text-xs"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Filter parsed date..."
              value={columnFilters.parsedDate}
              onChange={(e) =>
                handleColumnFilterChange("parsedDate", e.target.value)
              }
              className="pl-8 text-xs"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Filter notes..."
              value={columnFilters.notes}
              onChange={(e) =>
                handleColumnFilterChange("notes", e.target.value)
              }
              className="pl-8 text-xs"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Filter completion count..."
              value={columnFilters.completionCount}
              onChange={(e) =>
                handleColumnFilterChange("completionCount", e.target.value)
              }
              className="pl-8 text-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table ref={tableRef} className="table-fixed">
              <TableHeader>
                <TableRow>
                  <SortableHeader column="parsedDate">Date</SortableHeader>
                  <SortableHeader column="name">Name</SortableHeader>
                  <SortableHeader column="participantNumber">ID</SortableHeader>
                  <SortableHeader column="notes">Notes</SortableHeader>
                  <SortableHeader column="elapsedTime">Time</SortableHeader>
                  <SortableHeader column="completionCount">
                    <div className="whitespace-normal leading-tight text-xs sm:text-sm">
                      <span className="hidden sm:inline">Completion</span>
                      <span className="sm:hidden">Comp.</span>
                    </div>
                  </SortableHeader>
                  <SortableHeader column="age">Age</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell
                        style={{
                          width: columnWidths.parsedDate,
                          minWidth: columnWidths.parsedDate,
                          maxWidth: columnWidths.parsedDate,
                        }}
                        className="border-r border-border/50"
                      >
                        <div className="animate-pulse bg-muted h-4 rounded"></div>
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.name,
                          maxWidth: columnWidths.name,
                        }}
                        className="border-r border-border/50"
                      >
                        <div className="animate-pulse bg-muted h-4 rounded"></div>
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.participantNumber,
                          minWidth: columnWidths.participantNumber,
                          maxWidth: columnWidths.participantNumber,
                        }}
                        className="border-r border-border/50"
                      >
                        <div className="animate-pulse bg-muted h-4 rounded"></div>
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.notes,
                          minWidth: columnWidths.notes,
                          maxWidth: columnWidths.notes,
                        }}
                        className="border-r border-border/50"
                      >
                        <div className="animate-pulse bg-muted h-4 rounded"></div>
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.elapsedTime,
                          minWidth: columnWidths.elapsedTime,
                          maxWidth: columnWidths.elapsedTime,
                        }}
                        className="border-r border-border/50"
                      >
                        <div className="animate-pulse bg-muted h-4 rounded"></div>
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.completionCount,
                          minWidth: columnWidths.completionCount,
                          maxWidth: columnWidths.completionCount,
                        }}
                        className="border-r border-border/50"
                      >
                        <div className="animate-pulse bg-muted h-4 rounded"></div>
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.age,
                          minWidth: columnWidths.age,
                          maxWidth: columnWidths.age,
                        }}
                      >
                        <div className="animate-pulse bg-muted h-4 rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedEntries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No entries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell
                        className="text-xs sm:text-sm border-r border-border/50"
                        style={{
                          width: columnWidths.parsedDate,
                          minWidth: columnWidths.parsedDate,
                          maxWidth: columnWidths.parsedDate,
                        }}
                      >
                        {formatDate(entry.parsedDate)}
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.name,
                          minWidth: columnWidths.name,
                          maxWidth: columnWidths.name,
                        }}
                        className="text-xs sm:text-sm font-medium border-r border-border/50 truncate"
                      >
                        <MobileTooltip
                          content={entry.name}
                          isOpen={tooltipVisible[entry.id.toString()] || false}
                          onOpenChange={(open) =>
                            handleTooltipToggle(entry.id.toString(), open)
                          }
                          longPressHandlers={nameLongPress}
                        >
                          <div className="truncate">{entry.name}</div>
                        </MobileTooltip>
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.participantNumber,
                          minWidth: columnWidths.participantNumber,
                          maxWidth: columnWidths.participantNumber,
                        }}
                        className="text-xs sm:text-sm font-medium border-r border-border/50"
                      >
                        <Badge variant="outline">
                          {entry.participantNumber}
                        </Badge>
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.notes,
                          minWidth: columnWidths.notes,
                          maxWidth: columnWidths.notes,
                        }}
                        className="text-xs sm:text-sm font-medium border-r border-border/50 truncate"
                      >
                        {entry.notes ? (
                          <MobileTooltip
                            content={entry.notes}
                            isOpen={
                              tooltipVisible[`notes-${entry.id}`] || false
                            }
                            onOpenChange={(open) =>
                              handleTooltipToggle(`notes-${entry.id}`, open)
                            }
                            longPressHandlers={notesLongPress}
                          >
                            <div className="truncate">{entry.notes}</div>
                          </MobileTooltip>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.elapsedTime,
                          minWidth: columnWidths.elapsedTime,
                          maxWidth: columnWidths.elapsedTime,
                        }}
                        className="text-xs sm:text-sm font-medium border-r border-border/50"
                      >
                        {entry.elapsedTime ? (
                          formatElapsedTime(entry.elapsedTime)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.completionCount,
                          minWidth: columnWidths.completionCount,
                          maxWidth: columnWidths.completionCount,
                        }}
                        className="text-xs sm:text-sm font-medium border-r border-border/50"
                      >
                        {entry.completionCount ? (
                          <Badge variant="secondary">
                            {entry.completionCount}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          width: columnWidths.age,
                          minWidth: columnWidths.age,
                          maxWidth: columnWidths.age,
                        }}
                        className="text-xs sm:text-sm font-medium"
                      >
                        {entry.age ? (
                          formatAge(entry.age)
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {pageSize < filteredAndSortedEntries.length && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs sm:text-sm md:text-base text-muted-foreground text-center sm:text-left">
              <span className="hidden sm:inline">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * pageSize + 1,
                  filteredAndSortedEntries.length
                )}{" "}
                to{" "}
                {Math.min(
                  currentPage * pageSize,
                  filteredAndSortedEntries.length
                )}{" "}
                of {filteredAndSortedEntries.length} entries
              </span>
              <span className="sm:hidden">
                {currentPage} of {totalPages}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
