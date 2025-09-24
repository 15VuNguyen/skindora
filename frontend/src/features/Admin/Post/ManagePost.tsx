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
import { useFetchAllFilter } from "@/hooks/Filter/useFetchAllFilter";
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
  const {
    loading,
    data,
    fetchListPost,
    params,
    setParams,
    changeStatus,
    changeKeyword,
    addFilterValue,
    removeFilterValue,
  } = useFetchPost();
  const { data: filterData, fetchFilter } = useFetchAllFilter();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
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
  }, [params.page, params.limit, params.status, fetchListPost, params.keyword, params.filters]);

  useEffect(() => {
    fetchFilter();
  }, [fetchFilter]);
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
    changeKeyword(value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    console.log(status);
    changeStatus(status === "ALL" ? "" : status);
  };

  const handleRefresh = () => {
    fetchListPost();
  };

  const handleFilterChange = (filterKey: keyof typeof params.filters, value: string) => {
    addFilterValue(filterKey, value);
  };

  const handleRemoveFilter = (filterKey: keyof typeof params.filters, value: string) => {
    removeFilterValue(filterKey, value);
  };

  const handleClearAllFilters = () => {
    setSearchValue("");
    setStatusFilter("ALL");
    changeKeyword("");
    changeStatus("");
    setParams((prev) => ({
      ...prev,
      filters: {},
      page: 1,
    }));
  };

  // Helper function to get filter name by ID
  const getFilterName = (filterKey: keyof typeof params.filters, filterId: string): string => {
    if (!filterData) return filterId;

    switch (filterKey) {
      case "filter_brand":
        return filterData.filter_brand?.find((item) => item.filter_ID === filterId)?.name || filterId;
      case "filter_hsk_skin_type":
        return filterData.filter_hsk_skin_type?.find((item) => item.filter_ID === filterId)?.name || filterId;
      case "filter_hsk_uses":
        return filterData.filter_hsk_uses?.find((item) => item.filter_ID === filterId)?.name || filterId;
      case "filter_dac_tinh":
        return filterData.filter_dac_tinh?.find((item) => item.filter_ID === filterId)?.name || filterId;
      case "filter_hsk_ingredients":
        return filterData.filter_hsk_ingredient?.find((item) => item.filter_ID === filterId)?.name || filterId;
      case "filter_hsk_size":
        return filterData.filter_hsk_size?.find((item) => item.filter_ID === filterId)?.name || filterId;
      case "filter_hsk_product_type":
        return filterData.filter_hsk_product_type?.find((item) => item.filter_ID === filterId)?.name || filterId;
      case "filter_origin":
        return filterData.filter_origin?.find((item) => item.filter_ID === filterId)?.name || filterId;
      default:
        return filterId;
    }
  };

  // Get filter label for display
  const getFilterLabel = (filterKey: keyof typeof params.filters): string => {
    switch (filterKey) {
      case "filter_brand":
        return "Thương hiệu";
      case "filter_hsk_skin_type":
        return "Loại da";
      case "filter_hsk_uses":
        return "Công dụng";
      case "filter_dac_tinh":
        return "Đặc tính";
      case "filter_hsk_ingredients":
        return "Thành phần";
      case "filter_hsk_size":
        return "Kích thước";
      case "filter_hsk_product_type":
        return "Loại sản phẩm";
      case "filter_origin":
        return "Xuất xứ";
      default:
        return filterKey;
    }
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
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 md:gap-4">
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

                {/* Brand Filter */}
                {filterData?.filter_brand && (
                  <Select onValueChange={(value) => handleFilterChange("filter_brand", value)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Lọc theo thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.filter_brand.map((brand) => (
                        <SelectItem key={brand.filter_ID} value={brand.filter_ID}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Skin Type Filter */}
                {filterData?.filter_hsk_skin_type && (
                  <Select onValueChange={(value) => handleFilterChange("filter_hsk_skin_type", value)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Lọc theo loại da" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.filter_hsk_skin_type.map((skinType) => (
                        <SelectItem key={skinType.filter_ID} value={skinType.filter_ID}>
                          {skinType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Uses Filter */}
                {filterData?.filter_hsk_uses && (
                  <Select onValueChange={(value) => handleFilterChange("filter_hsk_uses", value)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Lọc theo công dụng" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.filter_hsk_uses.map((use) => (
                        <SelectItem key={use.filter_ID} value={use.filter_ID}>
                          {use.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Product Type Filter */}
                {filterData?.filter_hsk_product_type && (
                  <Select onValueChange={(value) => handleFilterChange("filter_hsk_product_type", value)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Lọc theo loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.filter_hsk_product_type.map((productType) => (
                        <SelectItem key={productType.filter_ID} value={productType.filter_ID}>
                          {productType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Dac Tinh Filter */}
                {filterData?.filter_dac_tinh && (
                  <Select onValueChange={(value) => handleFilterChange("filter_dac_tinh", value)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Lọc theo đặc tính" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.filter_dac_tinh.map((dacTinh) => (
                        <SelectItem key={dacTinh.filter_ID} value={dacTinh.filter_ID}>
                          {dacTinh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Ingredients Filter */}
                {filterData?.filter_hsk_ingredient && (
                  <Select onValueChange={(value) => handleFilterChange("filter_hsk_ingredients", value)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Lọc theo thành phần" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.filter_hsk_ingredient.map((ingredient) => (
                        <SelectItem key={ingredient.filter_ID} value={ingredient.filter_ID}>
                          {ingredient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Size Filter */}
                {filterData?.filter_hsk_size && (
                  <Select onValueChange={(value) => handleFilterChange("filter_hsk_size", value)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Lọc theo kích thước" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.filter_hsk_size.map((size) => (
                        <SelectItem key={size.filter_ID} value={size.filter_ID}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Origin Filter */}
                {filterData?.filter_origin && (
                  <Select onValueChange={(value) => handleFilterChange("filter_origin", value)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Lọc theo xuất xứ" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.filter_origin.map((origin) => (
                        <SelectItem key={origin.filter_ID} value={origin.filter_ID}>
                          {origin.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {(searchValue ||
              statusFilter !== "ALL" ||
              Object.values(params.filters || {}).some((arr) => arr && arr.length > 0)) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-sm">Bộ lọc:</span>
                <Button variant="outline" size="sm" onClick={handleClearAllFilters} className="h-6 px-2 text-xs">
                  Xóa tất cả
                </Button>
                {searchValue && (
                  <Badge variant="secondary" className="gap-1">
                    Tìm kiếm: {searchValue}
                    <button
                      onClick={() => {
                        setSearchValue("");
                        changeKeyword("");
                      }}
                      className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== "ALL" && statusFilter && (
                  <Badge variant="secondary" className="gap-1">
                    Trạng thái: {statusFilterOptions.find((opt) => opt.value === statusFilter)?.label}
                    <button
                      onClick={() => {
                        setStatusFilter("ALL");
                        changeStatus("");
                      }}
                      className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {/* Display active filter badges */}
                {params.filters &&
                  Object.entries(params.filters).map(([filterKey, filterValues]) =>
                    filterValues?.map((value: string) => (
                      <Badge key={`${filterKey}-${value}`} variant="secondary" className="gap-1">
                        {getFilterLabel(filterKey as keyof typeof params.filters)}:{" "}
                        {getFilterName(filterKey as keyof typeof params.filters, value)}
                        <button
                          onClick={() => handleRemoveFilter(filterKey as keyof typeof params.filters, value)}
                          className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    ))
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
