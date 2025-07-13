import { ChevronRight, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type colorScheme = "purple" | "blue" | "amber";
const colorMapping: Record<colorScheme, { base: string; hover: string }> = {
  purple: { base: "bg-purple-50", hover: "hover:bg-purple-100" },
  blue: { base: "bg-blue-50", hover: "hover:bg-blue-100" },
  amber: { base: "bg-amber-50", hover: "hover:bg-amber-100" },
};
const sampleCategories = [
  {
    title: "Chăm sóc da mặt",
    description: "Các sản phẩm làm sạch, dưỡng ẩm và điều trị đặc biệt cho da mặt.",
  },
  {
    title: "Chống nắng & Chống lão hóa",
    description: "Bảo vệ da khỏi tác hại của tia UV và các dấu hiệu lão hóa.",
  },
  {
    title: "Da nhạy cảm",
    description: "Sản phẩm dịu nhẹ đặc biệt dành cho da nhạy cảm, dễ kích ứng.",
  },
];

function CategoryLoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <LoaderCircle className="text-primary h-10 w-10 animate-spin" />
    </div>
  );
}

function CategoryCardGrid({ categories }: { categories: typeof sampleCategories }) {
  const colorThemes: colorScheme[] = ["purple", "blue", "amber"];
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, idx) => (
        <CategoryCard
          key={cat.title + idx}
          title={cat.title}
          description={cat.description}
          theme={colorThemes[idx % colorThemes.length]} // 1 % 3 = 1, 2 % 3 = 2, 3 % 3 = 0
        />
      ))}
    </div>
  );
}

export default function HighlightCatagories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<typeof sampleCategories>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(sampleCategories);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-12 flex items-center justify-between">
        <h2 className="prose-h2 text-2xl font-bold">Danh mục nổi bật</h2>
      </div>
      {loading ? <CategoryLoadingSpinner /> : <CategoryCardGrid categories={categories} />}
    </div>
  );
}

function CategoryCard({
  title,
  description,
  theme = "purple",
}: {
  title: string;
  description: string;
  theme?: colorScheme;
}): React.JSX.Element {
  const navigate = useNavigate();
  const { base, hover } = colorMapping[theme];

  const handleExploreClick = () => {
    navigate("/products");
  };

  return (
    <Card
      className={cn(
        base,
        hover,
        "group border-0 shadow-none transition-all duration-300 hover:opacity-100 hover:shadow-lg"
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant={"link"} className="hover:cursor-pointer" onClick={handleExploreClick}>
          Khám phá ngay
          <ChevronRight className="text-primary" />
        </Button>
      </CardFooter>
    </Card>
  );
}
