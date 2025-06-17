import { Plus } from "lucide-react";
import React, { useEffect } from "react";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/contexts/header.context";

import { ProductOverview } from "./components/ProductOverview";
import type { Product } from "./components/ProductOverview";

const ManageProduct: React.FC = () => {
  const [, setSelectedProduct] = React.useState<Product | null>(null);
  const [, setActiveView] = React.useState("overview");

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
            <div className="bg-primary hover:bg-primary/90 r rounded-lg text-white">
              <Button className="cursor-pointer p-5">
                <div className="flex items-center gap-4">
                  <div>
                    <Plus />
                  </div>
                  <div>
                    <span className="text-sm font-semibold">Tạo sản phẩm mới</span>
                  </div>
                </div>
              </Button>
            </div>
          </div>
          {/* <div>
            <Typography className="text-2xl font-bold">Quản lý khách hàng</Typography>
          </div> */}
          {/* <div className="mt-8">
            <TableProduct />
          </div>
        </div> */}
          <div>
            <ProductOverview onSelectProduct={setSelectedProduct} onEditProduct={() => setActiveView("editor")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
