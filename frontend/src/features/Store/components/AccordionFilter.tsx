import { AlertTriangle, LoaderCircle, X } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFilterOptionsQuery } from "@/hooks/queries/useFilterOptionsQuery";

interface AccordionFilterProps {
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterType: string, filterId: string) => void;
  onClearFilters: () => void;
  filterIdToNameMap: Map<string, string>; 
}

const filterTitles: Record<string, string> = {
  filter_brand: "Thương hiệu",
  filter_hsk_skin_type: "Loại da",
  filter_hsk_ingredient: "Thành phần",
  filter_hsk_size: "Kích cỡ",
  filter_origin: "Xuất xứ",
  filter_dac_tinh: "Đặc tính",
  filter_hsk_uses: "Công dụng",
  filter_hsk_product_type: "Loại sản phẩm",
};

export function AccordionFilter({
  selectedFilters,
  onFilterChange,
  onClearFilters,
  filterIdToNameMap,
}: AccordionFilterProps) {
  const { data: filterData, isLoading, isError, error } = useFilterOptionsQuery();

  const getTotalSelectedCount = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full max-w-xs flex-col items-center justify-center rounded-lg border bg-white p-4">
        <LoaderCircle className="text-primary mb-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading Filters...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-destructive/50 flex h-96 w-full max-w-xs flex-col items-center justify-center rounded-lg border bg-white p-4 text-center">
        <AlertTriangle className="text-destructive mb-2 h-8 w-8" />
        <p className="text-destructive font-semibold">Error</p>
        <p className="text-muted-foreground text-sm">Could not load filters.</p>
        <p className="text-muted-foreground mt-1 text-xs">({error?.message})</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs rounded-lg border bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bộ lọc</h3>
        {getTotalSelectedCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Xóa tất cả
          </Button>
        )}
      </div>

      {getTotalSelectedCount() > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium">Đã chọn ({getTotalSelectedCount()})</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([filterType, filterIds]) =>
              filterIds.map((id) => (
                <Badge key={`${filterType}-${id}`} variant="secondary" className="text-xs">
                  {filterIdToNameMap.get(id) || id} {/* Display name, fallback to ID */}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onFilterChange(filterType, id)} />
                </Badge>
              ))
            )}
          </div>
        </div>
      )}

      <Accordion type="multiple" className="w-full">
        {filterData &&
          Object.entries(filterData).map(
            ([filterType, options]) =>
              options &&
              options.length > 0 && (
                <AccordionItem key={filterType} value={filterType}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      {filterTitles[filterType] || filterType.replace(/_/g, " ")}
                      {selectedFilters[filterType]?.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedFilters[filterType]?.length || 0}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="max-h-60 space-y-2 overflow-y-auto">
                      {options.map((option) => {
                        const correctedFilterType =
                          filterType === "filter_hsk_ingredient" ? "filter_hsk_ingredients" : filterType;
                        const isSelected = selectedFilters[correctedFilterType]?.includes(option.filter_ID) || false;
                        return (
                          <Button
                            key={option.filter_ID}
                            variant={isSelected ? "default" : "ghost"}
                            size="sm"
                            className="h-auto w-full justify-start p-2 text-left text-sm"
                            onClick={() => onFilterChange(filterType, option.filter_ID)}
                          >
                            {option.name}
                          </Button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
          )}
      </Accordion>
    </div>
  );
}
