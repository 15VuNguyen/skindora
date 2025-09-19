import { Loader2, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchBrand } from "@/hooks/Brand/useFetchBrand";

import { brandsColumn } from "../columns/brandsColumns";
import { PaginationDemo } from "../components/Pagination";
import { DataTable } from "../components/TableCustom";

const ManageBrand: React.FC = () => {
  const navigate = useNavigate();
  const { setHeaderName, headerName } = useHeader();
  const { loading, data, fetchListBrand, params, setParams, searchTerm, setSearchTerm } = useFetchBrand();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchListBrand();
  }, [params.page]);
  useEffect(() => {
    console.log(data);
  });
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());

      return newParams;
    });

    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };
  useEffect(() => {
    setHeaderName("Quản Lý Thương Hiệu");
  }, [setHeaderName]);
  useEffect(() => {
    const pageFromURL = Number(searchParams.get("page") || "1");
    setParams((prev) => ({
      ...prev,
      page: pageFromURL,
    }));
  }, [searchParams]);
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
                <div className="bg-primary hover:bg-primary/90 r rounded-lg text-white">
                  <Button className="cursor-pointer p-5" onClick={() => navigate("/admin/create-brand")}>
                    <div className="flex items-center gap-4">
                      <div>
                        <Plus />
                      </div>
                      <div>
                        <span className="text-sm font-semibold">Tạo brand mới</span>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="mb-8 gap-2">
                <div className="mt-6 w-5/5">
                  <Card className="w-full">
                    <div className="p-3">
                      <DataTable
                        columns={brandsColumn(fetchListBrand)}
                        data={data}
                        onSearchChange={setSearchTerm}
                        searchValue={searchTerm}
                        filterPlaceholder="Tìm thương hiệu theo tên..."
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

export default ManageBrand;
