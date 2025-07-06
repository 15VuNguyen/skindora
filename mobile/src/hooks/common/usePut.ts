import { useState } from "react";
import api from "../../api/api";

// Example sử dụng: const { put, loading, error } = usePut('/users/123')

export default function usePut(url: string) {
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const put = async (body: Object) => {
    try {
      setLoading(true);
      const res = await api.put(url, body);
      setData(res.data.data);
      return res.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { put, data, loading, error };
}
