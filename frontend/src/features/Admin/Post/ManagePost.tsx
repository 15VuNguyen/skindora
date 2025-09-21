import type { ColumnDef } from "@tanstack/react-table";
import { Eye, FileText, Filter, Loader2, Plus, RefreshCw, Search, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import Typography from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useHeader } from "@/contexts/header.context";
import { useRole } from "@/contexts/role.context";
import { useFetchPost } from "@/hooks/Post/useFetchPost";

import { postColumns } from "../columns/postColumns";
import { postStaffColumns } from "../columns/postStaffColumns";
import { PaginationDemo } from "../components/Pagination";
import { DataTable } from "../components/TableCustom";

const statusFilterOptions = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PUBLISHED", label: "Đã xuất bản" },
  { value: "DRAFT", label: "Bản nháp" },
];
interface ManagePostProps {
  userRole: string;
}
const ManagePosts: React.FC<ManagePostProps> = ({ userRole }) => {
  const { role } = useRole();
  const navigate = useNavigate();
  const { setHeaderName } = useHeader();
  const { loading, data, fetchListPost, params, setParams, changeStatus } = useFetchPost();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [column, setColumn] = useState<ColumnDef<any, any>[]>();
  useEffect(() => {
    if (role === "admin") {
      setColumn(postColumns);
    } else {
      setColumn(postStaffColumns);
    }
  }, [role]);
  useEffect(() => {
    fetchListPost();
  }, [params.page, params.limit, params.status, fetchListPost]);
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };

  useEffect(() => {
    setHeaderName("Quản Lý Bài Viết");
  }, [setHeaderName]);

  useEffect(() => {
    const pageFromURL = Number(searchParams.get("page") || "1");
    setParams((prev) => ({
      ...prev,
      page: pageFromURL,
    }));
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    console.log(status);
    changeStatus(status === "ALL" ? "" : status);
  };

  const handleRefresh = () => {
    fetchListPost();
  };

  const totalPosts = data.length;
  const publishedPosts = data.filter((post) => post.status.toUpperCase() === "PUBLISHED").length;
  const draftPosts = data.filter((post) => post.status.toUpperCase() === "DRAFT").length;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography variant="h1" className="text-2xl font-bold tracking-tight">
            Quản lý bài viết
          </Typography>
          <p className="text-muted-foreground mt-2 text-sm">Quản lý tất cả các bài viết blog và nội dung của website</p>
        </div>

        {userRole === "STAFF" && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Xuất Excel</DropdownMenuItem>
                <DropdownMenuItem>Xuất PDF</DropdownMenuItem>
                <DropdownMenuItem>Xuất CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => navigate("/staff/posts/create")} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Tạo bài viết mới
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng bài viết</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-muted-foreground text-xs">Tất cả bài viết trong hệ thống</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedPosts}</div>
            <p className="text-muted-foreground text-xs">Bài viết đang hiển thị công khai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bản nháp</CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{draftPosts}</div>
            <p className="text-muted-foreground text-xs">Bài viết chưa hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách bài viết</CardTitle>
          <CardDescription>Quản lý và chỉnh sửa các bài viết blog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchValue || statusFilter !== "ALL") && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Bộ lọc:</span>
                {searchValue && (
                  <Badge variant="secondary" className="gap-1">
                    Tìm kiếm: {searchValue}
                    <button
                      onClick={() => setSearchValue("")}
                      className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== "ALL" && (
                  <Badge variant="secondary" className="gap-1">
                    Trạng thái: {statusFilterOptions.find((opt) => opt.value === statusFilter)?.label}
                    <button
                      onClick={() => setStatusFilter("ALL")}
                      className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          <Separator className="mb-6" />

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-muted-foreground flex items-center gap-2">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <span className="text-lg">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : (
            <div>
              <DataTable columns={column ?? []} data={data} filterPlaceholder="Tìm kiếm bài viết..." />
              <div className="mt-4">
                <PaginationDemo
                  totalPages={params.totalPages ?? 1}
                  currentPage={params.page ?? 1}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <FileText className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">Chưa có bài viết nào</h3>
              <p className="text-muted-foreground mb-4 max-w-md text-sm">
                Bắt đầu tạo bài viết đầu tiên để chia sẻ nội dung với khách hàng
              </p>
              <Button
                onClick={() => (role === "admin" ? navigate("/admin/posts/create") : navigate("/staff/posts/create"))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo bài viết đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagePosts;
