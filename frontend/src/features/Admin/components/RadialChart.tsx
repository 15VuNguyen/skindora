import React from "react";
// Import React
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ChartRadialTextProps {
  title: string;
  description: string;
  value: number;
  label: string; // Nhãn hiển thị dưới con số chính (ví dụ: "Khách hàng")
  footerContent: React.ReactNode; // Cho phép truyền cả text và icon vào footer
  footerDescription: string;
}

// Config của biểu đồ có thể giữ nguyên hoặc tùy chỉnh nếu cần
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;

export function ChartRadialText({
  title,
  description,
  value,
  label,
  footerContent,
  footerDescription,
}: ChartRadialTextProps) {
  // Dữ liệu cho biểu đồ giờ sẽ được tạo động từ prop `value`
  const chartData = [{ browser: "safari", visitors: value, fill: "var(--primary)" }];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        {/* Sử dụng props cho Title và Description */}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          {/* endAngle={270} làm cho vòng tròn chỉ hiển thị 75% để trông giống một biểu đồ tiến độ hơn. Bạn có thể đổi lại 360 nếu muốn vòng tròn đầy đủ. */}
          <RadialBarChart data={chartData} startAngle={90} endAngle={360} innerRadius={80} outerRadius={110}>
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        {/* Hiển thị giá trị từ prop `value` */}
                        <tspan x={viewBox.cx} y={viewBox.cy} className="text-primary text-4xl font-bold">
                          {value.toLocaleString()}
                        </tspan>
                        {/* Hiển thị nhãn từ prop `label` */}
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          {label}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* Sử dụng prop `footerContent` */}
        <div className="flex items-center gap-2 leading-none font-medium">{footerContent}</div>
        {/* Sử dụng prop `footerDescription` */}
        <div className="text-muted-foreground leading-none">{footerDescription}</div>
      </CardFooter>
    </Card>
  );
}
