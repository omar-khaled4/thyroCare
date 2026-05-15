import axios from "axios";

/**
 * Axios singleton for all ThyroCare API calls.
 *
 * Reads the base URL from Vite env vars, supporting both VITE_API_URL
 * and VITE_API_BASE_URL. Both are normalised so that the Postman-
 * documented paths (/*/auth/login, /*/reports, etc.) resolve correctly.
 *
 *   VITE_API_URL=http://localhost:8000     →  base = http://localhost:8000
 *   VITE_API_BASE_URL=http://localhost:8000  →  base = http://localhost:8000
 *
 * Any trailing "/api" segment in the env value is stripped to avoid a
 * double "/api/api/…" prefix, then "/api" is appended to match the
 * Postman collection convention.
 */
function resolveBaseURL() {
  // prefer VITE_API_URL (sets origin only), fall back to VITE_API_BASE_URL
  const raw =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    "http://localhost:8000";
  // Strip a trailing /api so we never double-up the prefix
  const origin = String(raw).replace(/\/api\/?$/, "");
  return `${origin}/api`;
}

const API_BASE_URL = resolveBaseURL();

console.log("API_BASE_URL =", API_BASE_URL);

/**
 * Axios instance — used by every service file in src/services/.
 *
 * Request interceptor
 *   Automatically attaches `Authorization: Bearer <token>` from localStorage
 *   on every outgoing call.
 *
 * Response interceptor
 *   On a 401 (or 403→treated as auth-failure) the interceptor clears all auth
 *   artefacts from localStorage and redirects the browser to /login.  This
 *   prevents the app from staying in a "half-authenticated" state.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request ──────────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response ─────────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      console.warn(
        `[api] ${status} — clearing auth state and redirecting to /login`
      );
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
