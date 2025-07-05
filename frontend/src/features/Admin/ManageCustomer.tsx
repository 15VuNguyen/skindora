import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useEffect, useMemo } from "react";

import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchUser } from "@/hooks/User/useFetchUser";

import { userColumn } from "./columns/usersColums";
import { CardDemo } from "./components/Card";
import { Loader } from "./components/Loader";
import { PaginationDemo } from "./components/Pagination";
import { ChartRadialText } from "./components/RadialChart";
// Component đã được cập nhật
import { DataTable } from "./components/TableCustom";
import { UserChart } from "./components/UserChart";

const ManageCustomer: React.FC = () => {
  const { setHeaderName } = useHeader();

  const { fetchUser, data, params, setParams, allUser, fetchAllUser, loading } = useFetchUser();

  useEffect(() => {
    setHeaderName("Quản Lý Khách Hàng");
  }, [setHeaderName]);

  useEffect(() => {
    fetchUser();
    fetchAllUser();
    console.log(data);
    console.log(params.page);
  }, [params.page]);

  const handlePageChange = (page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };

  const monthlyUserData = useMemo(() => {
    if (!allUser || allUser.length === 0) {
      return [];
    }
    const monthlyCounts = allUser.reduce((acc: { [key: string]: number }, user) => {
      const date = new Date(user.created_at);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey]++;
      return acc;
    }, {});

    const chartData = Object.entries(monthlyCounts)

      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([monthKey, count]) => {
        const [year, month] = monthKey.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const monthName = `Thg ${date.getMonth() + 1}, ${date.getFullYear()}`;
        return {
          name: monthName,
          total: count,
        };
      });
    return chartData;
  }, [allUser]);

  return (
    <div className="flex min-h-screen bg-white">
      {loading || !data || !allUser || monthlyUserData.length === 0 ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <>
          <div className="flex-1">
            <div className="mx-auto bg-white px-8 py-15 pt-4">
              <div className="mt-2 mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardDemo
                  title="Tổng số người dùng"
                  amount={`${params.totalRecords ?? 0}`}
                  change="+20.1% so với tháng trước"
                />

                <CardDemo
                  title="Số lượng khách hàng mới"
                  amount={`${params.totalRecords ?? 0}`}
                  change="+20.1% so với tháng trước"
                />
                <CardDemo
                  title="Khách hàng có hoạt động tích cực nhất"
                  amount={`${params.totalRecords ?? 0}`}
                  change="+20.1% so với tháng trước"
                />
                <CardDemo
                  title="Số khách hàng đang hoạt động"
                  amount={`${params.totalRecords ?? 0}`}
                  change="+20.1% so với tháng trước"
                />
                {/* Các CardDemo khác */}
              </div>
              <div className="mt-5 mb-4 flex gap-2">
                <div className="w-3/5">
                  <ChartRadialText
                    title="Khách hàng có đơn"
                    description="Trong tháng 6, 2025"
                    value={152}
                    label="Khách hàng"
                    footerContent={
                      <>
                        Tăng 5.2% so với tháng trước <TrendingUp className="h-4 w-4 text-green-500" />
                      </>
                    }
                    footerDescription="Dữ liệu cập nhật hàng ngày"
                  />
                </div>
                <div className="w-5/5">
                  <ChartRadialText
                    title="Tài khoản mới"
                    description="Trong tháng 6, 2025"
                    value={89}
                    label="Tài khoản"
                    footerContent={
                      <>
                        Giảm 2.1% so với tháng trước <TrendingDown className="h-4 w-4 text-red-500" />
                      </>
                    }
                    footerDescription="Tổng số tài khoản đăng ký mới"
                  />
                </div>
              </div>
              <div className="mb-8 gap-2">
                <div className="w-5/5">
                  <UserChart data={monthlyUserData} />
                </div>
                <div className="mt-3 w-5/5">
                  <Card className="w-5/5">
                    <div className="p-3">
                      <DataTable
                        columns={userColumn}
                        data={data}
                        filterColumnId="username"
                        filterPlaceholder="Tìm khách hàng"
                      />
                      <div className="mt-4">
                        <PaginationDemo
                          totalPages={params.totalPages ?? 1}
                          currentPage={params.page ?? 1}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCustomer;
