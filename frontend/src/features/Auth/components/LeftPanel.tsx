import React from "react";

type MainTitleProps = {
  title: string;
};
type SubTitleProps = {
  subtitle: string;
};
type FeatureProps = {
  icon: string;
  title: string;
  description: string;
};

const LeftPanelHeader: React.FC<MainTitleProps & SubTitleProps> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h1 className="mb-6 text-4xl font-bold">{title}</h1>
    <p className="text-xl">{subtitle}</p>
  </div>
);

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="flex items-center">
    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
      <span className="text-2xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

const FeaturesList: React.FC<{ features: FeatureProps[] }> = ({ features }) => (
  <div className="space-y-6">
    {features.map((feature, idx) => (
      <Feature key={feature.title + idx} {...feature} />
    ))}
  </div>
);

const defaultFeatures: FeatureProps[] = [
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

const LeftPanel: React.FC<MainTitleProps & SubTitleProps & { features?: FeatureProps[] }> = (props) => {
  return (
    <div className="from-primary to-accent hidden items-center justify-center bg-gradient-to-br p-12 lg:flex lg:w-1/2">
      <div className="max-w-lg text-white">
        <LeftPanelHeader
          title={props.title || "Chào mừng đến với ứng dụng chăm sóc da của chúng tôi"}
          subtitle={props.subtitle || "Hành trình chăm sóc da tốt hơn bắt đầu từ đây"}
        />
        <FeaturesList features={props.features || defaultFeatures} />
      </div>
    </div>
  );
};

export default LeftPanel;
export type { MainTitleProps, SubTitleProps, FeatureProps };
