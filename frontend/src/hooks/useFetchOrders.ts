import { useCallback, useState } from "react";

import { fetchListOrder } from "@/api/order";
import type { Order } from "@/types/order";

export const useFetchOrder = () => {
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<Order[]>([]);
  //   const [allUser, setAllUser] = useState<Order[]>([]);

  // 2. Cập nhật hàm fetchAllUser với quản lý loading
  //   const fetchAllUser = useCallback(async () => {
  //     setLoading(true); // Bắt đầu loading
  //     try {
  //       const response = await fetchListOrder({ limit: params.limit, page: params.page });
  //       setAllUser(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch all users:", error);
  //       setAllUser([]);
  //     } finally {
  //       setTimeout(() => setLoading(false), 10000);
  //     }
  //   }, []);
  // Tách riêng hàm setParams để an toàn hơn khi gọi từ component
  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const changeLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, page: 1, limit })); // Reset về trang 1 khi thay đổi limit
  }, []);

  // 3. Cập nhật hàm fetchUser với quản lý loading
  const fetchOrder = useCallback(async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await fetchListOrder({ limit: params.limit, page: params.page });
      setData(response.data);
      setParams((prevParams) => ({
        ...prevParams,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData([]); // Xử lý lỗi
    } finally {
      setLoading(false); // Luôn tắt loading khi kết thúc
    }
    // `params` là dependency để khi page thay đổi, hàm này sẽ được tạo lại
  }, [params.page, params.limit]);

  // 4. Xóa các useEffect không cần thiết trong hook
  // Việc gọi fetchUser nên được thực hiện bởi component sử dụng hook này.
  // Điều này giúp hook linh hoạt và dễ kiểm soát hơn.
  // useEffect(() => {
  //   fetchUser();
  // }, []);
  //
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  // 5. Trả về `loading` state
  return {
    loading, // Thêm vào
    fetchOrder,
    data,
    params,
    setParams,
    changePage,
  };
};
