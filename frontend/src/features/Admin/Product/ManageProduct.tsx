import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/contexts/header.context";

import { ProductOverview } from "../components/ProductOverview";

const ManageProduct: React.FC = () => {
  const navigate = useNavigate();
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
            </div>
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
