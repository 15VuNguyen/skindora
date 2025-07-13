import type { FeatureProps } from "../components/LeftPanel";
import LeftPanel from "../components/LeftPanel";

export default function LoginPage() {
  return (
    <>
      <LeftPanel
        title="Skindora"
        subtitle="Chào mừng bạn trở lại với hành trình chăm sóc da. Đăng nhập để truy cập tài khoản và khám phá các sản phẩm phù hợp với làn da của bạn."
        features={LoginFeatures}
      />
    </>
  );
}
const LoginFeatures: FeatureProps[] = [
  {
    icon: "✨",
    title: "Chăm sóc da cao cấp",
    description: "Tiếp cận các sản phẩm chăm sóc da chất lượng cao",
  },
  {
    icon: "🔍",
    title: "Phân tích da bằng AI",
    description: "Nhận gợi ý chăm sóc da cá nhân hóa",
  },
];
