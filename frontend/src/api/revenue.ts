import httpClient from "@/lib/axios";

// Thay đổi đường dẫn nàyให้ถูกต้อง

/**
 * @description Định nghĩa cấu trúc dữ liệu cho một điểm dữ liệu doanh thu trong mảng `data`.
 */
export interface IRevenueDataPoint {
  date: string;
  totalOrder: number;
  totalRevenue: number;
}

/**
 * @description Định nghĩa cấu trúc cho object `result` được trả về từ API.
 */
export interface IRevenueResult {
  data: IRevenueDataPoint[];
  totalOrder: number;
  totalRevenue: number;
}

/**
 * @description Định nghĩa cấu trúc cho toàn bộ phản hồi từ API doanh thu.
 */
export interface IRevenueResponse {
  message: string;
  result: IRevenueResult;
}

/**
 * @description Định nghĩa các tham số có thể truyền vào khi gọi API doanh thu.
 * Bạn có thể dùng để lọc doanh thu theo ngày bắt đầu và ngày kết thúc.
 */
export interface FetchRevenueProps {
  startDate?: string; // Ví dụ: '2025-07-01'
  endDate?: string; // Ví dụ: '2025-07-14'
}

/**
 * @description Hàm gọi API để lấy dữ liệu doanh thu đơn hàng đã thành công.
 * @param params - Các tùy chọn để lọc, ví dụ: { startDate, endDate }.
 * @returns Dữ liệu doanh thu từ API.
 */
export const getRevenueData = async (params: FetchRevenueProps) => {
  return await httpClient
    .get<IRevenueResponse>("/admin/manage-orders/revenue", {
      // Axios sẽ tự động chuyển object này thành query params
      // Ví dụ: /admin/manage-orders/revenue?startDate=2025-07-01&endDate=2025-07-14
      params: params,
    })
    .then((res) => res.data); // Trả về toàn bộ object { message, result }
};
