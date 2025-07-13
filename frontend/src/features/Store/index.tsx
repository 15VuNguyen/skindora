import { Frown, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { PaginationDemo } from "@/features/Admin/components/Pagination";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import { useAllProductsQuery } from "@/hooks/queries/useAllProductsQuery";
import { useFilterOptionsQuery } from "@/hooks/queries/useFilterOptionsQuery";
import { useDebounce } from "@/hooks/useDebounce";

import { AccordionFilter } from "./components/AccordionFilter";
import { ProductList } from "./components/ProductList";
// import { ProductBanner } from "./components/ProductBanner";
import { StoreFooter } from "./components/StoreFooter";

const StoreFront = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const filters: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== "q" && key !== "page") filters[key] = value.split(",");
    }
    return filters;
  });
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const searchTerm = searchParams.get("q") || "";

  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const debouncedFilters = useDebounce(selectedFilters, 500);
  const { data: filterData } = useFilterOptionsQuery();
  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useAllProductsQuery(currentPage, 12, debouncedFilters, searchTerm);
  const { mutate: addToCart } = useAddToCartMutation();

  const handleAddToCart = (productId: string) => {
    setLoadingProductId(productId);
    addToCart(
      { ProductID: productId, Quantity: 1 },
      {
        onSettled: () => setLoadingProductId(null),
      }
    );
  };

  const handleCardClick = (productId: string) => navigate(`/product/${productId}`);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  const handleClearFilters = () => {
    setSelectedFilters({});
    setCurrentPage(1);
  };
  // const handleFilterChange = (filterType: string, filterId: string) => {
  //   const correctedFilterType = filterType === "filter_hsk_ingredient" ? "filter_hsk_ingredients" : filterType;
  //   logger.info(correctedFilterType);
  //   setSelectedFilters((prev) => {
  //     const currentValues = prev[correctedFilterType] || [];
  //     const newValues = currentValues.includes(filterId)
  //       ? currentValues.filter((id) => id !== filterId)
  //       : [...currentValues, filterId];
  //     if (newValues.length === 0) {
  //       const { [filterType]: _, ...rest } = prev;
  //       return rest;
  //     }
  //     return { ...prev, [filterType]: newValues };
  //   });
  //   setCurrentPage(1);
  // };
  const handleFilterChange = (filterType: string, filterId: string) => {
    const correctedFilterType = filterType === "filter_hsk_ingredient" ? "filter_hsk_ingredients" : filterType;

    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      const currentValues = newFilters[correctedFilterType] || [];
      const isAlreadySelected = currentValues.includes(filterId);

      if (isAlreadySelected) {
       
        newFilters[correctedFilterType] = currentValues.filter((id) => id !== filterId);
      } else {
        
        newFilters[correctedFilterType] = [...currentValues, filterId];
      }

      
      if (newFilters[correctedFilterType].length === 0) {
        delete newFilters[correctedFilterType];
      }

      return newFilters;
    });

    setCurrentPage(1);
  };
  const filterIdToNameMap = useMemo(() => {
    if (!filterData) return new Map<string, string>();
    const map = new Map<string, string>();
    Object.values(filterData).forEach((options) => {
      options.forEach((option) => map.set(option.filter_ID, option.name));
    });
    return map;
  }, [filterData]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (searchTerm) newSearchParams.set("q", searchTerm);
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) newSearchParams.set(key, values.join(","));
    });
    if (currentPage > 1) newSearchParams.set("page", String(currentPage));
    setSearchParams(newSearchParams, { replace: true });
  }, [selectedFilters, currentPage, searchTerm, setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto max-w-[1440px] px-4 py-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full flex-shrink-0 lg:w-72">
            <AccordionFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              filterIdToNameMap={filterIdToNameMap}
            />
          </aside>
          <div className="flex-1">
            {/* <ProductBanner /> */}
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
              </div>
            ) : isError ? (
              <div className="text-destructive flex h-96 flex-col items-center justify-center">
                <Frown className="mb-2 h-12 w-12" />
                <p>Failed to load products.</p>
              </div>
            ) : (
              <>
                <ProductList
                  products={paginatedData?.data ?? []}
                  onAddToCart={handleAddToCart}
                  onCardClick={handleCardClick}
                  clearFilters={handleClearFilters}
                  loadingProductId={loadingProductId}
                />
                <div className="mt-8 flex justify-center">
                  <PaginationDemo
                    totalPages={paginatedData?.pagination?.totalPages ?? 1}
                    currentPage={paginatedData?.pagination?.currentPage ?? 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default StoreFront;
