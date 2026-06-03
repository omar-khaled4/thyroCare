import axios from "axios";
import toast from "react-hot-toast";

const resolvedBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
  ? (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL).replace(/\/?api\/?$/i, "") + "/api"
  : window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://thyro-care-server.vercel.app/api";

console.log(`[api] Resolved API Base URL: ${resolvedBaseURL}`);

const api = axios.create({
  baseURL: resolvedBaseURL,
});

/* ── Endpoints that should NEVER trigger a logout on 401 ── */
const OPTIONAL_ENDPOINTS = [
  "/profile",
  "/predict/history",
  "/symptoms",
  "/lab-results",
];

/* ── Guard: only trigger logout once per page load ── */
let isLoggingOut = false;

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

/* ── Response interceptor: handle errors ── */
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

    const isAuthPage =
      window.location.pathname.includes("/login") ||
      window.location.pathname.includes("/signup") ||
      window.location.pathname.includes("/forgot-password") ||
      window.location.pathname.includes("/reset-password") ||
      window.location.pathname.includes("/verify-email");

    if (status === 401 || status === 403) {
      console.warn("!!! [api] Session expired or unauthorized !!!");

      // Check if this is an optional/non-critical endpoint
      const isOptional = OPTIONAL_ENDPOINTS.some((ep) =>
        config?.url?.includes(ep)
      );

      if (isOptional) {
        // Never logout for optional endpoints — just log and continue
        console.warn(
          `[api] Optional endpoint ${config?.url} returned ${status} — skipping logout`
        );
      } else if (!isAuthPage && !isLoggingOut) {
        // Core auth failure — logout once
        isLoggingOut = true;
        console.warn("[api] Core endpoint returned 401 — logging out");
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else if (!isAuthPage && !error?.config?._toastFired) {
      if (error.config) {
        error.config._toastFired = true;
      }
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;