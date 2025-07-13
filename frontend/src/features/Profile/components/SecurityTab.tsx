import { toast } from "sonner";

import { useAuth } from "@/contexts/auth.context";

import { ChangePasswordForm, type ChangePasswordFormData } from "./ChangePasswordForm";

export const SecurityTab = () => {
  const { actions } = useAuth();

  const handleSubmit = async (data: ChangePasswordFormData) => {
    try {
      await actions.changePassword(data.oldPassword, data.newPassword, data.confirmPassword);

      toast.success("Đổi mật khẩu thành công!", {
        description: "Bạn sẽ được đăng xuất để đảm bảo bảo mật. Vui lòng đăng nhập lại với mật khẩu mới.",
        duration: 5000,
        onAutoClose: () => actions.logout(),
      });
    } catch (error) {
      let errorMessage = "Đã xảy ra lỗi. Vui lòng kiểm tra mật khẩu hiện tại và thử lại.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error("Đổi mật khẩu thất bại", {
        description: errorMessage,
      });
    }
  };

  return <ChangePasswordForm onSubmit={handleSubmit} isSubmitting={actions.isChangingPassword} />;
};
