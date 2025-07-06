import { useState } from "react";
import api from "../../api/api";

// Example sử dụng: const { deleteData, loading } = useDelete('/users/123')

export default function useDelete(url: string) {
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const deleteData = async () => {
    try {
      setLoading(true);
      const res = await api.delete(url);
      setData(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, data, loading, error };
}
