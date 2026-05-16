import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL && import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_URL.replace(/\/?api\/?$/i, "") + "/api"
      : import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace(/\/?api\/?$/i, "") + "/api"
        : "https://thyro-care.vercel.app/api",  // ← your backend, no trailing slash
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
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    if (status === 401 || status === 403) {
      console.warn(`[api] Session expiration triggered by ${error.config.method.toUpperCase()} ${error.config.url}`);
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    } else if (!error?.config?._toastFired) {
      error.config._toastFired = true;
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;