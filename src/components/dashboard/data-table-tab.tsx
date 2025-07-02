"use client";

import { useQuery } from "@tanstack/react-query";
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
import { getAllEntries } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

export function DataTableTab() {
  const { data: entriesData, isLoading } = useQuery({
    queryKey: ["all-entries"],
    queryFn: getAllEntries,
  });

  const entries = entriesData?.success ? entriesData.data || [] : [];

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>📋 Hall of Fame Entries</CardTitle>
        <CardDescription>
          Complete dataset of all hall of fame entries ({entries.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant #</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date String</TableHead>
                <TableHead>Parsed Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="animate-pulse bg-muted h-4 rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="animate-pulse bg-muted h-4 rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="animate-pulse bg-muted h-4 rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="animate-pulse bg-muted h-4 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No entries found.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge variant="outline">{entry.participantNumber}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.dateStr}
                    </TableCell>
                    <TableCell>{formatDate(entry.parsedDate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
