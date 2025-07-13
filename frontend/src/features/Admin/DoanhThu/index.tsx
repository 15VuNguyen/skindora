import { useEffect, useState } from "react";

import { getRevenueData } from "@/api/revenue";
import type { IRevenueResponse } from "@/api/revenue";

import { RevenueDashboard } from "./RevenueDashboard";

// Import component UI vừa tạo

export default function RevenuePage() {
  const [apiResponse, setApiResponse] = useState<IRevenueResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRevenueData({}); // Gọi API
        setApiResponse(response);
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Đang tải báo cáo...</div>;
  }

  if (!apiResponse) {
    return <div>Không có dữ liệu để hiển thị.</div>;
  }

  return (
    <main>
      {/* Truyền phần result của API vào component UI */}
      <RevenueDashboard revenueData={apiResponse.result} />
    </main>
  );
}
