import { useEffect, useState, useRef } from "react";
import axiosPrivate from "../../utils/axiosPrivate";
import axiosPublic from "../../utils/axiosPublic";

// Example:
// const { data, loading, error, refetch } = useFetch('/users', true, true, { page: 1 })

export default function useFetch(
  url,
  autoRun = true,
  isPublic = true,
  params = null,
  onSuccess = null,
  onError = null
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoRun);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchData = async (customParams = params) => {
    try {
      setLoading(true);
      setError(null);

      const client = isPublic ? axiosPublic : axiosPrivate;

      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      const res = await client.get(url, {
        params: customParams || undefined,
        signal: controllerRef.current.signal,
      });

      const responseData = url.includes("/review")
        ? res.data 
        : res.data?.data ?? res.data?.result ?? res.data;

      setData(responseData);

      if (onSuccess) onSuccess(responseData);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.log(err?.response?.data || err.message || err);
        setError(err);
        if (onError) onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRun) fetchData();

    return () => {
      // Hủy request nếu component bị unmount
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [url, JSON.stringify(params)]);

  return { data, loading, error, refetch: fetchData, setData };
}
