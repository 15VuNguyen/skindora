import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { fetchPostById } from "@/api/post";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchFilter } from "@/hooks/Filter/useFetchActiveFilter";
import httpClient from "@/lib/axios";
import { type PostFormValues, postSchema } from "@/lib/postSchema";
import type { Brand } from "@/types/Filter/brand";
import type { DacTinh } from "@/types/Filter/dactinh";
import type { Ingredient } from "@/types/Filter/ingredient";
import type { Origin } from "@/types/Filter/origin";
import type { ProductType } from "@/types/Filter/productType";
import type { Size } from "@/types/Filter/size";
import type { SkinType } from "@/types/Filter/skinType";
import type { Post } from "@/types/post";

import TiptapEditor from "../components/TiptapEditor";

// Multi-select component for filter fields
interface MultiSelectFilterProps {
  field: any;
  items: Array<{ _id: string; option_name: string }>;
  label: string;
  placeholder: string;
}

const MultiSelectFilter = ({ field, items, label, placeholder }: MultiSelectFilterProps) => (
  <FormItem className="space-y-2">
    <FormLabel className="text-lg font-semibold text-blue-700">
      {label} <span className="text-sm text-gray-500">(Optional)</span>
    </FormLabel>
    <div className="space-y-2">
      <div className="min-h-[40px] rounded-xl border border-blue-400 p-2 shadow-md">
        {field.value && field.value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {field.value.map((itemId: string) => {
              const item = items.find((i) => i._id === itemId);
              return item ? (
                <span
                  key={itemId}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                >
                  {item.option_name}
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(field.value?.filter((id: string) => id !== itemId));
                    }}
                    className="ml-1 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>
      <Select
        onValueChange={(value) => {
          const currentValue = field.value || [];
          if (!currentValue.includes(value)) {
            field.onChange([...currentValue, value]);
          }
        }}
      >
        <FormControl>
          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
            <SelectValue placeholder={`Add ${label.toLowerCase()}`} />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
          {items
            .filter((item) => !field.value?.includes(item._id))
            .map((item) => (
              <SelectItem
                key={item._id}
                value={item._id}
                className="cursor-pointer rounded-md px-3 py-2 transition hover:bg-blue-100"
              >
                {item.option_name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
    <FormMessage className="text-sm text-red-500" />
  </FormItem>
);

export default function UpdatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uses, setUses] = useState<Brand[]>([]);
  const [productType, setProductType] = useState<ProductType[]>([]);
  const [dactinh, setDactinh] = useState<DacTinh[]>([]);
  const [size, setSize] = useState<Size[]>([]);
  const [ingredient, setIngredient] = useState<Ingredient[]>([]);
  const [skinType, setSkinType] = useState<SkinType[]>([]);
  const [origin, setOrigin] = useState<Origin[]>([]);
  const [brand, setBrand] = useState<Brand[]>([]);
  const { data: filter, fetchFilter } = useFetchFilter();
  const { id: postId, slug: postSlug } = useParams<{ id: string; slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: { rawHtml: "", plainText: "" },
      status: "DRAFT",
      filter_brand: [],
      filter_hsk_skin_type: [],
      filter_hsk_uses: [],
      filter_hsk_product_type: [],
      filter_origin: [],
      filter_hsk_ingredients: [],
      filter_hsk_size: [],
      filter_dac_tinh: [],
    },
  });

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || !postSlug) {
        setLoadError("Invalid post ID or slug");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const postData = await fetchPostById({ id: postId, slug: postSlug });
        setPost(postData);

        // Populate form with existing data
        form.reset({
          title: postData.title || "",
          slug: postData.slug || "",
          content: postData.content || { rawHtml: "", plainText: "" },
          status: (postData.status as "DRAFT" | "PUBLISHED") || "DRAFT",
          filter_brand: postData.filter_brand?.map((item) => item._id) || [],
          filter_hsk_skin_type: postData.filter_hsk_skin_type?.map((item) => item._id) || [],
          filter_hsk_uses: postData.filter_hsk_uses?.map((item) => item._id) || [],
          filter_hsk_product_type: postData.filter_hsk_product_type?.map((item) => item._id) || [],
          filter_origin: postData.filter_origin?.map((item) => item._id) || [],
          filter_hsk_ingredients: postData.filter_hsk_ingredients?.map((item) => item._id) || [],
          filter_hsk_size: postData.filter_hsk_size?.map((item) => item._id) || [],
          filter_dac_tinh: postData.filter_dac_tinh?.map((item) => item._id) || [],
        });
        setLoadError(null);
      } catch (error: any) {
        console.error("Error fetching post:", error);
        setLoadError(error.message || "Failed to load post data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, postSlug, form]);

  // Fetch filter data
  useEffect(() => {
    fetchFilter();
  }, [fetchFilter]);
  // Set filter data when available
  useEffect(() => {
    if (filter?.filter_brand) {
      setBrand(filter.filter_brand);
    }
    if (filter?.filter_hsk_uses) {
      setUses(filter.filter_hsk_uses);
    }
    if (filter?.filter_hsk_product_type) {
      setProductType(filter.filter_hsk_product_type);
    }
    if (filter?.filter_dac_tinh) {
      setDactinh(filter.filter_dac_tinh);
    }
    if (filter?.filter_hsk_size) {
      setSize(filter.filter_hsk_size);
    }
    if (filter?.filter_hsk_ingredients) {
      setIngredient(filter.filter_hsk_ingredients);
    }
    if (filter?.filter_hsk_skin_type) {
      setSkinType(filter.filter_hsk_skin_type);
    }
    if (filter?.filter_origin) {
      setOrigin(filter.filter_origin);
    }
  }, [filter]);

  async function handleSubmit(values: PostFormValues, status: "DRAFT" | "PUBLISHED") {
    if (!postId) {
      toast.error("Lỗi!", { description: "Không tìm thấy ID bài viết để cập nhật." });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...values,
      status,
    };

    // Remove empty filter arrays to avoid sending unnecessary data
    const optionalFilters = [
      "filter_brand",
      "filter_hsk_skin_type",
      "filter_hsk_uses",
      "filter_hsk_product_type",
      "filter_origin",
      "filter_hsk_ingredients",
      "filter_dac_tinh",
      "filter_hsk_size",
    ];

    (optionalFilters as (keyof typeof payload)[]).forEach((key) => {
      if (Array.isArray(payload[key]) && payload[key].length === 0) {
        delete payload[key];
      }
    });

    console.log("UPDATING POST WITH PAYLOAD:", payload);

    try {
      // Use PUT request for updating existing post
      const response = await httpClient.put(`/posts/${postId}`, payload);

      if (response.status === 200 || response.status === 201) {
        const statusText =
          status === "PUBLISHED" ? "đã được cập nhật và xuất bản" : "đã được cập nhật dưới dạng bản nháp";
        toast.success("Thành công!", {
          description: `Bài viết ${statusText}.`,
        });
        navigate("/staff/posts");
      }
    } catch (error: any) {
      const errorResponse = error.response?.data;
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi không xác định xảy ra.";
      console.error("Error updating post:", error.response?.data);

      const errorDetails = Object.entries(errorResponse?.errors || {})
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join("\n");

      toast.error("Thất bại!", {
        description: `${errorMessage}\n${errorDetails}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // EditorWithPreview component for content editing
  const EditorWithPreview = ({ control, name, label, error }: any) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel className="text-base font-medium">{label}</FormLabel>}
            <div className="grid grid-cols-1 gap-6 rounded-lg border border-gray-200 p-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h4 className="border-b border-gray-200 pb-2 text-sm font-medium text-gray-700">
                  📝 Soạn thảo nội dung
                </h4>
                <TiptapEditor
                  value={field.value?.rawHtml || ""}
                  onChange={(newContent: { rawHtml: string; plainText: string }) => {
                    field.onChange(newContent);
                  }}
                />
              </div>
              <div className="space-y-3">
                <h4 className="border-b border-gray-200 pb-2 text-sm font-medium text-gray-700">
                  👁️ Xem trước trực tiếp
                </h4>
                <div className="prose prose-sm min-h-[300px] max-w-none rounded-md border border-gray-200 bg-gray-50 p-4">
                  {field.value && field.value.rawHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: field.value.rawHtml }} />
                  ) : (
                    <p className="text-gray-500 italic">
                      Nội dung xem trước sẽ hiện ở đây khi bạn bắt đầu soạn thảo...
                    </p>
                  )}
                </div>
              </div>
            </div>
            {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
          </FormItem>
        )}
      />
    );
  };

  const onSaveDraft = form.handleSubmit((values) => handleSubmit(values, "DRAFT"));
  const onPublish = form.handleSubmit((values) => handleSubmit(values, "PUBLISHED"));

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Đang tải thông tin bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <div className="container mx-auto p-4">
        <div className="mx-auto max-w-md">
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="text-red-600">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Không thể tải bài viết</h3>
                <p className="text-sm text-gray-600">{loadError}</p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => navigate("/staff/posts")}>
                    Quay lại danh sách
                  </Button>
                  <Button onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/staff/posts")} className="hover:bg-gray-100">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cập nhật bài viết</h1>
                {post && (
                  <p className="mt-1 text-sm text-gray-500">
                    Cập nhật lần cuối: {new Date(post.updated_at || post.created_at).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu bản nháp
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={onPublish}
                disabled={isSubmitting}
                className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                    Đang xuất bản...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Xuất bản
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <Form {...form}>
          <form className="space-y-8">
            {/* Basic Information */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center text-xl font-semibold text-blue-900">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Thông tin cơ bản
                </CardTitle>
                <Typography className="text-blue-700">Cung cấp tiêu đề và đường dẫn cho bài viết của bạn.</Typography>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Tiêu đề bài viết</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Đường dẫn (Slug)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="duong-dan-bai-viet..."
                            className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center text-xl font-semibold text-green-900">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Nội dung bài viết
                </CardTitle>
                <Typography className="text-green-700">
                  Soạn thảo nội dung ở khung bên trái và xem kết quả hiển thị ở khung bên phải.
                </Typography>
              </CardHeader>
              <CardContent className="pt-6">
                <EditorWithPreview
                  control={form.control}
                  name="content"
                  label=""
                  error={form.formState.errors.content?.rawHtml?.message || form.formState.errors.content?.message}
                />
              </CardContent>
            </Card>
            {/* Filter Information */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center text-xl font-semibold text-purple-900">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                    />
                  </svg>
                  Bộ lọc nội dung
                </CardTitle>
                <Typography className="text-purple-700">
                  Chọn các bộ lọc phù hợp để giúp người đọc dễ dàng tìm thấy bài viết của bạn.
                </Typography>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="filter_brand"
                    render={({ field }) => (
                      <MultiSelectFilter
                        field={field}
                        items={brand}
                        label="Thương hiệu"
                        placeholder="Chọn thương hiệu..."
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filter_hsk_skin_type"
                    render={({ field }) => (
                      <MultiSelectFilter
                        field={field}
                        items={skinType}
                        label="Loại da phù hợp"
                        placeholder="Chọn loại da..."
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filter_hsk_uses"
                    render={({ field }) => (
                      <MultiSelectFilter field={field} items={uses} label="Công dụng" placeholder="Chọn công dụng..." />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filter_hsk_product_type"
                    render={({ field }) => (
                      <MultiSelectFilter
                        field={field}
                        items={productType}
                        label="Loại sản phẩm"
                        placeholder="Chọn loại sản phẩm..."
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filter_origin"
                    render={({ field }) => (
                      <MultiSelectFilter field={field} items={origin} label="Xuất xứ" placeholder="Chọn xuất xứ..." />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filter_hsk_size"
                    render={({ field }) => (
                      <MultiSelectFilter
                        field={field}
                        items={size}
                        label="Kích thước"
                        placeholder="Chọn kích thước..."
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filter_dac_tinh"
                    render={({ field }) => (
                      <MultiSelectFilter
                        field={field}
                        items={dactinh}
                        label="Đặc tính"
                        placeholder="Chọn đặc tính..."
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filter_hsk_ingredients"
                    render={({ field }) => (
                      <MultiSelectFilter
                        field={field}
                        items={ingredient}
                        label="Thành phần"
                        placeholder="Chọn thành phần..."
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
