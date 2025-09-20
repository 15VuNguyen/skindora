import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Calendar, Moon, PackageOpen, RefreshCw, Sparkles, Sun } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRoutineQuery } from "@/hooks/queries/useUserRoutineQuery";
import { productService } from "@/services/productService";
import type { Product } from "@/types";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type NormalizedSchedule = Record<string, { AM: string[]; PM: string[] }>;

const toDisplayDate = (value?: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ensureStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

const ROUTINE_PRODUCTS_QUERY_KEY = ["routine", "products"] as const;

const formatCurrency = (value?: string) => {
  if (!value) return "—";
  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  if (Number.isNaN(numeric)) return value;
  return `${numeric.toLocaleString("vi-VN")}₫`;
};

const fetchRoutineProducts = async (productIds: string[]): Promise<Record<string, Product>> => {
  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return {};
  }

  const pairs = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const product = await productService.getProductById(id);
        return [id, product] as const;
      } catch (err) {
        console.warn(`[RoutineTab] Failed to fetch product ${id}`, err);
        return [id, null] as const;
      }
    })
  );

  return pairs.reduce<Record<string, Product>>((acc, [id, product]) => {
    if (product) {
      acc[id] = product;
    }
    return acc;
  }, {});
};

const useRoutineProducts = (productIds: string[]) => {
  const stableIds = useMemo(() => productIds.slice().sort(), [productIds]);
  return useQuery<Record<string, Product>>({
    queryKey: [...ROUTINE_PRODUCTS_QUERY_KEY, stableIds],
    queryFn: () => fetchRoutineProducts(productIds),
    enabled: stableIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

interface RoutineProductBadgeProps {
  productId: string;
  product?: Product;
  layout?: "compact" | "detailed";
}

const RoutineProductBadge = ({ productId, product, layout = "compact" }: RoutineProductBadgeProps) => {
  const name = product?.name_on_list ?? `#${productId.slice(-6)}`;
  const price = product?.price_on_list?.trim();
  const href = `/product/${product?._id ?? productId}`;

  if (layout === "detailed") {
    return (
      <div className="border-border/80 bg-card/95 hover:border-primary/50 hover:shadow-lg group flex w-full flex-col gap-3 rounded-2xl border p-3 transition">
        <div className="flex items-start gap-3">
          {product?.image_on_list ? (
            <img
              src={product.image_on_list}
              alt={product.name_on_list}
              className="group-hover:scale-[1.02] h-16 w-16 flex-shrink-0 rounded-xl border object-cover transition"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border text-sm font-semibold">
              <PackageOpen className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <p className="line-clamp-1 text-sm font-semibold sm:text-base">{name}</p>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {product?.engName_on_list || product?.productName_detail || `Mã sản phẩm ${productId.slice(-6)}`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-primary text-sm font-semibold sm:text-base">{formatCurrency(price)}</span>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={href}>Chi tiết</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={`/skincare-ai?product=${productId}`}>Trao đổi với AI</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={href}
      className="hover:border-primary/60 hover:bg-card inline-flex w-full max-w-xs items-center gap-3 rounded-lg border border-border bg-card/70 px-3 py-2 text-left transition"
      title={product?.name_on_list ?? `Xem chi tiết sản phẩm ${productId}`}
    >
      {product?.image_on_list ? (
        <img
          src={product.image_on_list}
          alt={product.name_on_list}
          className="h-10 w-10 flex-shrink-0 rounded-md border object-cover"
        />
      ) : (
        <div className="bg-muted text-muted-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border text-xs font-semibold">
          <PackageOpen className="h-4 w-4" />
        </div>
      )}
      <div className="min-w-0">
        <p className="line-clamp-1 text-xs font-medium">{name}</p>
        <p className="text-muted-foreground text-[11px]">
          {price || `Mã: ${productId.slice(-6)}`}
        </p>
      </div>
    </Link>
  );
};

export const RoutineTab = () => {
  const navigate = useNavigate();
  const {
    data: routine,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useUserRoutineQuery();

  const normalizedSchedule = useMemo<NormalizedSchedule | null>(() => {
    if (!routine) {
      return null;
    }

    const schedule: NormalizedSchedule = {} as NormalizedSchedule;
    const rawSchedule = (routine.schedule ?? {}) as Record<string, unknown>;

    DAYS_OF_WEEK.forEach((day) => {
      const possibleKeys = [day, day.toLowerCase()];
      let entry: Record<string, unknown> | null = null;

      for (const key of possibleKeys) {
        const candidate = rawSchedule[key];
        if (candidate && typeof candidate === "object") {
          entry = candidate as Record<string, unknown>;
          break;
        }
      }

      const am = ensureStringArray(entry?.["AM"] ?? entry?.["am"]);
      const pm = ensureStringArray(entry?.["PM"] ?? entry?.["pm"]);
      schedule[day] = { AM: am, PM: pm };
    });

    return schedule;
  }, [routine]);

  const uniqueProductIds = useMemo(() => {
    if (!normalizedSchedule) {
      return new Set<string>();
    }

    const ids = new Set<string>();
    Object.values(normalizedSchedule).forEach(({ AM, PM }) => {
      AM.forEach((id) => ids.add(id));
      PM.forEach((id) => ids.add(id));
    });
    return ids;
  }, [normalizedSchedule]);

  const productIdList = useMemo(() => Array.from(uniqueProductIds), [uniqueProductIds]);

  const {
    data: productMap,
    isLoading: isProductsLoading,
  } = useRoutineProducts(productIdList);

  const productLookup = productMap ?? {};
  const todayWeekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  const normalizedToday = todayWeekday.charAt(0).toUpperCase() + todayWeekday.slice(1).toLowerCase();

  const orderedDays = useMemo(() => {
    const idx = DAYS_OF_WEEK.indexOf(normalizedToday as (typeof DAYS_OF_WEEK)[number]);
    if (idx === -1) return [...DAYS_OF_WEEK];
    return [DAYS_OF_WEEK[idx], ...DAYS_OF_WEEK.filter((_, index) => index !== idx)];
  }, [normalizedToday]);

  const todayKey = orderedDays[0];
  const todaySchedule = normalizedSchedule?.[todayKey] ?? { AM: [], PM: [] };
  const remainingDays = orderedDays.slice(1);

  const renderProductList = (ids: string[], keyPrefix: string, layout: "compact" | "detailed" = "compact") => {
    if (!ids.length) {
      return <p className="text-muted-foreground text-xs">Không có sản phẩm</p>;
    }

    if (isProductsLoading && productIdList.length > 0) {
      return (
        <div className="flex flex-wrap gap-2">
          {ids.map((id) => (
            <Skeleton
              key={`${keyPrefix}-skeleton-${id}`}
              className={layout === "detailed" ? "h-24 w-full" : "h-12 w-full max-w-xs"}
            />
          ))}
        </div>
      );
    }

    return (
      <div className={layout === "detailed" ? "space-y-3" : "flex flex-wrap gap-2"}>
        {ids.map((id) => (
          <RoutineProductBadge
            key={`${keyPrefix}-${id}`}
            productId={id}
            product={productLookup[id]}
            layout={layout}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-muted shadow-sm">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" /> Không thể tải routine
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {error?.message || "Đã xảy ra lỗi khi tải routine. Vui lòng thử lại."}
          </p>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="mr-2 h-4 w-4" /> Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!routine) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-2">
            <Sparkles className="text-primary h-8 w-8" />
            Bạn chưa có routine nào được lưu
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Khám phá chuyên gia AI của Skindora để tạo routine chăm sóc da phù hợp với bạn.
          </p>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => navigate("/skincare-ai")}>Bắt đầu với Skincare AI</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-background to-background shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default" className="bg-primary text-white uppercase tracking-wide">
              Hôm nay
            </Badge>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="text-primary h-5 w-5" /> {todayKey}
            </CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>
              Giai đoạn: <strong>{toDisplayDate(routine.start_date)}</strong> – <strong>{toDisplayDate(routine.end_date)}</strong>
            </span>
            {routine.updated_at && <span>Lần cập nhật gần nhất {toDisplayDate(routine.updated_at)}</span>}
            <span>
              Tổng cộng <strong>{uniqueProductIds.size}</strong> sản phẩm trong routine
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-3">
            <header className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2 text-base">
                <Sun className="text-amber-500 h-5 w-5" /> Buổi sáng
              </span>
              <span className="text-muted-foreground text-sm">{todaySchedule.AM.length} sản phẩm</span>
            </header>
            {renderProductList(todaySchedule.AM, `${todayKey}-am`, "detailed")}
          </section>

          <section className="space-y-3">
            <header className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2 text-base">
                <Moon className="text-indigo-500 h-5 w-5" /> Buổi tối
              </span>
              <span className="text-muted-foreground text-sm">{todaySchedule.PM.length} sản phẩm</span>
            </header>
            {renderProductList(todaySchedule.PM, `${todayKey}-pm`, "detailed")}
          </section>
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Lịch chăm sóc cho các ngày khác</CardTitle>
          <p className="text-muted-foreground text-sm">
            So sánh nhanh buổi sáng và buổi tối. Chạm vào từng ngày để xem chi tiết sản phẩm.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {remainingDays.length > 0 ? (
            <Accordion type="single" collapsible defaultValue={remainingDays[0]}>
              {remainingDays.map((day) => {
                const daySchedule = normalizedSchedule?.[day] ?? { AM: [], PM: [] };
                const totalCount = daySchedule.AM.length + daySchedule.PM.length;

                return (
                  <AccordionItem key={day} value={day}>
                    <AccordionTrigger className="px-4">
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="rounded-full text-xs">
                            {day}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Sun className="text-amber-500 h-4 w-4" /> {daySchedule.AM.length} AM
                            </span>
                            <span className="flex items-center gap-1">
                              <Moon className="text-indigo-500 h-4 w-4" /> {daySchedule.PM.length} PM
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {totalCount} sản phẩm
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span className="flex items-center gap-2">
                              <Sun className="text-amber-500 h-4 w-4" /> Buổi sáng
                            </span>
                            <span className="text-muted-foreground text-xs">{daySchedule.AM.length} sản phẩm</span>
                          </div>
                          {renderProductList(daySchedule.AM, `${day}-am`)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span className="flex items-center gap-2">
                              <Moon className="text-indigo-500 h-4 w-4" /> Buổi tối
                            </span>
                            <span className="text-muted-foreground text-xs">{daySchedule.PM.length} sản phẩm</span>
                          </div>
                          {renderProductList(daySchedule.PM, `${day}-pm`)}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Routine hiện chỉ áp dụng cho hôm nay. Hãy trò chuyện với AI để mở rộng lịch trình của bạn.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="text-sm text-muted-foreground">
            Muốn điều chỉnh routine? Hãy trò chuyện lại với Skincare AI để nhận gợi ý mới.
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Tư vấn lại với AI</Button>
        </CardContent>
      </Card>
    </div>
  );
};
