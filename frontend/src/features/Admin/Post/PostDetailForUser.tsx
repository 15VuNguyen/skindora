import { ArrowLeft, Calendar, Eye, Tag, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { fetchPostById } from "@/api/post";
import type { detailPostProps } from "@/api/post";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/types/post";

const PostDetailForUser: React.FC = () => {
  const { id: postId, slug: postSlug } = useParams<{ id: string; slug: string }>();
  const [postDetail, setPostDetail] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("PostDetail useEffect triggered");
    console.log({ postId, postSlug });
    if (postId && postSlug) {
      console.log("Making API call with:", { id: postId, slug: postSlug });
      setLoading(true);
      setError(null);
      fetchPostById({ id: postId, slug: postSlug } as detailPostProps)
        .then((res) => {
          console.log("API Response:", res);
          if (res && res) {
            setPostDetail(res);
          } else {
            console.log("No data in response:", res);
            setError("Dữ liệu bài viết không hợp lệ");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching post:", err);
          setError(`Không thể tải bài viết: ${err.message || "Lỗi không xác định"}`);
          setLoading(false);
        });
    } else {
      console.log("Missing postId or postSlug");
      setLoading(false);
      setError("Thiếu thông tin ID hoặc slug của bài viết");
    }
  }, [postId, postSlug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: "Bản nháp", variant: "secondary" as const },
      PUBLISHED: { label: "Đã xuất bản", variant: "default" as const },
      ARCHIVED: { label: "Đã lưu trữ", variant: "outline" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "outline" as const };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="shadow-sm">
        {/* <div className="container mx-auto max-w-6xl px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => {
              navigate(-1);
            }}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách bài viết
          </Button>
        </div> */}
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground">Đang tải bài viết...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="mb-4 text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Thử lại
              </Button>
            </div>
          </div>
        ) : postDetail ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <div className="container mx-auto max-w-6xl px-4 py-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate(-1);
                    }}
                    className="mb-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại danh sách bài viết
                  </Button>
                </div>
                <CardHeader className="pb-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-3 text-3xl leading-tight font-bold">{postDetail.title}</CardTitle>
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>
                            {postDetail.author?.first_name} {postDetail.author?.last_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(postDetail.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusBadge(postDetail.status).variant}>
                      {getStatusBadge(postDetail.status).label}
                    </Badge>
                  </div>

                  {postDetail.status === "PUBLISHED" && postDetail.publishedAt && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
                      <Eye className="h-4 w-4" />
                      <span>Đã xuất bản vào {formatDate(postDetail.publishedAt)}</span>
                    </div>
                  )}
                </CardHeader>
              </Card>

              {/* Post Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Nội dung bài viết</CardTitle>
                </CardHeader>
                <CardContent>
                  {postDetail.content?.rawHtml ? (
                    <div
                      className="blog-content prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: postDetail.content.rawHtml }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic">Chưa có nội dung</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Thông tin bài viết</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono text-xs">{postDetail._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slug:</span>
                      <span className="font-mono text-xs break-all">{postDetail.slug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <Badge variant={getStatusBadge(postDetail.status).variant} className="text-xs">
                        {getStatusBadge(postDetail.status).label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạo lúc:</span>
                      <span className="text-xs">{formatDate(postDetail.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cập nhật:</span>
                      <span className="text-xs">{formatDate(postDetail.updated_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lượt xem:</span>
                      <span className="text-xs">{postDetail.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {postDetail.author && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5" />
                      Tác giả
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tên:</span>
                        <span>
                          {postDetail.author.first_name} {postDetail.author.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Username:</span>
                        <span className="font-mono text-xs">{postDetail.author.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-xs break-all">{postDetail.author.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5" />
                    Bộ lọc & Danh mục
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {postDetail.filter_brand && postDetail.filter_brand.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Thương hiệu</h4>
                      <div className="flex flex-wrap gap-1">
                        {postDetail.filter_brand.map((brand: any) => (
                          <Badge key={brand._id} variant="outline" className="text-xs">
                            {brand.option_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {postDetail.filter_hsk_skin_type && postDetail.filter_hsk_skin_type.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Loại da</h4>
                      <div className="flex flex-wrap gap-1">
                        {postDetail.filter_hsk_skin_type.map((skinType: any) => (
                          <Badge key={skinType._id} variant="outline" className="text-xs">
                            {skinType.option_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {postDetail.filter_hsk_ingredients && postDetail.filter_hsk_ingredients.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Thành phần nổi bật</h4>
                      <div className="flex flex-wrap gap-1">
                        {postDetail.filter_hsk_ingredients.map((ingredient: any) => (
                          <Badge key={ingredient._id} variant="outline" className="text-xs">
                            {ingredient.option_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {postDetail.filter_origin && postDetail.filter_origin.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Xuất xứ</h4>
                      <div className="flex flex-wrap gap-1">
                        {postDetail.filter_origin.map((origin: any) => (
                          <Badge key={origin._id} variant="outline" className="text-xs">
                            {origin.option_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {postDetail.filter_hsk_uses && postDetail.filter_hsk_uses.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Công dụng</h4>
                      <div className="flex flex-wrap gap-1">
                        {postDetail.filter_hsk_uses.map((use: any) => (
                          <Badge key={use._id} variant="outline" className="text-xs">
                            {use.option_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">Không tìm thấy bài viết</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailForUser;
