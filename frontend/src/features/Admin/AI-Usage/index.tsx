import { BarChart3, Brain, Calendar, TrendingUp } from "lucide-react";
import { useEffect } from "react";

import { useHeader } from "@/contexts/header.context";
import { useFetchAIUsage } from "@/hooks/AI-Usage/useFetchAIUsage";

import { CardDemo } from "../components/Card";
import { Loader } from "../components/Loader";
import { AIUsageChart } from "./components/AIUsageChart.tsx";
import AIUsageStats from "./components/AIUsageStats";

const AIUsageIndex = () => {
  const { setHeaderName } = useHeader();
  const { loading, data, fetchAIUsageData } = useFetchAIUsage();

  useEffect(() => {
    setHeaderName("Thống kê sử dụng AI");
  }, [setHeaderName]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader />
      </div>
    );
  }

  const totalUsage = data?.totalUsage || 0;
  const dailyUsage = data?.dailyUsage || [];

  const today = new Date().toISOString().split("T")[0];
  const todayUsage = dailyUsage.find((day) => day.date.split("T")[0] === today)?.count || 0;

  const averageDaily =
    dailyUsage.length > 0 ? Math.round(dailyUsage.reduce((sum, day) => sum + day.count, 0) / dailyUsage.length) : 0;

  const lastWeekData = dailyUsage.slice(-14);
  const thisWeek = lastWeekData.slice(-7).reduce((sum, day) => sum + day.count, 0);
  const previousWeek = lastWeekData.slice(0, 7).reduce((sum, day) => sum + day.count, 0);
  const trend = previousWeek > 0 ? Math.round(((thisWeek - previousWeek) / previousWeek) * 100) : 0;

  return (
    <div className="w-full space-y-6 bg-gray-50 p-4 md:p-6">
      {!data && !loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Brain className="mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">Không có dữ liệu</h3>
          <p className="mb-4 text-gray-500">Chưa có thông tin về việc sử dụng AI.</p>
          <button
            onClick={fetchAIUsageData}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Thử lại
          </button>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardDemo
            title="Tổng lượt sử dụng"
            amount={totalUsage.toLocaleString()}
            icon={<Brain className="h-5 w-5 text-blue-600" />}
          />
          <CardDemo
            title="Sử dụng hôm nay"
            amount={todayUsage.toString()}
            change={`${todayUsage > 0 ? "+" : ""}${todayUsage} lượt`}
            icon={<Calendar className="h-5 w-5 text-green-600" />}
          />
          <CardDemo
            title="Trung bình hàng ngày"
            amount={averageDaily.toString()}
            change={`${averageDaily} lượt/ngày`}
            icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
          />
          <CardDemo
            title="Xu hướng tuần này"
            amount={`${trend > 0 ? "+" : ""}${trend}%`}
            change={trend > 0 ? "Tăng so với tuần trước" : trend < 0 ? "Giảm so với tuần trước" : "Không thay đổi"}
            icon={
              <TrendingUp
                className={`h-5 w-5 ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"}`}
              />
            }
          />
        </div>
      )}
      <div className="space-y-4">
        <AIUsageChart data={dailyUsage} />
        <AIUsageStats data={dailyUsage} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchAIUsageData}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Làm mới dữ liệu"}
        </button>
      </div>
    </div>
  );
};

export default AIUsageIndex;
