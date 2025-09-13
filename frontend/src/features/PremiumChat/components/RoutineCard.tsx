import { Check } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { MockRoutine } from "../mockChatService";

interface RoutineCardProps {
  routine: MockRoutine;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine }) => (
  <Card className="my-2 border-emerald-200 bg-emerald-50">
    <CardHeader className="p-3">
      <CardTitle className="text-base text-emerald-800">{routine.title}</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4 p-3 pt-0 md:grid-cols-2">
      <div>
        <h4 className="mb-2 text-sm font-semibold">Buổi Sáng (AM)</h4>
        <ul className="space-y-1">
          {routine.am.map((step, index) => (
            <li key={`am-${index}`} className="flex items-start text-sm">
              <Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-emerald-600" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-semibold">Buổi Tối (PM)</h4>
        <ul className="space-y-1">
          {routine.pm.map((step, index) => (
            <li key={`pm-${index}`} className="flex items-start text-sm">
              <Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-emerald-600" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);
