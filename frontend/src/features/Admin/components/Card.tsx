import { CreditCard } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface CardDemoProps {
  title: string;
  amount: string;
  change: string;
  icon?: React.ReactNode;
}

export function CardDemo({ title, amount, change, icon }: CardDemoProps) {
  return (
    <Card className="w-full rounded">
      <CardContent>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="mb-2 text-sm">{title}</div>
            <div>{icon ?? <CreditCard size={15} />}</div>
          </div>
        </CardTitle>
        <div className="text-2xl font-bold">{amount}</div>
        <div className="text-sm text-gray-500">{change}</div>
      </CardContent>
    </Card>
  );
}
