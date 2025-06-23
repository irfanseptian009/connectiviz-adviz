import axios from "axios";
import { getToken } from "./token"; 

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

api.interceptors.request.use((config) => {
  const token = getToken();
  console.log("API interceptor - token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("API interceptor - Authorization header set:", config.headers.Authorization);
  }
  console.log("API interceptor - Full config:", {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    headers: config.headers
  });
  return config;
});

export default api;
