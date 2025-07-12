import React, { useEffect } from "react";

import Typography from "@/components/Typography";
import { useHeader } from "@/contexts/header.context";

// import type { ProductFE } from "@/types/product";
// import type { Product } from "@/types";
import { ProductOverview } from "./ProductOverviewStaff";

// import { ProductOverview } from "../Admin/components/ProductOverview";
const ManageProduct: React.FC = () => {
  const { setHeaderName, headerName } = useHeader();

  useEffect(() => {
    setHeaderName("Quản Lý Sản Phẩm");
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div className="mx-auto bg-white px-8 py-15 pt-4">
          <div className="mt-3 mb-6 flex justify-between">
            <Typography className="text-2xl font-bold">{headerName}</Typography>
            {/* <div className="bg-primary hover:bg-primary/90 r rounded-lg text-white">
              <Button className="cursor-pointer p-5" onClick={() => navigate("/admin/createProduct")}>
                <div className="flex items-center gap-4">
                  <div>
                    <Plus />
                  </div>
                  <div>
                    <span className="text-sm font-semibold">Tạo sản phẩm mới</span>
                  </div>
                </div>
              </Button>
            </div> */}
          </div>

          <div>
            <ProductOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
