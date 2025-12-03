import { ArrowUpRight, DollarSign, TrendingUp } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RevenueProfitPage: React.FC = () => {
  // Hardcoded data from user
  const weeks = [
    "Tuần 1 (08/09 - 14/09)",
    "Tuần 2 (15/09 - 21/09)",
    "Tuần 3 (22/09 - 28/09)",
    "Tuần 4 (29/09 - 05/10)",
    "Tuần 5 (06/10 - 12/10)",
    "Tuần 6 (13/10 - 19/10)",
    "Tuần 7 (20/10 - 26/10)",
    "Tuần 8 (27/10 - 02/11)",
    "Tuần 9 (03/11 - 09/11)",
    "Tuần 10 (10/11 - 16/11)",
    "Tuần 11 (17/11 - 23/11)",
    "Tuần 12 (24/11 - 30/11)",
    "Tuần 13 (01/12 - 07/12)",
  ];

  const data = {
    newUsers: [0, 3, 5, 9, 5, 0, 1, 3, 1, 6, 6, 6, 0],
    totalUsers: [0, 3, 8, 17, 22, 22, 23, 26, 27, 33, 39, 45, 45],
    aiScans: [0, 0, 22, 51, 58, 143, 209, 263, 312, 330, 338, 371, 371],
    successfulOrders: [0, 0, 0, 0, 3, 0, 0, 5, 1, 8, 8, 14, 0],
    aov: [0, 0, 0, 0, 175333, 0, 0, 212800, 235000, 60500, 281750, 289928, 0],
    conversionRate: [0, 0, 0, 0, 13.63, 0, 0, 19.23, 3.7, 24.24, 20.51, 31.11, 0],
    revenue: [0, 0, 0, 0, 526000, 0, 0, 1064000, 235000, 484000, 2254000, 4059000, 0],
    variableCosts: [0, 0, 0, 0, 489000, 0, 0, 993000, 232000, 422000, 1987000, 4050000, 0],
    fixedCosts: [0, 0, 47254, 0, 160000, 0, 24799, 0, 0, 0, 0, 3000, 30000],
    profit: [0, 0, -47254, 0, -123000, 0, -24799, 71000, 3000, 62000, 267000, 6000, -30000],
  };

  const totalRevenue = data.revenue.reduce((a, b) => a + b, 0);
  const totalProfit = data.profit.reduce((a, b) => a + b, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Doanh Thu & Lợi Nhuận</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">(Tích lũy 13 tuần)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Lợi Nhuận</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">(Tích lũy 13 tuần)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Chi tiết hàng tuần</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-background sticky left-0 z-10 w-[200px]">Hạng mục</TableHead>
                  {weeks.map((week, index) => (
                    <TableHead key={index} className="min-w-[150px]">
                      {week}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/50">
                  <TableCell className="bg-muted/50 sticky left-0 z-10 font-bold">KPI KINH DOANH</TableCell>
                  {weeks.map((_, i) => (
                    <TableCell key={i}></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10">1. Số người dùng đăng ký mới</TableCell>
                  {data.newUsers.map((val, i) => (
                    <TableCell key={i}>{val}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10">2. Tổng số người dùng (lũy kế)</TableCell>
                  {data.totalUsers.map((val, i) => (
                    <TableCell key={i}>{val}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10">3. Số lượt quét AI</TableCell>
                  {data.aiScans.map((val, i) => (
                    <TableCell key={i}>{val}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10">4. Số đơn hàng thành công</TableCell>
                  {data.successfulOrders.map((val, i) => (
                    <TableCell key={i}>{val}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10">5. Giá trị đơn hàng TB (AOV)</TableCell>
                  {data.aov.map((val, i) => (
                    <TableCell key={i}>{formatCurrency(val)}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10">6. Tỷ lệ chuyển đổi (%)</TableCell>
                  {data.conversionRate.map((val, i) => (
                    <TableCell key={i}>{val}%</TableCell>
                  ))}
                </TableRow>

                <TableRow className="bg-muted/50">
                  <TableCell className="bg-muted/50 sticky left-0 z-10 font-bold">TÀI CHÍNH</TableCell>
                  {weeks.map((_, i) => (
                    <TableCell key={i}></TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10 font-semibold">A. Tổng Doanh Thu</TableCell>
                  {data.revenue.map((val, i) => (
                    <TableCell key={i}>{formatCurrency(val)}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10 font-semibold">B. Tổng Chi Phí</TableCell>
                  {weeks.map((_, i) => (
                    <TableCell key={i}>{formatCurrency(data.variableCosts[i] + data.fixedCosts[i])}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10 pl-8">- Chi phí biến đổi</TableCell>
                  {data.variableCosts.map((val, i) => (
                    <TableCell key={i}>{formatCurrency(val)}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-background sticky left-0 z-10 pl-8">- Chi phí cố định</TableCell>
                  {data.fixedCosts.map((val, i) => (
                    <TableCell key={i}>{formatCurrency(val)}</TableCell>
                  ))}
                </TableRow>
                <TableRow className="bg-primary/10">
                  <TableCell className="bg-primary/10 sticky left-0 z-10 font-bold">C. LỢI NHUẬN (A - B)</TableCell>
                  {data.profit.map((val, i) => (
                    <TableCell key={i} className={val < 0 ? "font-bold text-red-500" : "font-bold text-green-600"}>
                      {formatCurrency(val)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueProfitPage;
