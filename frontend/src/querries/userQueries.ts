import { authService } from "@/services/authService";

const fetchCurrentUserProfile = async () => {
  const result = await authService.getMe();
  if (result.isOk()) {
    return result.value.data.result;
  }
  throw result.error;
};
export const userQueries = {
  currentUserProfile: {
    queryKey: ["currentUserProfile"],
    queryFn: fetchCurrentUserProfile,
  },
};
