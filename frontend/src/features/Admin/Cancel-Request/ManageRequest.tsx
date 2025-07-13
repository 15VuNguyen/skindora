import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

import Typography from "@/components/Typography";
import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchCancelRequest } from "@/hooks/CancelRequest/useFetchCancelRequest";

import { cancelRequestColumns } from "../columns/cancelRequestColumns";
import { PaginationDemo } from "../components/Pagination";
import { DataTable } from "../components/TableCustom";

const ManageRequest: React.FC = () => {
  const { setHeaderName, headerName } = useHeader();
  const { loading, data, fetchListCancelRequest, params, changePage } = useFetchCancelRequest();

  useEffect(() => {
    fetchListCancelRequest();
  }, [params.page, fetchListCancelRequest]);

  useEffect(() => {
    setHeaderName("Quản Lý Yêu Cầu Hủy");
  }, [setHeaderName]);

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  return (
    <div className="">
      {loading ? (
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
              <div className="mt-3 mb-6 flex justify-between">
                <Typography className="text-2xl font-bold">{headerName}</Typography>
              </div>

              <div className="mb-8 gap-2">
                <div className="mt-6 w-5/5">
                  <Card className="w-full">
                    <div className="p-3">
                      <DataTable columns={cancelRequestColumns} data={data} />
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

export default ManageRequest;
