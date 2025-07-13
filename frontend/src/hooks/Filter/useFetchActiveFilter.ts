import { useCallback, useState } from "react";

import { fetchFilterActiveBrand } from "@/api/brand";
import { fetchFilterActiveDacTinh } from "@/api/dactinh";
import { fetchFilterActiveIngredient } from "@/api/ingredient";
import { fetchFilterActiveOrigin } from "@/api/origin";
import { fetchFilterActiveProductType } from "@/api/productType";
import { fetchFilterActiveSize } from "@/api/size";
import { fetchFilterActiveSkin } from "@/api/skinType";
import { fetchFilterActiveUses } from "@/api/uses";
import type { Brand } from "@/types/Filter/brand";
import type { DacTinh } from "@/types/Filter/dactinh";
import type { Ingredient } from "@/types/Filter/ingredient";
import type { Origin } from "@/types/Filter/origin";
import type { ProductType } from "@/types/Filter/productType";
import type { Size } from "@/types/Filter/size";
import type { SkinType } from "@/types/Filter/skinType";
import type { Uses } from "@/types/Filter/uses";

export interface FilterProps {
  filter_brand: Brand[];
  filter_hsk_skin_type: SkinType[];
  filter_hsk_uses: Uses[];
  filter_dac_tinh: DacTinh[];
  filter_hsk_ingredients: Ingredient[];
  filter_hsk_size: Size[];
  filter_hsk_product_type: ProductType[];
  filter_origin: Origin[];
}

// export interface filter_brand_props {
//   brands: Brand[];
// }
// export interface filter_hsk_uses_props {
//   uses: Uses[];
// }
// export interface filter_hsk_skin_type_props {
//   filter_ID: string;
//   name: string;
// }
// export interface filter_dac_tinh_type_props {
//   filter_ID: string;
//   name: string;
// }
// export interface filter_hsk_ingredient_props {
//   filter_ID: string;
//   name: string;
// }
// export interface filter_hsk_size_props {
//   filter_ID: string;
//   name: string;
// }
// export interface filter_hsk_product_type_props {
//   filter_ID: string;
//   name: string;
// }
// export interface filter_origin_props {
//   filter_ID: string;
//   name: string;
// }

export const useFetchFilter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<FilterProps | undefined>(undefined);

  const fetchFilter = useCallback(async () => {
    setLoading(true);
    try {
      const [brands, ingredients, uses, productTypes, skinTypes, dacTinhs, sizes, origins] = await Promise.all([
        fetchFilterActiveBrand(),
        fetchFilterActiveIngredient(),
        fetchFilterActiveUses(),
        fetchFilterActiveProductType(),
        fetchFilterActiveSkin(),
        fetchFilterActiveDacTinh(),
        fetchFilterActiveSize(),
        fetchFilterActiveOrigin(),
      ]);

      const filterData: FilterProps = {
        filter_brand: brands.data as Brand[],
        filter_hsk_ingredients: ingredients.data as Ingredient[],
        filter_hsk_uses: uses.data as Uses[],
        filter_hsk_product_type: productTypes.data as ProductType[],
        filter_hsk_skin_type: skinTypes.data as SkinType[],
        filter_dac_tinh: dacTinhs.data as DacTinh[],
        filter_hsk_size: sizes.data as Size[],
        filter_origin: origins.data as Origin[],
      };

      setData(filterData);
      console.log(filterData);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
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
