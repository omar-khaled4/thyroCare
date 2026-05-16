import { createContext, useCallback, useEffect, useState } from "react";
import { getMe, login, logout as authLogout, register } from "../services/authService";

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

  /* ── synchronous setters ── */
  const setuserToken = useCallback((t) => {
    console.log("[UserContext] Setting token:", t ? "EXISTS" : "NULL");
    if (t && typeof t === "string") {
      localStorage.setItem("userToken", t);
      _setuserToken(t);
    } else {
      localStorage.removeItem("userToken");
      _setuserToken(null);
    }
  }, []);

  const setuser = useCallback((u) => {
    console.log("[UserContext] Setting user:", u ? u.email || "EXISTS" : "NULL");
    if (u && typeof u === "object") {
      localStorage.setItem("user", JSON.stringify(u));
      _setuser(u);
    } else {
      localStorage.removeItem("user");
      _setuser(null);
    }
  }, []);

  /* ── Rehydrate ── */
  useEffect(() => {
    if (!userToken) {
      console.log("[UserContext] No token found during rehydration.");
      setIsHydrating(false);
      return;
    }

    console.log("[UserContext] Rehydrating session...");
    let cancelled = false;

    getMe()
      .then((me) => {
        if (cancelled) return;
        if (me) {
          console.log("[UserContext] Rehydration successful for:", me.email);
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
  }, [userToken, setuser, setuserToken]);

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