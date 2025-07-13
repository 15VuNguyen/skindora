import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductBadgesProps {
  product: Product;
  filterIdToNameMap: Map<string, string>;
}

export function ProductBadges({ product, filterIdToNameMap }: ProductBadgesProps) {
  const productBadges = useMemo(() => {
    if (!product || filterIdToNameMap.size === 0) return [];
    const badges: { id: string; name: string }[] = [];
    for (const [key, value] of Object.entries(product)) {
      if (key.startsWith("filter_") && typeof value === "string" && value) {
        const name = filterIdToNameMap.get(value);
        if (name) badges.push({ id: value, name });
      }
    }
    return badges;
  }, [product, filterIdToNameMap]);

  return (
    <div className="flex flex-wrap gap-2">
      {productBadges.map((badge) => (
        <Badge key={badge.id} variant="outline" className="mb-2">
          {badge.name}
        </Badge>
      ))}
    </div>
  );
}