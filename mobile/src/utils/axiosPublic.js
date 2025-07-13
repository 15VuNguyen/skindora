import axios from "axios";

const publicAxios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export default publicAxios;
