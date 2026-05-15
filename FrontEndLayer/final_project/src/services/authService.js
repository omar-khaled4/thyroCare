/**
 * authService.js *
 * Auth-related API calls, all routed through the shared `api` Axios instance. *
 * Endpoints (Postman collection — ThyroCare.postman_collection.json →
 *   Authentication folder):
 *   POST  /auth/login        { email, password }  →  { token, user }
 *   POST  /auth/register     { firstName, lastName, email, phone, password,
 *                              dateOfBirth, gender }  →  { token, user }
 *   GET   /auth/me           (Bearer)            →  { user }
 *   POST  /auth/logout       (Bearer)            →  { success }
 *   PUT   /auth/update       (Bearer)            →  { user }
 *
 * Every function in this file handles localStorage persistence and throws a
 * plain Error on failure so callers (components / UserContext) can display a
 * friendly message.
 */

import api from "./api";

/* ────────────────────────────────────────────────────────────────────────────
 * Internal helpers
 * ──────────────────────────────────────────────────────────────────────────── */

/** Persist token + user object to localStorage */
function persistAuth(token, userData) {
  localStorage.setItem("userToken", token);
  localStorage.setItem("user", JSON.stringify(userData));
}

/** Blindly wipe all auth artefacts from localStorage */
function clearAuth() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
}

/* ────────────────────────────────────────────────────────────────────────────
 * Public API
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * POST /auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {{ token: string, user: object }}
 */
export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);

  // ── Adapt to backend response shape ──
  // The Postman collection documents the response as { token, user }.
  // If your backend uses different field names, map them here:
  //   { accessToken, data } → { token: data.accessToken, user: data.data }
  const token = data.token ?? data.accessToken ?? data.access_token;
  const userData = data.user ?? data.data ?? data;

  if (!token) {
    throw new Error("No authentication token returned by the server.");
  }

  persistAuth(token, userData);
  return { token, user: userData };
}

/**
 * POST /auth/register
 * @param {{
 *   firstName:   string,
 *   lastName:    string,
 *   email:       string,
 *   phone:       string,
 *   password:    string,
 *   dateOfBirth: string,   // "YYYY-MM-DD"
 *   gender:      "male" | "female"
 * }} userData
 * @returns {{ token: string, user: object }}
 */
export async function register(userData) {
  const { data } = await api.post("/auth/register", userData);

  const token = data.token ?? data.accessToken ?? data.access_token;
  const userReturned = data.user ?? data.data ?? data;

  if (!token) {
    throw new Error("No authentication token returned by the server.");
  }

  persistAuth(token, userReturned);
  return { token, user: userReturned };
}

/**
 * GET /auth/me
 * Fetches the currently-logged-in user's profile so the UserContext can
 * rehydrate after a full page reload without requiring the user to log in again.
 *
 * @returns {Promise<object|null>}  user profile object, or null if not authenticated
 */
export async function getMe() {
  // The 401→redirect interceptor in api.js guarantees we never end up here
  // when there is no valid token; if the token is expired the redirect fires
  // before this function's promise settles.
  const { data } = await api.get("/auth/me");

  // Accept either { user: { … } } or the user object directly
  const user = data.user ?? data;
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  return Object(user) || null;
}

/**
 * PUT /auth/update
 * Updates the currently-logged-in user's profile.
 *
 * @param {Object} userData - The user data to update
 * @returns {Promise<Object>}  updated user profile object
 */
export async function updateProfile(userData) {
  const { data } = await api.put("/auth/update", userData);
  
  // Accept either { user: { … } } or the user object directly
  const updatedUser = data.user ?? data;
  if (updatedUser) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  return updatedUser;
}

/**
 * POST /auth/logout
 * Best-effort — the JWT is stateless so the backend may not need to do anything,
 * but we always clear localStorage regardless of what the server returns.
 *
 * @returns {Promise<{ success: boolean }>}
 */
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    // Network / CORS errors during logout are non-fatal
    console.warn("[authService.logout] request failed:", err.message);
  } finally {
    clearAuth();
  }
}

/** Re-export clearAuth so callers can wipe state without a network round-trip. */
export { clearAuth };