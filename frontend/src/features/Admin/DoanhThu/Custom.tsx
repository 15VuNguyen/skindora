import type { TooltipProps } from "recharts";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
export const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const formattedDate = new Date(label as string).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const value = payload[0].value;

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <p style={{ margin: 0, color: "#000", fontWeight: "" }}>{formattedDate}</p>
      <p style={{ margin: 0, color: "#000" }}>
        Doanh thu: <span className="text-blue-500">{formatCurrency(value as number)}</span>
      </p>
    </div>
  );
};
