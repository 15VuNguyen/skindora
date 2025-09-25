import { Clock, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyAIUsage } from "@/types/aiusage.d";

interface AIUsageStatsProps {
  data: DailyAIUsage[];
}

const AIUsageStats: React.FC<AIUsageStatsProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const peakDay = data.reduce((max, day) => (day.count > max.count ? day : max), data[0] || { count: 0, date: "" });

  const activeDays = data.filter((day) => day.count > 0).length;

  const last7Days = sortedData.slice(0, 7);
  const last7DaysTotal = last7Days.reduce((sum, day) => sum + day.count, 0);

  // Usage trong 30 ngày gần nhất
  const last30Days = sortedData.slice(0, Math.min(30, data.length));
  const last30DaysTotal = last30Days.reduce((sum, day) => sum + day.count, 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Thống kê chi tiết</CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Ngày đỉnh cao:</span>
              <span className="text-sm font-medium">
                {peakDay.count} lượt ({new Date(peakDay.date).toLocaleDateString("vi-VN")})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Số ngày hoạt động:</span>
              <span className="text-sm font-medium">
                {activeDays}/{data.length} ngày
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">7 ngày gần nhất:</span>
              <span className="text-sm font-medium">{last7DaysTotal} lượt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">30 ngày gần nhất:</span>
              <span className="text-sm font-medium">{last30DaysTotal} lượt</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hoạt động gần đây</CardTitle>
          <Clock className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedData.slice(0, 5).map((day) => (
              <div key={day._id} className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{new Date(day.date).toLocaleDateString("vi-VN")}</span>
                <span className="text-sm font-medium">{day.count} lượt</span>
              </div>
            ))}
            {data.length === 0 && (
              <p className="text-muted-foreground py-2 text-center text-sm">Chưa có dữ liệu sử dụng</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIUsageStats;
