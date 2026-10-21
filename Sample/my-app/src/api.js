import axios from "axios";

import { getToken } from "./auth";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
export const BACKEND_ROOT_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiError(error, fallback = "Something went wrong.") {
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error?.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }
  if (error?.message === "Network Error" || !error?.response) {
    return "Backend is not reachable. Make sure FastAPI is running.";
  }
  return fallback;
}

export default api;
