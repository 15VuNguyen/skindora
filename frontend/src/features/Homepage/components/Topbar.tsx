import { Heart, Menu, Search, ShoppingCart, User as UserIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import { useCartQuery } from "@/hooks/queries/useCartQuery";
import { useWishlistQuery } from "@/hooks/queries/useWishlistQuery";
import { useDebounce } from "@/hooks/useDebounce";

interface AppHeaderProps {
  branding?: string;
  navItems?: {
    displayText: string;
    path: string;
  }[];
}

function NavigationItems({ navItems }: { navItems: AppHeaderProps["navItems"] }) {
  const location = useLocation();
  return (
    <nav className="hidden items-center space-x-8 md:flex">
      {navItems?.map((item, index) => {
        const path = `/${item.path}`;
        const isActive = location.pathname === path;
        return (
          <Link
            key={index}
            to={path}
            className={`text-sm font-medium transition-colors ${isActive ? "text-primary font-semibold" : "hover:text-primary/80 text-gray-600"}`}
          >
            {item.displayText}
          </Link>
        );
      })}
    </nav>
  );
}

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  useEffect(() => {
    navigate(`/products?q=${debouncedSearchTerm}`);
  }, [debouncedSearchTerm, navigate]);

  useEffect(() => {
    setInputValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/products?q=${inputValue}`);
  };

  return (
    <div className="mx-6 hidden flex-1 justify-center md:flex">
      <form onSubmit={handleSearch} className="relative w-full max-w-lg">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Tìm kiếm sản phẩm, thương hiệu và nhiều hơn nữa..."
          className="pl-10"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
    </div>
  );
}
function HeaderActions() {
  const { user, actions, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: cartAPIResponse } = useCartQuery(isAuthenticated);
  const { data: wishlistData } = useWishlistQuery(isAuthenticated);

  const cartCount = cartAPIResponse?.result.Products.length || 0;
  const wishlistCount = wishlistData?.length || 0;

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      {isAuthenticated && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden md:inline-flex"
            onClick={() => navigate("/profile/wishlist")}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white">
                {cartCount}
              </span>
            )}
          </Button>
        </>
      )}

      {user ? (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-9 w-9 rounded-full">
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to="/profile">
                  <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                </Link>
                <Link to="/profile/wishlist">
                  <DropdownMenuItem>Danh sách yêu thích</DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={actions.isLoggingOut} onClick={actions.logout}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link to="/auth/login" className="hidden md:block">
          <Button variant="outline">Đăng nhập</Button>
        </Link>
      )}
    </div>
  );
}

export default function Topbar({ branding, navItems = [] }: AppHeaderProps = {}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const onProductsPage = location.pathname.startsWith("/products");

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <Link to="/" aria-label="Về trang chủ">
              <img src={logo} alt="Skindora" title={branding || "Skindora"} loading="eager" className="h-8 w-auto" />
            </Link>
          </div>

          {onProductsPage ? <SearchBar /> : <NavigationItems navItems={navItems} />}

          <HeaderActions />
        </div>

        {onProductsPage && (
          <div className="pb-4 md:hidden">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10" />
            </div>
          </div>
        )}
      </div>

      {mobileMenuOpen && !onProductsPage && (
        <div className="border-t border-gray-200 md:hidden">
          <nav className="flex flex-col space-y-1 p-4">
            {navItems?.map((item) => (
              <Link
                key={item.path}
                to={`/${item.path}`}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              >
                {item.displayText}
              </Link>
            ))}
            {!user && (
              <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="mt-2 w-full">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
