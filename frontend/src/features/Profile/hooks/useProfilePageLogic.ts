import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast as sonnerToast } from "sonner";

import { useAuth } from "@/contexts/auth.context";
import { useUpdateProfileMutation } from "@/hooks/mutations/useUpdateProfileMutation";
import { type ProfileUpdateFormData, profileUpdateSchema } from "@/schemas/authSchemas";
import { type UpdateMePayload, authService } from "@/services/authService";

export function useProfilePageLogic() {
  const { user, isLoading: isAuthLoadingGlobal } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmittingActions, setIsSubmittingActions] = useState(false);
  const updateProfileMutation = useUpdateProfileMutation();

  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      location: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        username: user.username || "",
        location: user.location || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, form, isEditing]);

  const onSubmitProfileUpdate = useCallback(
    async (data: ProfileUpdateFormData) => {
      if (!user) return;

      const payload: UpdateMePayload = {};
      let hasChanges = false;

      if (data.first_name !== undefined && data.first_name !== (user.firstName || "")) {
        payload.first_name = data.first_name;
        hasChanges = true;
      }
      if (data.last_name !== undefined && data.last_name !== (user.lastName || "")) {
        payload.last_name = data.last_name;
        hasChanges = true;
      }
      if (data.username !== undefined && data.username !== (user.username || "")) {
        payload.username = data.username;
        hasChanges = true;
      }
      if (data.location !== undefined && data.location !== (user.location || "")) {
        payload.location = data.location;
        hasChanges = true;
      }
      if (data.avatar !== undefined && data.avatar !== (user.avatar || "")) {
        payload.avatar = data.avatar;
        hasChanges = true;
      }

      if (!hasChanges) {
        sonnerToast.info("Không có thay đổi", { description: "Không phát hiện thay đổi nào để lưu." });
        setIsEditing(false);
        return;
      }

      updateProfileMutation.mutate(payload, {
        onSuccess: () => {
          sonnerToast.success("Cập nhật hồ sơ thành công", {
            description: "Thông tin cá nhân của bạn đã được cập nhật thành công.",
          });
          setIsEditing(false);
        },
        onError: (error) => {
          sonnerToast.error("Cập nhật thất bại", {
            description: error.message || "Không thể cập nhật hồ sơ.",
          });
        },
      });
    },
    [user, updateProfileMutation]
  );

  const handleVerifyEmail = useCallback(async () => {
    setIsSubmittingActions(true);
    const result = await authService.resendVerificationEmail();
    if (result.isOk()) {
      sonnerToast.success("Đã gửi email xác thực", {
        description: "Vui lòng kiểm tra email để xác thực tài khoản.",
      });
    } else {
      sonnerToast.error("Gửi email thất bại", {
        description: result.error.message || "Không thể gửi email xác thực.",
      });
    }
    setIsSubmittingActions(false);
  }, [setIsSubmittingActions]);

  const handleCancelEdit = useCallback(() => {
    if (user) {
      form.reset({
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        username: user.username || "",
        location: user.location || "",
        avatar: user.avatar || "",
      });
    }
    setIsEditing(false);
  }, [user, form, setIsEditing]);
  const toggleEditMode = useCallback(() => {
    if (isEditing) {
      handleCancelEdit();
    } else {
      setIsEditing(true);
    }
  }, [isEditing, handleCancelEdit, setIsEditing]);

  const displayName = user ? user.fullName || user.username || user.email : "";
  const isUserVerified = user ? user.isVerified : false;
  const memberSinceDate = user ? user.createdAt : null;
  const avatarFallbackChar = user
    ? (user.firstName?.charAt(0) || user.username?.charAt(0) || user.email.charAt(0) || "U").toUpperCase()
    : "U";
  const watchedAvatar = form.watch("avatar");

  return {
    user,
    isAuthLoadingGlobal,
    isEditing,
    setIsEditing,
    isSubmittingActions,
    form,
    onSubmitProfileUpdate,
    handleVerifyEmail,
    handleCancelEdit,
    displayName,
    isUserVerified,
    memberSinceDate,
    avatarFallbackChar,
    watchedAvatar,
    toggleEditMode,
    isFormDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
  };
}
