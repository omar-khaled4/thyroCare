import axios from "axios";
import toast from "react-hot-toast";

const resolvedBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
  ? (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL).replace(/\/?api\/?$/i, "") + "/api"
  : window.location.hostname === "localhost" 
    ? "http://localhost:5000/api"
    : "https://thyro-care.vercel.app/api";

console.log(`[api] Resolved API Base URL: ${resolvedBaseURL}`);

const api = axios.create({
  baseURL: resolvedBaseURL,
});

/* ── Request interceptor: auto-attach Bearer token ── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      console.log(`[api] Attaching token to ${config.url}`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(`[api] No token found in localStorage for ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor: fire error toast on failure + handle 401 ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    const status = response ? response.status : null;
    
    console.error(`[api] Error Interceptor: ${status} from ${config?.method?.toUpperCase()} ${config?.url}`);
    
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    if (status === 401 || status === 403) {
      console.warn("!!! [api] Session expired or unauthorized !!!");
      const isAuthPage = window.location.pathname.includes("/login") || window.location.pathname.includes("/signup");
      if (!isAuthPage) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        window.location.href = "/login"; 
      }
    } else if (!error?.config?._toastFired) {
      error.config._toastFired = true;
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;