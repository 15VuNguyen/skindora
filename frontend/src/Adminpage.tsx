import AppSidebar from "@/components/Sidebar";
import Typography from "@/components/Typography";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppTable from "@/features/Admin/components/Table";

const ManageCustomer = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <SidebarTrigger className="p-4" />
          <div className="p mx-auto bg-white px-8 py-15">
            <Typography className="text-3xl font-bold">Quản lý khách hàng</Typography>
            <div>
              <AppTable />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ManageCustomer;
