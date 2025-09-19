import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";

import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchUser } from "@/hooks/User/useFetchUser";
import { useFetchUserIsNotVerified } from "@/hooks/User/useFetchUserIsNotVerified";
import { useFetchUserIsVerified } from "@/hooks/User/useFetchUserIsVerified";

import { userColumn } from "../columns/usersColums";
import { CardDemo } from "../components/Card";
import { PaginationDemo } from "../components/Pagination";
import { ChartRadialText } from "../components/RadialChart";
import { DataTable } from "../components/TableCustom";
// Component đã được cập nhật
import { UserChart } from "../components/UserChart";

const ManageCustomer: React.FC = () => {
  const { setHeaderName } = useHeader();

  const { fetchUser, data, params, setParams, allUser, fetchAllUser, loading } = useFetchUser();
  const { fetchNotVerifiedUser, params: paramsForUserIsNotVerified } = useFetchUserIsNotVerified();
  const { fetchVerifiedUser, params: paramsForUserIsVerified } = useFetchUserIsVerified();
  useEffect(() => {
    setHeaderName("Quản Lý Khách Hàng");
  }, [setHeaderName]);

  useEffect(() => {
    fetchUser();
    fetchAllUser();

    console.log(data);
    console.log(params.page);
  }, [params.page]);

  useEffect(() => {
    fetchNotVerifiedUser();
    fetchVerifiedUser();
  }, []);
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
    <div className="">
      {loading || !data || !allUser || monthlyUserData.length === 0 ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-lg">Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <div className="mx-auto bg-white px-8 py-15 pt-4">
              <div className="mt-2 mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CardDemo title="Tổng số người dùng" amount={`${params.totalRecords ?? 0}`} />
                <CardDemo
                  title="Số lượng khách hàng chưa xác thực tài khoản"
                  amount={`${paramsForUserIsNotVerified.totalRecords ?? 0}`}
                />
                <CardDemo
                  title="Số lượng khách hàng đã xác thực tài khoản"
                  amount={`${paramsForUserIsVerified.totalRecords ?? 0}`}
                />
                {/* Các CardDemo khác */}
              </div>
              <div className="mt-5 mb-4 flex gap-2">
                <div className="w-3/5">
                  <ChartRadialText
                    title="Tổng số lượng khách hàng"
                    description=""
                    value={params.totalRecords}
                    label="Khách hàng"
                    footerDescription="Dữ liệu cập nhật hàng ngày"
                  />
                </div>
                <div className="w-5/5">
                  <ChartRadialText
                    title="Tài khoản đã verified"
                    description=""
                    value={paramsForUserIsVerified.totalRecords}
                    label="Tài khoản"
                    footerDescription="Tổng số tài khoản đăng ký mới"
                  />
                </div>
              </div>{" "}
              <div className="w-5/5">
                <UserChart data={monthlyUserData} />
              </div>
              <div className="mb-8 gap-2">
                <div className="mt-3 w-5/5">
                  <Card className="w-5/5">
                    <div className="p-3">
                      <DataTable columns={userColumn} data={allUser} filterPlaceholder="Tìm khách hàng" />
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
