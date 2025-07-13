import { AlertTriangle, CheckCircle, DollarSignIcon, InfoIcon, Lightbulb, ListOrdered } from "lucide-react";
import React from "react";

import type { SkinRecommendation } from "../types";
import ProductCard from "./ProductCard";

interface RecommendationDisplayProps {
  recommendation: SkinRecommendation;
}

const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({ recommendation }) => {
  if (recommendation.error) {
    return (
      <div className="flex items-center rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        <AlertTriangle size={20} className="mr-3 text-red-500" />
        <div>
          <p className="font-semibold">Error from Advisor</p>
          <p className="text-sm">{recommendation.error}</p>
        </div>
      </div>
    );
  }
  if (recommendation.info) {
    return (
      <div className="flex items-center rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-700">
        <InfoIcon size={20} className="mr-3 text-blue-500" />
        <div>
          <p className="font-semibold">Information from Advisor</p>
          <p className="text-sm">{recommendation.info}</p>
        </div>
      </div>
    );
  }

  const { routineRecommendation: rec } = recommendation;
  if (!rec) {
    return <p className="text-sm text-gray-500">No recommendation data available.</p>;
  }

  return (
    <div className="space-y-6 text-sm">
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
        <h2 className="text-skin-blue mb-2 flex items-center text-lg font-semibold">
          <CheckCircle size={20} className="mr-2 text-green-500" /> Skin Diagnosis
        </h2>
        <p className="mb-1">
          <strong>Diagnosed Skin Type(s):</strong> {rec.diagnosedConcernCategories.join(", ")}
        </p>
        {rec.generalSkinObservations && rec.generalSkinObservations.length > 0 && (
          <p>
            <strong>Observations:</strong> {rec.generalSkinObservations.join(" ")}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-skin-blue mb-2 flex items-center text-lg font-semibold">
          <DollarSignIcon size={20} className="mr-2 text-gray-500" /> Routine Overview
        </h2>
        <p className={`mb-1 font-medium ${rec.fitsOverallBudget ? "text-green-600" : "text-red-600"}`}>
          {rec.fitsOverallBudget ? "Fits Budget" : "Exceeds Budget"}
          <span className="font-normal text-gray-700">
            : {rec.totalRoutineCostVND.toLocaleString("vi-VN")}₫ / {rec.originalBudgetVND.toLocaleString("vi-VN")}₫
          </span>
        </p>
        <p className="text-gray-700">{rec.overallRoutineRationale}</p>
      </div>

      <div>
        <h2 className="text-skin-blue mb-3 text-xl font-bold">Suggested Products</h2>
        {rec.productsInRoutine.map((product, index) => (
          <ProductCard key={product.productName + index} product={product} index={index} />
        ))}
      </div>

      {(rec.suggestedOrderAM?.length > 0 || rec.suggestedOrderPM?.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {rec.suggestedOrderAM?.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-md text-skin-blue mb-2 flex items-center font-semibold">
                <ListOrdered size={18} className="mr-2" /> AM Routine
              </h3>
              <ul className="list-inside list-decimal space-y-1 text-gray-700">
                {rec.suggestedOrderAM.map((p, i) => (
                  <li key={`am-${i}`}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {rec.suggestedOrderPM?.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="text-md text-skin-blue mb-2 flex items-center font-semibold">
                <ListOrdered size={18} className="mr-2" /> PM Routine
              </h3>
              <ul className="list-inside list-decimal space-y-1 text-gray-700">
                {rec.suggestedOrderPM.map((p, i) => (
                  <li key={`pm-${i}`}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {rec.additionalTips && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="text-md mb-2 flex items-center font-semibold text-yellow-700">
            <Lightbulb size={18} className="mr-2 text-yellow-500" /> Additional Tips
          </h3>
          <p className="text-gray-700">{rec.additionalTips}</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationDisplay;
