import { BarChart3, LineChart as LineIcon, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyAIUsage } from "@/types/aiusage.d";

interface AIUsageChartProps {
  data: DailyAIUsage[];
}

const formatChartData = (data: DailyAIUsage[]) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sortedData.map((item, index) => {
    const previousCount = index > 0 ? sortedData[index - 1].count : item.count;
    const trend = index > 0 ? item.count - previousCount : 0;

    return {
      date: new Date(item.date).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      count: item.count,
      trend: trend,
      movingAvg:
        index >= 2
          ? Math.round(
              sortedData.slice(Math.max(0, index - 2), index + 1).reduce((sum, d) => sum + d.count, 0) /
                Math.min(3, index + 1)
            )
          : item.count,
      fullDate: new Date(item.date).toLocaleDateString("vi-VN"),
      dayOfWeek: new Date(item.date).toLocaleDateString("vi-VN", { weekday: "short" }),
    };
  });
};

export const AIUsageChart: React.FC<AIUsageChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<"area" | "line" | "composed">("area");
  const chartData = formatChartData(data);

  const average =
    chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.count, 0) / chartData.length) : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="min-w-[200px] rounded-lg border bg-white p-4 shadow-lg">
          <div className="mb-2 border-b pb-2">
            <p className="font-semibold text-gray-900">
              {data.dayOfWeek}, {data.fullDate}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Lượt sử dụng:</span>
              <span className="font-bold text-blue-600">{data.count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trung bình 3 ngày:</span>
              <span className="font-medium text-purple-600">{data.movingAvg}</span>
            </div>
            {data.trend !== 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">So với hôm trước:</span>
                <span className={`font-medium ${data.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                  {data.trend > 0 ? "+" : ""}
                  {data.trend}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            <ReferenceLine
              y={average}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: `Trung bình: ${average}`, position: "top" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#usageGradient)"
              name="Lượt sử dụng"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
            />
            <Area
              type="monotone"
              dataKey="movingAvg"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="8 4"
              fill="url(#avgGradient)"
              name="Trung bình 3 ngày"
              dot={false}
            />
          </AreaChart>
        );

      case "composed":
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar dataKey="count" fill="#3b82f6" fillOpacity={0.6} name="Lượt sử dụng" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="movingAvg"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="Trung bình 3 ngày"
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
            />
          </ComposedChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <ReferenceLine
              y={average}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: `TB: ${average}`, position: "top" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Lượt sử dụng"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
            />
            <Line
              type="monotone"
              dataKey="movingAvg"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="8 4"
              name="Trung bình 3 ngày"
              dot={false}
            />
          </LineChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Biểu đồ sử dụng AI theo ngày
            </CardTitle>
            <CardDescription>
              Thống kê chi tiết {data.length} ngày gần đây • Trung bình: {average} lượt/ngày
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === "area" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("area")}
              className="h-8"
            >
              <BarChart3 className="mr-1 h-4 w-4" />
              Area
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
              className="h-8"
            >
              <LineIcon className="mr-1 h-4 w-4" />
              Line
            </Button>
            <Button
              variant={chartType === "composed" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("composed")}
              className="h-8"
            >
              Mix
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          {renderChart()}
        </ResponsiveContainer>

        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div className="text-center">
              <div className="font-semibold text-blue-600">{Math.max(...chartData.map((d) => d.count))}</div>
              <div className="text-gray-500">Cao nhất</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{Math.min(...chartData.map((d) => d.count))}</div>
              <div className="text-gray-500">Thấp nhất</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">{average}</div>
              <div className="text-gray-500">Trung bình</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">{chartData.reduce((sum, d) => sum + d.count, 0)}</div>
              <div className="text-gray-500">Tổng cộng</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
