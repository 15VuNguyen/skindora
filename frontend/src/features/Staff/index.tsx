// src/pages/Admin/Admin.tsx
import { Package, Plus, ShoppingCart, User2 } from "lucide-react";
import React, { useEffect } from "react";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/contexts/header.context";
import AppTable from "@/features/Admin/components/Table";

import { CardDemo } from "../Admin/components/Card";

const Staff: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Tổng quan");
  }, []);

  return (
    <div className="w-full gap-4 bg-gray-50 px-6 py-8">
      <div className="mb-6 flex justify-between">
        <Typography className="text-2xl font-bold">Bảng điều khiển</Typography>
        <div className="bg-primary hover:bg-primary/90 r rounded-lg text-white">
          <Button className="cursor-pointer p-5">
            <div className="flex items-center gap-4">
              <div>
                <Plus />
              </div>
              <div>
                <span className="text-sm font-semibold">Tạo đơn hàng mới</span>
              </div>
            </div>
          </Button>
        </div>
      </div>
      <div className="mb-4 flex gap-4">
        <CardDemo title="Tổng doanh thu" amount="128,430,000₫" change="+20.1% so với tháng trước" />
        <CardDemo title="Đơn hàng" amount="+573" change="+20.1% so với tháng trước" icon={<ShoppingCart size={15} />} />
        <CardDemo title="Sản phẩm" amount="850" change="+24 sản phẩm mới" icon={<Package size={15} />} />
        <CardDemo title="Khách hàng" amount="+2,340" change="+180 khách hàng mới" icon={<User2 size={15} />} />
      </div>
      <div>
        <div className="w-full">
          <div className="mb-3 flex justify-between">
            <div>
              <Typography className="text-lg font-medium">Đơn hàng gần đây</Typography>
            </div>
            <div className="mb-2">
              <Typography className="text-primary cursor-pointer text-sm font-bold">Xem tất cả</Typography>
            </div>
          </div>
          <div>
            <AppTable />
          </div>
        </div>
      </div>
      {/* <div className="w-full gap-4 py-6">
        <div className="mb-4">
          <Typography className="text-lg font-medium">Truy cập nhanh</Typography>
        </div>
        <div className="mb-4 flex gap-4">
          <Link to="/admin/customers" className="w-full">
            <CardIcon icon="👥" title="Khách hàng" />
          </Link>
          <Link to="/admin/products" className="w-full">
            <CardIcon icon="📦" title="Sản phẩm" />
          </Link>
          <Link to="/admin/orders" className="w-full">
            <CardIcon icon="🛒" title="Đơn hàng" />
          </Link>

          <Link to="/admin/statics" className="w-full">
            <CardIcon icon="📊" title="Báo cáo" />
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default Staff;
