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
    <div className="flex items-center space-x-3">
      <img src={product?.image_on_list} alt={product?.name_on_list} className="h-10 w-10 rounded object-cover" />
      <span className="text-sm text-gray-700">{product?.name_on_list}</span>
    </div>
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
          navigate("/me/profile?tab=routine", { replace: true });
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
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="mb-2 text-3xl font-bold">Confirm Your New Skincare Routine</h1>
      <p className="text-muted-foreground mb-6">
        Review the weekly schedule suggested by the AI, active from{" "}
        <strong>{new Date(pendingRoutine.startDate).toLocaleDateString("vi-VN")}</strong> to{" "}
        <strong>{new Date(pendingRoutine.endDate).toLocaleDateString("vi-VN")}</strong>.
      </p>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="text-primary text-lg">{day}</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold">AM ☀️</h4>
                <div className="space-y-3">
                  {pendingRoutine.schedule[day]?.AM.length > 0 ? (
                    pendingRoutine.schedule[day].AM.map((id: string) => (
                      <ProductInfo key={`${day}-am-${id}`} productId={id} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No products for this time.</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold">PM 🌙</h4>
                <div className="space-y-3">
                  {pendingRoutine.schedule[day]?.PM.length > 0 ? (
                    pendingRoutine.schedule[day].PM.map((id: string) => (
                      <ProductInfo key={`${day}-pm-${id}`} productId={id} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No products for this time.</p>
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
    </div>
  );
}

export default ConfirmRoutinePage;
