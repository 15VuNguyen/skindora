import { Bell, UserIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import Typography from "@/components/Typography";
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

interface ProfileDropdownProps {
  logout?: () => void;
  isLoading?: boolean;
}

function NotificationButton() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
    </Button>
  );
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
          <Link to="/admin/profile">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>

          {/* <Link to={"/"}>
            <DropdownMenuItem>Home Page</DropdownMenuItem>
          </Link> */}
          {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isLoading} onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export function TopbarActions() {
  const { logout, isLoading } = useAuth();
  return (
    <div className="flex items-center space-x-4">
      {/* {user ? ( */}
      <div className="flex items-center gap-4">
        <NotificationButton />
        <ProfileDropdown logout={logout} isLoading={isLoading} />
      </div>
      {/* // ) : (
      //   <Link to="/auth/login">
      //     <Button variant="outline">Đăng nhập</Button>
      //   </Link>
      // )} */}
    </div>
  );
}
interface HeaderAdminProps {
  name: string;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({ name }) => {
  return (
    <>
      <div className="top-0 left-0 box-border w-full border-b bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-primary text-2xl font-bold">{name}</Typography>
          </div>
          <div className="flex items-center gap-4">
            <TopbarActions />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderAdmin;
