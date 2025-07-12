import { useCallback, useState } from "react";

import { fetchListFilter } from "@/api/filter";

export interface FilterProps {
  filter_hsk_skin_type: filter_dac_tinh_type_props[];

  filter_hsk_uses: filter_hsk_uses_props[];

  filter_dac_tinh: filter_dac_tinh_type_props[];

  filter_hsk_ingredient: filter_hsk_ingredient_props[];

  filter_hsk_size: filter_hsk_size_props[];

  filter_brand: filter_brand_props[];

  filter_hsk_product_type: filter_hsk_product_type_props[];
  filter_origin: filter_origin_props[];
}
export interface filter_brand_props {
  filter_ID: string;
  name: string;
}
export interface filter_hsk_uses_props {
  filter_ID: string;
  name: string;
}
export interface filter_hsk_skin_type_props {
  filter_ID: string;
  name: string;
}
export interface filter_dac_tinh_type_props {
  filter_ID: string;
  name: string;
}
export interface filter_hsk_ingredient_props {
  filter_ID: string;
  name: string;
}
export interface filter_hsk_size_props {
  filter_ID: string;
  name: string;
}
export interface filter_hsk_product_type_props {
  filter_ID: string;
  name: string;
}
export interface filter_origin_props {
  filter_ID: string;
  name: string;
}

export const useFetchAllFilter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<FilterProps>();
  const fetchFilter = useCallback(async () => {
    try {
      const response = await fetchListFilter();
      console.log(response);
      setData(response as FilterProps);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    data,
    fetchFilter,
  };
};
