import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "./ui/button";

interface TopbarProps {
  branding?: string;
  navItems?: {
    displayText: string;
    path: string;
  }[];
}
export default function Topbar({
  branding,
  navItems = [],
}: TopbarProps = {}): React.JSX.Element {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-10 bg-white shadow">
      <img src=""></img>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-primary prose-h1: text-xl font-bold">
              {branding}
            </h1>
          </div>
          <nav className="hidden space-x-8 md:flex">
            {navItems.map((item, index) => {
              const path = `/${item.path}`;
              const isActive = location.pathname === path;

              return (
                <Link
                  key={index}
                  to={path}
                  className={`p prose-a ${
                    isActive
                      ? "text-primary"
                      : "hover:text-primary text-gray-600"
                  }`}
                >
                  {item.displayText}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/store">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Đăng nhập</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
