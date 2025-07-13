import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth.context";

export default function RootLayout() {
  return (
    // <div className="flex min-h-screen bg-white">
    //   <SidebarProvider>
    //     <AppSidebar />
    //     <div className="flex-1">
    //       <SidebarTrigger className="p-4" />
    //       <Outlet />
    //     </div>
    //   </SidebarProvider>
    // </div>
    <div className="min-h-screen bg-white">
      <AuthProvider>
        <Toaster
          toastOptions={{
            classNames: {
              title: "text-sm font-semibold",
              description: "!text-gray-500 text-sm",
              error: "!border-red-500 !bg-red-200/80 !text-red-700 dark:text-red-400 [&>[data-icon]]:text-red-500",
              success:
                "!border-green-500 !bg-green-200/80 !text-green-700 dark:text-green-400 [&>[data-icon]]:text-green-500",
              info: "!border-blue-500 !bg-blue-200/80 !text-blue-700 dark:text-blue-400 [&>[data-icon]]:text-blue-500",
              warning:
                "!border-yellow-500 !bg-yellow-200/80 !text-yellow-700 dark:text-yellow-400 [&>[data-icon]]:text-yellow-500",

              actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
              cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
              closeButton: "border-border hover:bg-accent hover:text-accent-foreground",
            },
          }}
        />
        <Outlet />
      </AuthProvider>
    </div>
  );
}
