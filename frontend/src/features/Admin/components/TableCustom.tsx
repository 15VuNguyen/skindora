import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface FilterOptionsProps {
  value: string;
  status?:
    | "SHIPPING"
    | "CANCELLED"
    | "DELIVERED"
    | "PROCESSING"
    | "ALL"
    | "CONFIRMED"
    | "PENDING"
    | "RETURNED"
    | "FAILED";
  label?:
    | "Đang giao"
    | "Đã hủy"
    | "Đã giao"
    | "Đang xử lý"
    | "Tất cả"
    | "Đã đồng ý"
    | "Đang chờ"
    | "Đang chờ xử lý"
    | "Đã xác nhận"
    | "Đang vận chuyển"
    | "Đã giao hàng"
    | "Trả hàng"
    | "Thất bại";
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  isHaveFilter?: boolean;
  filterOptions?: FilterOptionsProps[];
  callBackFunction?: (status?: FilterOptionsProps["status"]) => void;
  status?: string;

  filterPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isHaveFilter,
  filterOptions,
  callBackFunction,
  status,
  filterPlaceholder,
  searchValue,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const showSearchBar = onSearchChange !== undefined;
  // Định nghĩa lại kiểu cho các variant có thể có để code an toàn hơn

  // Hàm ánh xạ status sang variant
  const getVariantFromStatus = (status: FilterOptionsProps["status"]) => {
    switch (status) {
      case "CANCELLED":
        return "destructive";
      case "RETURNED":
        return "return";
      case "FAILED":
        return "failed";
      case "DELIVERED":
        return "complete";
      case "SHIPPING":
        return "shipping";
      case "PROCESSING":
        return "processing";
      case "CONFIRMED":
        return "confirmed";
      case "PENDING":
        return "pending";
      case "ALL":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-full">
      <div className="bg-card text-card-foreground flex items-center gap-2 p-4">
        {showSearchBar && (
          <div className="relative flex-grow">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={filterPlaceholder}
              value={searchValue ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
              className="rounded-lg border border-gray-300 p-6 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {isHaveFilter && (
        <div className="mt-2 flex flex-wrap gap-2">
          {filterOptions?.map((option) => {
            const handleClick = () => {
              if (callBackFunction) {
                callBackFunction(option.status as unknown as FilterOptionsProps["status"]);
              }
            };
            return (
              <div key={option.value}>
                <Button
                  // Đây là phần logic đã được cập nhật
                  variant={status === option.status ? "default" : getVariantFromStatus(option.status)}
                  onClick={handleClick}
                >
                  {option.label}
                </Button>
              </div>
            );
          })}
        </div>
      )}

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
