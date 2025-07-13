import httpClient from "@/lib/axios";

// export interface FilterProps {
//   filter_hsk_skin_type: {
//     filter_ID: string;
//     name: string;
//   };
//   filter_hsk_uses: {
//     filter_ID: string;
//     name: string;
//   };
//   filter_dac_tinh: {
//     filter_ID: string;
//     name: string;
//   };
//   filter_hsk_ingredient: {
//     filter_ID: string;
//     name: string;
//   };
//   filter_hsk_size: {
//     filter_ID: string;
//     name: string;
//   };
//   filter_brand: {
//     filter_ID: string;
//     name: string;
//   };
// }
export const fetchListFilter = async () => {
  return httpClient.get("/filters/options").then((response) => response.data);
};
