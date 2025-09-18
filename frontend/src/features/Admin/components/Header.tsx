import { Bell, UserIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth.context";

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
          <Link to="/admin/profile">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link to={"/"}>
            <DropdownMenuItem>Home Page</DropdownMenuItem>
          </Link>
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
  const { actions } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      {/* {user ? ( */}
      <div className="flex items-center gap-4">
        <ProfileDropdown logout={actions.logout} isLoading={actions.isLoggingOut} />
      </div>
    </div>
  );
}
interface HeaderAdminProps {
  name: string;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = () => {
  return (
    <>
      <div className="top-0 left-0 box-border w-full border-b bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div>
              <SidebarTrigger />
            </div>
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
