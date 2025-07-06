import { useEffect, useState } from "react";
import api from "../../api/api";

// Example sử dụng: const { data, loading, error, refetch } = useFetch('/users')

export default function useFetch(url: string, autoRun = true) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<Boolean>(autoRun);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(url);
      setData(res.data.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRun) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
