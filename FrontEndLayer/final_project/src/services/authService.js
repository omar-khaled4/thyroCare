import api from "./api";
import toast from "react-hot-toast";

/**
 * POST /auth/login
 * Returns { token, user } on success.
 */
export async function login(credentials) {
  const toastId = toast.loading("Signing in…", { id: "auth-login" });
  try {
    const { data } = await api.post("/auth/login", credentials);
    console.log("[authService] Login response data:", data);
    
    const token = data.token || data.userToken || data.accessToken || data.access_token || (data.data && (data.data.token || data.data.userToken || data.data.accessToken));
    const user = data.user || data.data?.user || data;

    if (!token) {
      console.warn("[authService] No token found in login response. State will remain unauthenticated.");
    }

    localStorage.setItem("userToken", token || "");
    localStorage.setItem("user", JSON.stringify(user));
    toast.success(`Welcome back, ${user.firstName || "User"}!`, { id: toastId });
    return { token, user };
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
      "Login failed. Please check your credentials and try again.",
      { id: toastId }
    );
    throw err;
  }
}

/**
 * POST /auth/register
 * Returns { token, user } on success.
 */
export async function register(userData) {
  const toastId = toast.loading("Creating your account…", { id: "auth-register" });
  try {
    const { data } = await api.post("/auth/register", userData);
    console.log("[authService] Register response data:", data);

    const token = data.token || data.userToken || data.accessToken || data.access_token || (data.data && (data.data.token || data.data.userToken || data.data.accessToken));
    const user = data.user || data.data?.user || data;

    localStorage.setItem("userToken", token || "");
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Account created successfully!", { id: toastId });
    return { token, user };
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Registration failed. Please try again.",
      { id: toastId }
    );
    throw err;
  }
}

/**
 * GET /auth/me
 * Refreshes the user object from the backend. Persists to localStorage.
 */
export async function getMe() {
  try {
    const { data } = await api.get("/auth/me");
    console.log("[authService] getMe response:", data);
    const user = data?.user ?? data;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err) {
    console.error("[authService] getMe failed:", err.message);
    throw err;
  }
}

/**
 * POST /auth/logout (best-effort)
 */
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (_) {
    // Ignore network errors during logout
  } finally {
    clearAuth();
  }
}

/**
 * Utility: clear all auth artefacts without touching the network
 */
export function clearAuth() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
}

/**
 * PUT /auth/update
 * Updates the logged-in user's profile.
 */
export async function updateProfile(values) {
  try {
    const { data } = await api.put("/auth/update", values);
    toast.success("Profile updated successfully!");
    return data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to update profile. Please try again."
    );
    throw err;
  }
}