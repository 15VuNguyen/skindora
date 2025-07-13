
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ProductDetailLayoutProps {
  children: React.ReactNode;
}

export function ProductDetailLayout({ children }: ProductDetailLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại cửa hàng
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
