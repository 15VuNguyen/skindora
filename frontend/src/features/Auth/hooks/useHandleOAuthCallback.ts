import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth.context"; // 1. Import useAuth

export function useHandleOAuthCallback(): { isProcessingOAuth: boolean } {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  
  const { handleOAuthLogin } = useAuth();

  useEffect(() => {
    const params = getOAuthParams(searchParams);

    if (params.accessToken && params.refreshToken) {
      setIsProcessingOAuth(true);
       
      handleOAuthLogin({
        accessToken: params.accessToken,
        refreshToken: params.refreshToken,
        newUserParam: params.newUserParam
      });
      const newSearchParams = new URLSearchParams(searchParams);
      cleanOAuthParams(newSearchParams);
      setSearchParams(newSearchParams, { replace: true });

    }
  }, [searchParams, setSearchParams, handleOAuthLogin]);

  return { isProcessingOAuth };
}

const getOAuthParams = (searchParams: URLSearchParams) => ({
  accessToken: searchParams.get("access_token"),
  refreshToken: searchParams.get("refresh_token"),
  newUserParam: searchParams.get("new_user"),
});

const cleanOAuthParams = (searchParams: URLSearchParams) => {
  searchParams.delete("access_token");
  searchParams.delete("refresh_token");
  searchParams.delete("new_user");
  return searchParams;
};
