"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Định nghĩa kiểu dữ liệu cho chart
interface ChartData {
  name: string; // Ví dụ: "Tháng 1", "Tháng 2"
  total: number;
}

interface UserChartProps {
  data: ChartData[]; // Nhận dữ liệu đã được xử lý
}

export const UserChart: React.FC<UserChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Người dùng mới</CardTitle>
        <CardDescription>Số lượng người dùng mới mỗi tháng</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
