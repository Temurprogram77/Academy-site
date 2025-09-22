import axios from "axios";

const api = axios.create({
  baseURL: "http://167.86.121.42:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
