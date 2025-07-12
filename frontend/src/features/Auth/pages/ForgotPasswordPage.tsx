import type { FeatureProps } from "../components/LeftPanel";
import LeftPanel from "../components/LeftPanel";

const ForgotPasswordFeatures: FeatureProps[] = [
  {
    icon: "🔑",
    title: "Bảo mật & Đơn giản",
    description: "Nhập email để nhận liên kết bảo mật đặt lại mật khẩu.",
  },
  {
    icon: "⚡",
    title: "Khôi phục nhanh chóng",
    description: "Quay lại hành trình chăm sóc da chỉ trong vài phút.",
  },
];

export default function ForgotPasswordPage() {
  return (
    <LeftPanel
      title="Quên mật khẩu?"
      subtitle="Đừng lo, chúng tôi sẽ giúp bạn truy cập lại tài khoản."
      features={ForgotPasswordFeatures}
    />
  );
}
