// src/components/RevenueDashboard.tsx
// Đường dẫn có thể thay đổi tùy cấu trúc dự án
import { DollarSign, Package } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Đường dẫn có thể thay đổi tùy cấu trúc dự án
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Định nghĩa lại kiểu dữ liệu để component có thể nhận props
interface IRevenueDataPoint {
  date: string;
  totalOrder: number;
  totalRevenue: number;
}

interface IRevenueResult {
  data: IRevenueDataPoint[];
  totalOrder: number;
  totalRevenue: number;
}

interface RevenueDashboardProps {
  revenueData: IRevenueResult;
}

// Hàm định dạng tiền tệ Việt Nam
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export function RevenueDashboard({ revenueData }: RevenueDashboardProps) {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Tiêu đề chính */}
      <h1 className="text-3xl font-bold tracking-tight">Báo cáo Doanh thu</h1>

      {/* Lưới hiển thị các thẻ tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueData.totalRevenue)}</div>
            <p className="text-muted-foreground text-xs">Dữ liệu được cập nhật liên tục</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số đơn hàng</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{revenueData.totalOrder.toLocaleString("vi-VN")}</div>
            <p className="text-muted-foreground text-xs">Tổng số đơn hàng thành công</p>
          </CardContent>
        </Card>
      </div>

      {/* Lưới hiển thị biểu đồ và bảng dữ liệu */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Biểu đồ */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu</CardTitle>
            <CardDescription>Biểu đồ doanh thu theo từng ngày.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData.data}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
                  }
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value as number) / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }
                  formatter={(value) => [formatCurrency(value as number), "Doanh thu"]}
                />
                <Bar dataKey="totalRevenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bảng dữ liệu chi tiết */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Doanh thu chi tiết</CardTitle>
            <CardDescription>Chi tiết doanh thu và đơn hàng theo ngày.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-center">Số đơn</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueData.data.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell>
                      <div className="font-medium">
                        {new Date(item.date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.totalOrder}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalRevenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
