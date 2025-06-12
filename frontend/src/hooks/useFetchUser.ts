import { useCallback, useState } from "react";

// Cập nhật: Thêm useCallback

import { fetchListUser } from "@/api/user";
import type { User } from "@/types/user";

export const useFetchUser = () => {
  // 1. Thêm state loading
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<User[]>([]);
  const [allUser, setAllUser] = useState<User[]>([]);

  // 2. Cập nhật hàm fetchAllUser với quản lý loading
  const fetchAllUser = useCallback(async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await fetchListUser();
      setAllUser(response.data);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setAllUser([]); // Xử lý lỗi, trả về mảng rỗng
    } finally {
      setTimeout(() => setLoading(false), 10000); // Luôn tắt loading khi kết thúc (kể cả khi lỗi)
    }
  }, []); // useCallback với dependency rỗng vì nó không phụ thuộc vào state nào

  // 3. Cập nhật hàm fetchUser với quản lý loading
  const fetchUser = useCallback(async () => {
    setLoading(true); // Bắt đầu loading
    try {
      // Sử dụng page từ params state, nhưng cần truyền vào hàm
      // vì state có thể chưa cập nhật ngay lập tức
      const response = await fetchListUser(params.limit, params.page);
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
    fetchUser,
    data,
    params,
    setParams,
    allUser,
    fetchAllUser,
  };
};
