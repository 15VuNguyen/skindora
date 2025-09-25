import { ArrowLeft, Filter, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useFetchAllFilter } from "@/hooks/Filter/useFetchAllFilter";
import { type filterProps, useFetchPostForUser } from "@/hooks/Post/useFetchPostForUser";
import type { PostUser } from "@/types/post";

import { PostCard } from "./PostCard";
import { PostHeader } from "./PostHeader";

export function Post() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const {
    data: posts,
    loading,
    fetchListPost,
    changeKeyword,
    changeFilter,
    addFilterValue,
    removeFilterValue,
    params,
    setParams,
  } = useFetchPostForUser();

  const { data: filterData, fetchFilter } = useFetchAllFilter();

  // Fetch posts and filters when component mounts
  useEffect(() => {
    fetchListPost();
    fetchFilter();
  }, [fetchListPost, fetchFilter]);

  // Fetch posts when params change
  useEffect(() => {
    fetchListPost();
  }, [fetchListPost, params.page, params.keyword, params.filters]);

  // Handle search input
  const handleSearch = useCallback(
    (query: string) => {
      setSearchValue(query);
      changeKeyword(query);
    },
    [changeKeyword]
  );

  // Handle post selection
  const handlePostClick = useCallback(
    (post: PostUser) => {
      navigate(`/posts/${post.slug}/${post._id}`);
    },
    [navigate]
  );

  // Handle filter changes for dropdown selects
  const handleFilterChange = useCallback(
    (filterKey: keyof typeof params.filters, value: string) => {
      addFilterValue(filterKey, value);
    },
    [addFilterValue, params.filters]
  );

  // Handle removing individual filter
  const handleRemoveFilter = useCallback(
    (filterKey: keyof typeof params.filters, value: string) => {
      removeFilterValue(filterKey, value);
    },
    [removeFilterValue]
  );

  // Handle filter changes from BlogFilters component
  const handleFiltersChange = useCallback(
    (newFilters: Record<string, string[]>) => {
      const convertedFilters: filterProps = {
        filter_brand: newFilters.brand || [],
        filter_hsk_skin_type: newFilters.skin_type || [],
        filter_hsk_uses: newFilters.uses || [],
        filter_dac_tinh: newFilters.dac_tinh || [],
        filter_hsk_ingredients: newFilters.ingredients || [],
        filter_hsk_size: newFilters.size || [],
        filter_hsk_product_type: newFilters.product_type || [],
        filter_origin: newFilters.origin || [],
      };

      changeFilter(convertedFilters);
    },
    [changeFilter]
  );

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    setSearchValue("");
    changeKeyword("");
    setParams((prev) => ({
      ...prev,
      filters: {},
      page: 1,
    }));
  }, [changeKeyword, setParams]);

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

  return (
    <div className="bg-gradient-subtle min-h-screen">
      <div>
        <PostHeader />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 transition-all duration-300 sm:px-6 lg:py-8">
        {/* Header Section with Search */}

        <div className="mb-8">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">Skincare Articles</h1>
            <p className="text-muted-foreground">Discover expert insights and tips for your perfect skincare routine</p>
          </div>

          {/* Search and Quick Filters */}
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 md:gap-4">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Brand Filter */}
              {filterData?.filter_brand && (
                <Select onValueChange={(value) => handleFilterChange("filter_brand", value)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Thương hiệu" />
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
                    <SelectValue placeholder="Loại da" />
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
                    <SelectValue placeholder="Công dụng" />
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
                    <SelectValue placeholder="Loại sản phẩm" />
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

              {/* Ingredients Filter */}
              {filterData?.filter_hsk_ingredient && (
                <Select onValueChange={(value) => handleFilterChange("filter_hsk_ingredients", value)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Thành phần" />
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
                    <SelectValue placeholder="Kích thước" />
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
                    <SelectValue placeholder="Xuất xứ" />
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

              {/* Dac Tinh Filter */}
              {filterData?.filter_dac_tinh && (
                <Select onValueChange={(value) => handleFilterChange("filter_dac_tinh", value)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Đặc tính" />
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
            </div>

            {/* Active Filters Display */}
            {(searchValue || Object.values(params.filters || {}).some((arr) => arr && arr.length > 0)) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-sm">Bộ lọc:</span>
                <Button variant="outline" size="sm" onClick={handleClearAllFilters} className="h-6 px-2 text-xs">
                  Xóa tất cả
                </Button>
                {searchValue && (
                  <Badge variant="secondary" className="gap-1">
                    Tìm kiếm: {searchValue}
                    <button
                      onClick={() => handleSearch("")}
                      className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
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
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
              </div>
            )}
          </div>

          <Separator className="mb-6" />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* <div className="lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <BlogFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div> */}

          <div className="min-w-0 flex-1">
            <div className="mb-6">
              <div className="text-muted-foreground text-sm">
                {loading ? (
                  <span className="animate-pulse">Loading articles...</span>
                ) : (
                  <span>Found {posts.length} articles</span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gradient-card shadow-soft animate-pulse rounded-xl p-6">
                    <div className="bg-muted mb-4 h-48 rounded-lg"></div>
                    <div className="space-y-3">
                      <div className="bg-muted h-4 rounded"></div>
                      <div className="bg-muted h-4 w-3/4 rounded"></div>
                      <div className="bg-muted h-3 rounded"></div>
                      <div className="bg-muted h-3 w-2/3 rounded"></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="bg-muted h-3 w-20 rounded"></div>
                      <div className="bg-muted h-8 w-24 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {posts.map((post: PostUser) => (
                    <PostCard key={post._id} post={post} onClick={() => handlePostClick(post)} />
                  ))}
                </div>

                {posts.length === 0 && !loading && (
                  <div className="py-16 text-center">
                    <div className="mx-auto max-w-md">
                      <div className="mb-4 text-6xl">📝</div>
                      <h3 className="mb-2 text-xl font-semibold">No articles found</h3>
                      <p className="text-muted-foreground mb-4">
                        No articles match your current search and filter criteria.
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your search terms or clearing some filters to see more results.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
