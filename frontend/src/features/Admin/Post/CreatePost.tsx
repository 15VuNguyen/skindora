import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

export default function CreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uses, setUses] = useState<Brand[]>([]);
  const [productType, setProductType] = useState<ProductType[]>([]);
  const [dactinh, setDactinh] = useState<DacTinh[]>([]);
  const [size, setSize] = useState<Size[]>([]);
  const [ingredient, setIngredient] = useState<Ingredient[]>([]);
  const [skinType, setSkinType] = useState<SkinType[]>([]);
  const [origin, setOrigin] = useState<Origin[]>([]);
  const [brand, setBrand] = useState<Brand[]>([]);
  const { data: filter, fetchFilter } = useFetchFilter();

  useEffect(() => {
    fetchFilter();
  }, [fetchFilter]);
  useEffect(() => {
    if (filter?.filter_brand) {
      // Access .data here
      setBrand(filter.filter_brand);
    }
    if (filter?.filter_hsk_uses) {
      // Access .data here
      setUses(filter.filter_hsk_uses);
    }
    if (filter?.filter_hsk_product_type) {
      // Access .data here
      setProductType(filter.filter_hsk_product_type);
    }
    if (filter?.filter_dac_tinh) {
      // Access .data here
      setDactinh(filter.filter_dac_tinh);
    }
    if (filter?.filter_hsk_size) {
      // Access .data here
      setSize(filter.filter_hsk_size);
    }
    if (filter?.filter_hsk_ingredients) {
      // Access .data here
      setIngredient(filter.filter_hsk_ingredients);
    }
    if (filter?.filter_hsk_skin_type) {
      // Access .data here - THIS IS THE PRIMARY FIX FOR YOUR ERROR
      setSkinType(filter.filter_hsk_skin_type);
    }
    if (filter?.filter_origin) {
      // Access .data here
      setOrigin(filter.filter_origin);
    }
  }, [filter]);
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

  async function handleSubmit(values: PostFormValues, status: "DRAFT" | "PUBLISHED") {
    setIsSubmitting(true);
    const payload = {
      ...values,
      status,
    };
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
    console.log("FINAL PAYLOAD TO SERVER:", payload);

    try {
      const response = await httpClient.post("/posts", payload);
      if (response.status === 200 || response.status === 201) {
        const statusText = status === "PUBLISHED" ? "đã được xuất bản" : "đã được lưu dưới dạng bản nháp";
        toast.success("Thành công!", {
          description: `Bài viết ${statusText}.`,
        });
        form.reset();
        navigate("/staff/posts");
      }
    } catch (error: any) {
      const errorResponse = error.response?.data;
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi không xác định xảy ra.";
      console.log(error.response.data);
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

  const onSaveDraft = form.handleSubmit((values) => handleSubmit(values, "DRAFT"));
  const onPublish = form.handleSubmit((values) => handleSubmit(values, "PUBLISHED"));

  const EditorWithPreview = ({ control, name, label, error }: any) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
              <TiptapEditor
                value={field.value?.rawHtml || ""}
                onChange={(newContent: { rawHtml: string; plainText: string }) => {
                  field.onChange(newContent);
                }}
              />
              <div className="prose bg-muted max-w-none rounded-md border p-3">
                <h4 className="text-muted-foreground mb-2 text-sm font-semibold italic">Xem trước trực tiếp</h4>
                {field.value && field.value.rawHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: field.value.rawHtml }} />
                ) : (
                  <p className="text-muted-foreground text-sm">Nội dung xem trước sẽ hiện ở đây...</p>
                )}
              </div>
            </div>
            {error && <p className="text-destructive mt-2 text-sm font-medium">{error}</p>}
            <br />
          </FormItem>
        )}
      />
    );
  };
  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          variant="ghost"
          className="hover:bg-transparent hover:text-green-600"
          onClick={() => {
            navigate("/admin/posts");
          }}
        >
          <ArrowLeft />
          Quay lại
        </Button>
      </div>
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form className="space-y-8">
            <h1 className="mb-6 text-3xl font-bold">Thêm bài viết mới</h1>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài viết</CardTitle>
                <Typography>Cung cấp các thông tin chi tiết cho bài viết của bạn.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Tên bài viết</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên bài viết(title):</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Tên slug (slug):</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nội dung chi tiết (HTML)</CardTitle>
                <Typography>Soạn thảo nội dung ở khung bên trái và xem kết quả hiển thị ở khung bên phải.</Typography>
              </CardHeader>
              <CardContent className="space-y-8">
                {" "}
                <EditorWithPreview
                  control={form.control}
                  name="content"
                  label="Mô tả chi tiết (content):"
                  error={form.formState.errors.content?.rawHtml?.message || form.formState.errors.content?.message}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Filter Information (Filter IDs)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="filter_brand"
                  render={({ field }) => (
                    <MultiSelectFilter
                      field={field}
                      items={brand}
                      label="Thương hiệu-(filter_brand)"
                      placeholder="Select brands..."
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
                      label="Dành cho loại da-(filter_hsk_skin_type)"
                      placeholder="Select skin types..."
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_hsk_uses"
                  render={({ field }) => (
                    <MultiSelectFilter
                      field={field}
                      items={uses}
                      label="Tác dụng-(filter_hsk_uses)"
                      placeholder="Select uses..."
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_hsk_product_type"
                  render={({ field }) => (
                    <MultiSelectFilter
                      field={field}
                      items={productType}
                      label="Loại sản phẩm-(filter_hsk_product_type)"
                      placeholder="Select product types..."
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_origin"
                  render={({ field }) => (
                    <MultiSelectFilter
                      field={field}
                      items={origin}
                      label="Xuất xứ-(filter_origin)"
                      placeholder="Select origins..."
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_hsk_size"
                  render={({ field }) => (
                    <MultiSelectFilter
                      field={field}
                      items={size}
                      label="Size-(filter_hsk_size)"
                      placeholder="Select sizes..."
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
                      label="Đặc tính-(filter_dac_tinh)"
                      placeholder="Select characteristics..."
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
                      label="Thành phần-(filter_hsk_ingredients)"
                      placeholder="Select ingredients..."
                    />
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSubmitting}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Đang lưu..." : "Lưu bản nháp"}
              </Button>
              <Button type="button" onClick={onPublish} disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
                <Eye className="mr-2 h-4 w-4" />
                {isSubmitting ? "Đang xuất bản..." : "Xuất bản"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
