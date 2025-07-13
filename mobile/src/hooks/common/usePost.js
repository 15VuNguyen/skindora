import { useState } from "react";
import axiosPrivate from "../../utils/axiosPrivate";

export default function usePost(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const post = async (body, customHeaders = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosPrivate.post(url, body, {
        headers: customHeaders,
      });
      setData(res.data.data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { post, data, loading, error };
}
