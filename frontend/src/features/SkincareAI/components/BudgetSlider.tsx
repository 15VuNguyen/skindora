import { DollarSign } from "lucide-react";

import { Slider } from "@/components/ui/slider";

interface BudgetSliderProps {
  budget: number;
  onBudgetChange: (value: number) => void;
}

const BudgetSlider = ({ budget, onBudgetChange }: BudgetSliderProps) => {
  return (
    <div className="animate-fade-in mx-auto w-full max-w-md">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor="budget" className="flex items-center text-sm font-medium text-gray-700">
          <DollarSign className="mr-1 h-4 w-4" />
          Ngân Sách
        </label>
        <span className="text-skin-blue text-sm font-semibold">
          {budget === 25 ? "Dưới $25" : budget === 50 ? "$25-$50" : budget === 75 ? "$50-$100" : "Trên $100"}
        </span>
      </div>
      <Slider
        id="budget"
        defaultValue={[50]}
        min={25}
        max={100}
        step={25}
        onValueChange={(values) => onBudgetChange(values[0])}
        className="from-skin-lightblue to-skin-blue [&>span:first-child]:bg-gradient-to-r"
      />
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>Tiết Kiệm</span>
        <span>Cao Cấp</span>
      </div>
    </div>
  );
};

export default BudgetSlider;
