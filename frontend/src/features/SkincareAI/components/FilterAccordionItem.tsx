import { Search, X } from "lucide-react";
import React, { useMemo, useState } from "react";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface FilterOption {
  filter_ID: string;
  name: string;
}

interface FilterAccordionItemProps {
  value: string;
  title: string;
  icon?: React.ReactNode;
  options: FilterOption[] | undefined;
  selectedValues: string[];
  onSelectionChange: React.Dispatch<React.SetStateAction<string[]>>;
  maxHeight?: string;
}

const FilterAccordionItem: React.FC<FilterAccordionItemProps> = ({
  value,
  title,
  icon,
  options = [],
  selectedValues,
  onSelectionChange,
  maxHeight = "h-44",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleCheckboxChange = (optionName: string, checked: boolean | "indeterminate") => {
    onSelectionChange((prev) =>
      checked === true ? [...prev, optionName] : prev.filter((item) => item !== optionName)
    );
  };

  const filteredOptions = useMemo(() => {
    if (!options) return [];
    if (!searchTerm) return options;
    return options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  const selectedCount = selectedValues.length;

  if (!options || (options.length === 0 && !searchTerm)) {
    return null;
  }

  return (
    <AccordionItem value={value} className="border-b border-gray-200 last:border-b-0">
      <AccordionTrigger className="text-md w-full rounded-t-md px-2 py-3 font-medium text-gray-700 hover:bg-gray-50 hover:no-underline">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            {icon}
            <span>{title}</span>
          </div>
          {selectedCount > 0 && (
            <span className="bg-primary ml-2 rounded-full px-1.5 py-0.5 text-xs font-semibold text-white">
              {selectedCount}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="overflow-hidden rounded-b-md bg-white px-2 pt-2 pb-3">
        {options && options.length > 7 && (
          <div className="relative mb-3 px-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-primary focus:ring-primary h-9 w-full rounded-md border-gray-300 py-1.5 pr-2 pl-9 text-sm"
            />
          </div>
        )}
        <ScrollArea className={`${maxHeight} w-full`} type="auto">
          <div className="space-y-1 py-1 pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const checkboxId = `${value}-${option.filter_ID || option.name}`;
                return (
                  <label
                    key={option.filter_ID || option.name}
                    htmlFor={checkboxId}
                    className="flex cursor-pointer items-center space-x-2 rounded px-1 py-1.5 hover:bg-gray-100"
                  >
                    <Checkbox
                      id={checkboxId}
                      checked={selectedValues.includes(option.name)}
                      onCheckedChange={(checked) => handleCheckboxChange(option.name, checked)}
                      className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    />
                    <span className="flex-1 text-sm font-normal text-gray-700">{option.name}</span>
                  </label>
                );
              })
            ) : (
              <p className="py-4 text-center text-xs text-gray-500">
                {searchTerm
                  ? `Không tìm thấy ${title.toLowerCase()} phù hợp.`
                  : `Không có tùy chọn cho ${title.toLowerCase()}.`}
              </p>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        {selectedValues.length > 0 && (
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              onSelectionChange([]);
              setSearchTerm("");
            }}
            className="text-primary hover:text-primary/90 mt-3 flex h-auto items-center p-0 text-xs"
          >
            <X size={12} className="mr-1" /> Xóa lựa chọn
          </Button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FilterAccordionItem;
