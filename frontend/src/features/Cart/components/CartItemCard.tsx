import { LoaderCircle, Trash2 } from "lucide-react";
import React from "react";

import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface CartItemProduct {
  ProductID: string;
  Quantity: number;
  name: string;
  image: string;
  unitPrice: number;
  stock: number;
}

interface CartItemCardProps {
  item: CartItemProduct;
  isSelected: boolean;
  isMutating: boolean;
  onSelectItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  isSelected,
  isMutating,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
      <Checkbox checked={isSelected} onCheckedChange={() => onSelectItem(item.ProductID)} />
      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
      <div className="flex-1">
        <p className="line-clamp-2 font-medium">{item.name}</p>
        <p className="text-sm text-gray-600">Unit Price: {item.unitPrice.toLocaleString("vi-VN")}₫</p>
      </div>
      <QuantitySelector
        quantity={item.Quantity}
        onDecrease={() => onUpdateQuantity(item.ProductID, item.Quantity - 1)}
        onIncrease={() => onUpdateQuantity(item.ProductID, item.Quantity + 1)}
        maxStock={item.stock}
        isUpdating={isMutating}
      />
      <p className="w-24 text-right font-semibold text-red-600">
        {(item.unitPrice * item.Quantity).toLocaleString("vi-VN")}₫
      </p>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-400 hover:text-white"
        onClick={() => onRemoveItem(item.ProductID)}
        disabled={isMutating}
      >
        {isMutating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 " />}
      </Button>
    </div>
  );
};
