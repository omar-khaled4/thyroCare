import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { getMe, login, logout as authLogout, register } from "../services/authService";
import api from "../services/api";

export let UserContext = createContext();

export default function UserContextProvider(props) {
  const [userToken, _setuserToken] = useState(() => {
    const t = localStorage.getItem("userToken");
    return (t === "null" || !t) ? null : t;
  });
  const [user, _setuser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "null") return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  });
  const [isHydrating, setIsHydrating] = useState(true);

  // ── Sync userToken state with localStorage
  const setuserToken = useCallback((t) => {
    if (t === "null" || t === undefined) t = null;
    console.log("[UserContext] setuserToken called with:", t ? "Valid Token" : "NULL");

    if (t && typeof t === "string") {
      localStorage.setItem("userToken", t);
      _setuserToken(t);
    } else {
      console.warn("[UserContext] Clearing token from storage");
      localStorage.removeItem("userToken");
      _setuserToken(null);
    }
  }, []);

  // ── Sync user state with localStorage
  const setuser = useCallback((u) => {
    if (u === "null" || u === undefined) u = null;

    if (u && u.success !== undefined && u.data) {
      console.log("[UserContext] setuser detected envelope, extracting inner data...");
      u = u.data;
    }

    console.log("[UserContext] setuser called for:", u?.email || (u ? "Unknown User" : "NULL"));

    if (u && typeof u === "object") {
      localStorage.setItem("user", JSON.stringify(u));
      _setuser(u);
    } else {
      console.warn("[UserContext] Clearing user from storage");
      localStorage.removeItem("user");
      _setuser(null);
    }
  }, []);

  // ── Rehydrate user state ONCE on mount only
  // Do NOT add userToken to deps — that causes an infinite loop where
  // a failed getMe() clears the token, which re-triggers getMe(), which fails again.
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const token = localStorage.getItem("userToken");
    if (!token || token === "null") {
      console.log("[UserContext] No token to rehydrate.");
      setIsHydrating(false);
      return;
    }

    console.log("[UserContext] Rehydrating session...");

    getMe()
      .then((me) => {
        if (me) {
          setuser(me);
        }
      })
      .catch((err) => {
        console.error("[UserContext] Rehydration failed:", err.message);
        // Only clear token on 401 — not on network errors or other failures
        if (err?.response?.status === 401) {
          console.warn("[UserContext] Token is invalid — clearing session");
          setuserToken(null);
          setuser(null);
        }
      })
      .finally(() => {
        setIsHydrating(false);
      });
  }, []); // ← empty array: runs ONCE on mount only

  /* ── Handlers ── */
  const handleLogin = useCallback(
    async (credentials) => {
      console.log("[UserContext] Attempting login...");
      const { token, user } = await login(credentials);
      console.log("[UserContext] Login successful. Updating state...");
      setuserToken(token);
      setuser(user);
      return { token, user };
    },
    [setuser, setuserToken]
  );

  const handleRegister = useCallback(
    async (userData) => {
      console.log("[UserContext] Attempting registration...");
      const { token, user } = await register(userData);
      console.log("[UserContext] Registration successful. Updating state...");
      setuserToken(token);
      setuser(user);
      return { token, user };
    },
    [setuser, setuserToken]
  );

  const handleLogout = useCallback(async () => {
    try {
      await authLogout();
    } catch (_) {
    } finally {
      setuser(null);
      setuserToken(null);
    }
  }, [setuser, setuserToken]);

  if (isHydrating) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-5xl color-1" />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        userToken,
        setuserToken,
        user,
        setuser,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isHydrating,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}