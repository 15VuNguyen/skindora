import { ShoppingCart } from "lucide-react";
import { Bell, User as UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
import { useAuth } from "@/contexts/auth.context";

interface TopbarProps {
  branding?: string;
  navItems?: {
    displayText: string;
    path: string;
  }[];
}

function NavigationItems({ navItems }: { navItems: TopbarProps["navItems"] }) {
  const location = useLocation();
  return (
    <nav className="hidden space-x-8 md:flex">
      {navItems?.map((item, index) => {
        const path = `/${item.path}`;
        const isActive = location.pathname === path;
        return (
          <Link
            key={index}
            to={path}
            className={`prose-a ${isActive ? "text-primary font-semibold" : "text-gray-600 hover:text-gray-700"}`}
          >
            {item.displayText}
          </Link>
        );
      })}
    </nav>
  );
}

interface ProfileDropdownProps {
  logout?: () => void;
  isLoading?: boolean;
}

function ProfileDropdown({ logout, isLoading }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-9 w-9 rounded-full">
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/profile">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isLoading} onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationButton() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
    </Button>
  );
}

function TopbarActions() {
  const { user, actions } = useAuth();
  return (
    <div className="flex items-center space-x-4">
      <Link to="/store">
        <Button variant="ghost" size="icon">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </Link>
      {user ? (
        <div className="flex items-center gap-4">
          <NotificationButton />
          <ProfileDropdown logout={actions.logout} isLoading={actions.isLoggingOut} />
        </div>
      ) : (
        <Link to="/auth/login">
          <Button variant="outline">Đăng nhập</Button>
        </Link>
      )}
    </div>
  );
}

export default function Topbar({ branding, navItems = [] }: TopbarProps = {}): React.JSX.Element {
  return (
    <header className="sticky top-0 z-10 bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" aria-label="Go to homepage">
              <img
                src={logo}
                alt="Skindora - Premium Skincare Products"
                title={branding || "Skindora"}
                loading="eager"
              />
            </Link>
          </div>
          <NavigationItems navItems={navItems} />
          <TopbarActions />
        </div>
      </div>
    </header>
  );
}
