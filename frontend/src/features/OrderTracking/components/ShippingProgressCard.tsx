import { CheckCircle, Clock, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Step = {
  status: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  date: string;
};

interface ShippingProgressCardProps {
  steps: Step[];
}

const getStepIcon = (step: { completed: boolean; current: boolean }) => {
  if (step.completed) return <CheckCircle className="h-6 w-6 text-green-600" />;
  if (step.current) return <Clock className="h-6 w-6 animate-pulse text-blue-600" />;
  return <div className="h-6 w-6 rounded-full border-2 border-gray-300 bg-white" />;
};

export const ShippingProgressCard = ({ steps }: ShippingProgressCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Truck className="h-5 w-5" /> Tiến trình giao hàng
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isFinalStep = index === steps.length - 1;

          const displayAsCompleted = step.completed || (step.current && isFinalStep);

          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                {getStepIcon({ ...step, completed: displayAsCompleted })}
                {index < steps.length - 1 && (
                  <div className={`mt-2 h-16 w-0.5 ${displayAsCompleted ? "bg-green-600" : "bg-gray-300"}`} />
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="mb-1 flex items-center gap-2">
                  <h3
                    className={`font-medium ${
                      displayAsCompleted ? "text-green-600" : step.current ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {step.current && !isFinalStep && (
                    <Badge variant="default" className="bg-blue-600 text-xs">
                      Đang xử lý
                    </Badge>
                  )}
                </div>
                <p className="mb-1 text-sm text-gray-600">{step.description}</p>
                {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);
