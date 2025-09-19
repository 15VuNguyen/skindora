import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSaveRoutineMutation } from "@/hooks/mutations/useSaveRoutineMutation";
import { productService } from "@/services/productService";
import type { Product } from "@/types";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ProductInfo = ({ productId }: { productId: string }) => {
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => productService.getProductById(productId),
    staleTime: Infinity,
  });

  if (isLoading)
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
        <span>Loading...</span>
      </div>
    );
  if (isError) return <li className="text-red-500">Error loading product</li>;

  return (
    <button
      onClick={() => navigator.clipboard.writeText(product?._id || "")}
      className="group relative inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-xs text-gray-700 hover:border-gray-300 hover:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    >
      <img src={product?.image_on_list} alt={product?.name_on_list} className="h-8 w-8 rounded object-cover" />
      <span>{product?.name_on_list}</span>
      <span className="text-[10px] text-indigo-600 opacity-0 transition group-hover:opacity-100">Copy</span>
    </button>
  );
};

export function ConfirmRoutinePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pendingRoutine = location.state?.routine;

  const { mutate: saveRoutine, isPending } = useSaveRoutineMutation();

  useEffect(() => {
    if (!pendingRoutine) {
      toast.error("No routine to confirm", { description: "Redirecting you back to the AI advisor." });
      navigate("/skincare-ai");
    }
  }, [pendingRoutine, navigate]);

  const handleSave = () => {
    if (!pendingRoutine) return;
    saveRoutine(pendingRoutine, {
      onSuccess: (result) => {
        if (result.isOk()) {
          toast.success("Routine Saved!", { description: "Your new skincare routine is now active." });
          navigate("/profile?tab=routine", { replace: true });
        } else {
          toast.error("Failed to Save Routine", { description: result.error.message });
        }
      },
      onError: (error) => {
        toast.error("Failed to Save Routine", { description: error.message || "An unexpected error occurred." });
      },
    });
  };

  if (!pendingRoutine) {
    return <div className="container p-8">Loading routine or redirecting...</div>;
  }

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900 antialiased">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 font-bold text-white shadow">
              WS
            </div>
            <div>
              <h1 className="text-xl font-semibold sm:text-2xl">Weekly Routine</h1>
              <p className="text-sm text-gray-500">
                {`Range ${new Date(pendingRoutine.startDate).toLocaleDateString("vi-VN")}`} –{" "}
                {`
                ${new Date(pendingRoutine.endDate).toLocaleDateString("vi-VN")}`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> AM
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-500"></span> PM
          </span>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DAYS_OF_WEEK.map((day) => (
            <Card key={day} className="rounded-2xl border border-gray-200 bg-white shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{day}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="inline-flex items-center gap-2 text-sm font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span> AM
                    </h4>
                    <span className="text-xs text-gray-500">{pendingRoutine.schedule[day]?.AM.length || 0} items</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pendingRoutine.schedule[day]?.AM.length > 0 ? (
                      pendingRoutine.schedule[day].AM.map((id: string) => (
                        <ProductInfo key={`${day}-am-${id}`} productId={id} />
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No entries</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="inline-flex items-center gap-2 text-sm font-medium">
                      <span className="h-2 w-2 rounded-full bg-sky-500"></span> PM
                    </h4>
                    <span className="text-xs text-gray-500">{pendingRoutine.schedule[day]?.PM.length || 0} items</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pendingRoutine.schedule[day]?.PM.length > 0 ? (
                      pendingRoutine.schedule[day].PM.map((id: string) => (
                        <ProductInfo key={`${day}-pm-${id}`} productId={id} />
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No entries</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/skincare-ai")} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save and Activate Routine"}
          </Button>
        </div>
      </main>
    </div>
  );
}

export default ConfirmRoutinePage;
