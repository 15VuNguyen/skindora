import type { FeatureProps } from "../components/LeftPanel";
import LeftPanel from "../components/LeftPanel";

export default function RegisterPage() {
  return (
    <>
      <LeftPanel
        title="Skindora"
        subtitle="Chào mừng bạn đến với hành trình chăm sóc da. Đăng ký để tạo tài khoản và khám phá các sản phẩm phù hợp với làn da của bạn."
        features={RegisterFeatures}
      />
    </>
  );
}
const RegisterFeatures: FeatureProps[] = [
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
