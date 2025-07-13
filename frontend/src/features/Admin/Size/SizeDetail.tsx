import { Loader2 } from "lucide-react";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Typography from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useFetchSizeByID } from "@/hooks/Size/useFetchSizeByID";

const SizeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: sizeData, fetchSizeByID, loading } = useFetchSizeByID(id || "");

  useEffect(() => {
    if (id) {
      fetchSizeByID();
    }
  }, [id, fetchSizeByID]);
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu kích thước...</span>
        </div>
      </div>
    );
  }

  if (!sizeData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy kích thước</h2>
        <p className="mt-2 text-gray-500">Kích thước với ID "{id}" không thể tải hoặc không tồn tại.</p>
        <Button onClick={handleGoBack} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  // Destructure sizeData for easier access
  const { _id, option_name, category_name, category_param, created_at, updated_at } = sizeData;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chi tiết Kích Thước</h1>
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
                navigate(`/admin/${id}/update-size`);
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
            <Typography className="">{option_name}</Typography>
          </CardTitle>
          <CardDescription className="text-md mt-1 text-gray-600">
            Size ID: <span className="font-mono text-sm">{_id}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 p-6">
          <div>
            <Label htmlFor="category-info" className="text-sm font-medium text-gray-700">
              Danh mục
            </Label>
            <p id="category-info" className="mt-1 text-base text-gray-800">
              <span className="font-semibold">{category_name}</span>{" "}
              <span className="text-gray-500 italic">({category_param})</span>
            </p>
          </div>

          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              Trạng thái (State):
            </Label>
            {sizeData.state === "active" ? (
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
                {new Date(created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="updated-at" className="text-sm font-medium text-gray-700">
                Cập nhật lần cuối
              </Label>
              <p id="updated-at" className="mt-1 text-base text-gray-800">
                {new Date(updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SizeDetail;
