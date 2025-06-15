// src/components/ui/data-table.tsx

"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Funnel, MoreHorizontal, Search } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

// src/components/ui/data-table.tsx

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  filterColumnId: string;
  filterPlaceholder: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumnId,
  filterPlaceholder,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      {/* <div className="flex items-center py-4">
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(filterColumnId)?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        
      </div> */}
      <div className="bg-card text-card-foreground flex items-center gap-2 rounded-lg border p-4">
        <div className="flex-grow">
          <div className="relative flex items-center">
            <Search className="text-muted-foreground absolute left-3 h-4 w-4" />

            <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(filterColumnId)?.setFilterValue(event.target.value)}
              className="p-6 pl-10" // Giữ padding gốc của bạn và thêm pl-10
            />
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto p-6">
                <span className="text-sm">
                  <Funnel className="" />
                </span>
                <span className="text-sm">Bộ Lộc</span>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
