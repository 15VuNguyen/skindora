import {
  ChevronDown,
  ChevronUp,
  CircleCheck,
  DollarSign,
  Droplet,
  ExternalLink,
  Info,
  ListChecks,
  Tag,
} from "lucide-react";
import React from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";


interface Product {
  productName: string;
  brand: string;
  priceVND: string;
  roleInRoutine: string;
  reasoningForInclusion: string;
  keyIngredients: {
    ingredient: string;
    benefit: string;
  }[];
  usageInstructions: {
    applicationNotes: string;
    frequency: string;
  };
  productUrl: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-skin-blue mb-1 text-lg font-semibold">
            {index + 1}. {product.productName}
          </h3>
          <p className="mb-1 flex items-center text-sm text-gray-500">
            <Tag size={14} className="text-skin-blue-light mr-2" /> Brand: {product.brand}
          </p>
          <p className="mb-2 flex items-center text-sm font-medium text-gray-700">
            <DollarSign size={14} className="mr-2 text-green-500" />
            Price: {parseInt(product.priceVND).toLocaleString("vi-VN")}₫
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-skin-blue hover:text-skin-blue-hover"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </div>

      {isExpanded && (
        <div className="animate-fade-in-fast mt-3">
          <p className="mb-2 text-sm text-gray-600">
            <Info size={14} className="text-skin-blue-light mr-2 inline" />
            <strong>Role:</strong> {product.roleInRoutine}
          </p>
          <p className="mb-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-gray-600">
            <ListChecks size={14} className="text-skin-blue-light mr-2 inline" />
            <strong>Reasoning:</strong> {product.reasoningForInclusion}
          </p>

          <Accordion type="single" collapsible className="mb-3 w-full">
            <AccordionItem value="key-ingredients">
              <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline">
                <Droplet size={14} className="text-skin-blue-light mr-2 inline" /> Key Ingredients (
                {product.keyIngredients.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-none space-y-1 pl-2 text-xs text-gray-600">
                  {product.keyIngredients.map((ki, idx) => (
                    <li key={idx} className="rounded bg-gray-50 p-1">
                      <strong>{ki.ingredient}:</strong> {ki.benefit}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="usage-instructions">
              <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline">
                <CircleCheck size={14} className="text-skin-blue-light mr-2 inline" /> Usage Instructions
              </AccordionTrigger>
              <AccordionContent className="space-y-1 text-xs text-gray-600">
                <p>
                  <strong>How to use:</strong> {product.usageInstructions.applicationNotes}
                </p>
                <p>
                  <strong>Frequency:</strong> {product.usageInstructions.frequency}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-skin-blue hover:text-skin-blue-hover mt-2 inline-flex items-center text-sm underline"
          >
            View Product <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
