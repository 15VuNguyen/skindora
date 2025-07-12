import type { FeatureProps } from "../components/LeftPanel";
import LeftPanel from "../components/LeftPanel";

const ResetPasswordFeatures: FeatureProps[] = [
  {
    icon: "🔒",
    title: "Đặt lại bảo mật",
    description: "Mật khẩu của bạn sẽ được mã hóa và bảo mật.",
  },
  {
    icon: "✨",
    title: "Truy cập ngay lập tức",
    description: "Quay lại hành trình chăm sóc da ngay lập tức.",
  },
];

export default function ResetPasswordPage() {
  return (
    <LeftPanel
      title="Đặt lại mật khẩu"
      subtitle="Tạo mật khẩu mới bảo mật cho tài khoản Skindora để tiếp tục hành trình chăm sóc da của bạn."
      features={ResetPasswordFeatures}
    />
  );
}
