import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@/contexts/auth.context";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { actions } = useAuth();

  useEffect(() => {
    const token = searchParams.get("email_verify_token");
    if (token) {
      actions.verifyEmail(token);
    } else {
      console.error("No email verification token found in URL.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
      <Loader2 className="text-primary h-16 w-16 animate-spin" />
      <p className="text-lg text-gray-600">Đang xác thực email của bạn...</p>
      <p className="text-sm text-gray-400">Vui lòng chờ trong giây lát.</p>
    </div>
  );
};

export default VerifyEmailPage;
