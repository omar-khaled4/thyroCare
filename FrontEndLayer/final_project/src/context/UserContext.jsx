import { createContext, useCallback, useEffect, useState } from "react";
import { getMe, login, logout as authLogout, register } from "../services/authService";
import api from "../services/api";

export let UserContext = createContext();

/**
 * Key used for the per-user "was auto-rehydrated this session?" guard.
 * Prevents an infinite redirect loop when the app boots an expired-but-still-
 * hydrated session: getMe() returns 401 → interceptor redirects → notreloaded
 * again because the flag is already in localStorage.
 */


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
    
    // Safety check: Don't set user if it's the whole response envelope instead of the user object
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

  // ── Rehydrate user state on mount
  useEffect(() => {
    if (!userToken) {
      console.log("[UserContext] No token to rehydrate.");
      setIsHydrating(false);
      return;
    }

    let cancelled = false;
    console.log("[UserContext] Rehydrating session...");
    
    getMe()
      .then((me) => {
        if (cancelled) return;
        if (me) {
          setuser(me);
        }
      })
      .catch((err) => {
        console.error("[UserContext] Rehydration failed:", err.message);
        if (err?.response?.status === 401) {
          setuserToken(null);
          setuser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsHydrating(false);
      });

    return () => { cancelled = true; };
  }, [userToken, setuser]);

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