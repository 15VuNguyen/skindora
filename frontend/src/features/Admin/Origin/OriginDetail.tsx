import { Loader2 } from "lucide-react";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Typography from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useFetchOriginByID } from "@/hooks/Origin/useFetchOriginByID";
import type { Origin } from "@/types/Filter/origin";

const OriginDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: originData, fetchOriginByID, loading } = useFetchOriginByID(String(id));

  useEffect(() => {
    if (id) {
      fetchOriginByID();
    }
  }, [id, fetchOriginByID]);
  useEffect(() => {
    console.log("Origin Data:", originData);
  }, [originData]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  const origin: Origin | undefined = originData;

  if (!origin) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Xuất xứ không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Xuất xứ với ID &quot;{id}&quot; không thể tải hoặc không tồn tại.</p>
        <Button onClick={() => navigate("/admin/origin")} className="mt-4">
          Quay lại danh sách Xuất xứ
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chi tiết Xuất xứ</h1>
        <div className="flex gap-2">
          <div>
            <Button onClick={handleGoBack} variant="outline">
              Quay lại
            </Button>
          </div>
          <div>
            <Button
              variant="default"
              onClick={() => {
                navigate(`/admin/${id}/update-origin`);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-3xl text-gray-900">
            <Typography className="">{originData?.option_name}</Typography>
          </CardTitle>
          <CardDescription className="text-md mt-1 text-gray-600">
            Origin ID: <span className="font-mono text-sm">{originData?._id}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 p-6">
          <div>
            <Label htmlFor="category-info" className="text-sm font-medium text-gray-700">
              Danh mục
            </Label>
            <p id="category-info" className="mt-1 text-base text-gray-800">
              <span className="font-semibold">{origin.category_name}</span>
              <span className="text-gray-500 italic">({origin.category_param})</span>
            </p>
          </div>
          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              Trạng thái (State):
            </Label>
            {origin.state === "active" ? (
              <Badge className="bg-green-500 text-white hover:bg-green-600">Đang hoạt động</Badge>
            ) : (
              <Badge variant="secondary">Không hoạt động</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="created-at" className="text-sm font-medium text-gray-700">
                Ngày được tạo
              </Label>
              <p id="created-at" className="mt-1 text-base text-gray-800">
                {new Date(origin.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="updated-at" className="text-sm font-medium text-gray-700">
                Cập nhật lần cuối
              </Label>
              <p id="updated-at" className="mt-1 text-base text-gray-800">
                {new Date(origin.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OriginDetail;
