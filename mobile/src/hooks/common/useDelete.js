import { useState } from "react";
import axios from "../api/axiosInstance";

// Example sử dụng: const { deleteData, loading } = useDelete('/users/123')

export default function useDelete(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteData = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(url);
      setData(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, data, loading, error };
}
