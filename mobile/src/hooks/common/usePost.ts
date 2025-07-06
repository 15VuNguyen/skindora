import { useState } from "react";
import api from "../../api/api";

// Example sử dụng: const { post, loading, error } = usePost('/login')

export default function usePost(url: string) {
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const post = async (body: Object) => {
    try {
      setLoading(true);
      const res = await api.post(url, body);
      setData(res.data.data);
      return res.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { post, data, loading, error };
}
