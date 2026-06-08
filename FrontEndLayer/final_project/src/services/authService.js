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
    

    const token = data.token || data.userToken || data.accessToken || data.access_token || (data.data && (data.data.token || data.data.userToken || data.data.accessToken));
    const user = data.user || data.data?.user || data;

    if (!token) {
      
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
    

    const user = data.user || data.data?.user || data;

    toast.success("Account created successfully!", { id: toastId });
    return { user };
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Registration failed. Please try again.",
      { id: toastId }
    );
    throw err;
  }
}

/**
 * POST /auth/forgot-password
 * Sends a password reset email to the user.
 */
export async function forgotPassword(email) {
  const toastId = toast.loading("Sending reset link…", { id: "auth-forgot" });
  try {
    const { data } = await api.post("/auth/forgot-password", { email });
    toast.success(
      data?.message || "Reset link sent! Please check your email.",
      { id: toastId }
    );
    return data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to send reset link. Please try again.",
      { id: toastId }
    );
    throw err;
  }
}

/**
 * POST /auth/reset-password
 * Resets the user's password using the token from the email.
 */
export async function resetPassword(token, newPassword) {
  const toastId = toast.loading("Resetting password…", { id: "auth-reset" });
  try {
    const { data } = await api.post("/auth/reset-password", { token, newPassword });
    toast.success(
      data?.message || "Password reset successfully! You can now log in.",
      { id: toastId }
    );
    return data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to reset password. The link may have expired.",
      { id: toastId }
    );
    throw err;
  }
}

/**
 * GET /auth/verify-email?token=xxx
 * Verifies the user's email address.
 */
export async function verifyEmail(token) {
  const toastId = toast.loading("Verifying your email…", { id: "auth-verify" });
  try {
    const { data } = await api.get(`/auth/verify-email?token=${token}`);
    toast.success(
      data?.message || "Email verified successfully!",
      { id: toastId }
    );
    return data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Email verification failed. The link may have expired.",
      { id: toastId }
    );
    throw err;
  }
}

/**
 * POST /auth/resend-verification
 * Resends the verification email.
 */
export async function resendVerification(email) {
  const toastId = toast.loading("Resending verification email…", { id: "auth-resend" });
  try {
    const { data } = await api.post("/auth/resend-verification", { email });
    toast.success(
      data?.message || "Verification email sent! Check your inbox.",
      { id: toastId }
    );
    return data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to resend verification email.",
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
    
    // Backend returns { success: true, data: user, message: "" }
    const user = data.data || data;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err) {
    
    throw err;
  }
}

/**
 * POST /auth/logout (best-effort)
 */
export async function logout() {
  // JWT is stateless — no backend call needed
  clearAuth();
}


/**
 * Utility: clear all auth artefacts without touching the network
 */
export function clearAuth() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
}

/**
 * PUT /profile
 * Updates the logged-in user's profile.
 */
export async function updateProfile(values) {
  try {
    const { data } = await api.put("/profile", values);
    toast.success("Profile updated successfully!");
    const user = data.data || data;
    return user;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to update profile. Please try again."
    );
    throw err;
  }
}