import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { MockProductRecommendation } from "../mockChatService";

interface ProductRecommendationCardProps {
  product: MockProductRecommendation;
}

export const ProductRecommendationCard: React.FC<ProductRecommendationCardProps> = ({ product }) => (
  <Card className="my-2 bg-white">
    <CardHeader className="p-3">
      <CardTitle className="text-base">{product.productName}</CardTitle>
    </CardHeader>
    <CardContent className="flex gap-4 p-3 pt-0">
      <img src={product.imageUrl} alt={product.productName} className="h-20 w-20 rounded-md object-cover" />
      <div className="flex flex-col justify-between">
        <p className="text-sm text-gray-600">{product.description}</p>
        <Link to={product.productUrl}>
          <Button size="sm" variant="outline">
            Xem sản phẩm
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);
