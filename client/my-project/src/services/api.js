import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`Axios Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Clearing session...");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      // Optional: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
