import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";

interface HeroProps {
  title?: string;
  subtitle?: string;
  paragraph?: string;
}

export default function Hero({
  title = "Chăm sóc da ",
  subtitle = " chính xác và hiệu quả",
  paragraph = "DMP Shop cung cấp các sản phẩm dược mỹ phẩm cao cấp, kết hợp công nghệ AI phân tích da hiện đại giúp bạn tìm được sản phẩm phù hợp nhất.",
}: HeroProps) {
  return (
    <section className="from relative bg-purple-50 bg-gradient-to-r to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="prose-h1 mb-6 text-4xl font-bold md:text-5xl">
              <span className="block text-gray-800">{title}</span>
              <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">{subtitle}</span>
            </h1>
            <p className="prose-p mb-8 text-lg text-gray-600">{paragraph}</p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/store">
                <Button size="lg" className="px-6">
                  Khám phá sản phẩm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#ai-section">
                <Button variant="outline" size="lg" className="px-6">
                  Phân tích da miễn phí
                </Button>
              </a>{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
