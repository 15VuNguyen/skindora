import { Minus, Plus } from "lucide-react";

import { Button } from "./button";

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  maxStock: number;
  isUpdating: boolean;
}

export const QuantitySelector = ({ quantity, onDecrease, onIncrease, maxStock, isUpdating }: QuantitySelectorProps) => {
  return (
    <div className="flex items-center rounded-md border border-gray-300">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-600 hover:bg-red-500"
        onClick={onDecrease}
        disabled={quantity <= 1 || isUpdating}
      >
        <Minus className="h-4 w-4 " />
      </Button>
      <span className="w-10 text-center font-medium text-gray-800">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-600 hover:bg-green-500"
        onClick={onIncrease}
        disabled={quantity >= maxStock || isUpdating}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
