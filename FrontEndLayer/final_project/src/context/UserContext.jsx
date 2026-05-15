import { createContext, useCallback, useEffect, useState } from "react";
import { getMe, login, logout as authLogout } from "../services/authService";

export let UserContext = createContext();

/**
 * Key used for the per-user "was auto-rehydrated this session?" guard.
 * Prevents an infinite redirect loop when the app boots an expired-but-still-
 * hydrated session: getMe() returns 401 → interceptor redirects → notreloaded
 * again because the flag is already in localStorage.
 */
const REHYDRATE_GUARD_KEY = "userContext_rehydrated_session";

export default function UserContextProvider(props) {
  const [userToken, _setuserToken] = useState(() =>
    localStorage.getItem("userToken")
  );
  const [user, _setuser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isHydrating, setIsHydrating] = useState(true);

  /* ── synchronous setters (used by login/logout in this provider) ── */
  const setuserToken = useCallback((t) => {
    if (t) localStorage.setItem("userToken", t);
    else localStorage.removeItem("userToken");
    _setuserToken(t);
  }, []);

  const setuser = useCallback((u) => {
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
    _setuser(u);
  }, []);

  /* ── Rehydrate on mount by calling GET /auth/me ──
   *
   * Approach: call `getMe()` and *always* update state from its result so the
   * rest of the app gets consistent data.
   *
   * ─── Scenarios ───────────────────────────────────────────────────────────
   * no token  ─►  getMe() call is aborted by CORS/network, nothing to do
   * valid     ─►  setuser(result)
   * expired    ─►  api interceptor redirects to /login (we stay here)
   *              manager, the auto-rehydrate guard token...
   */
  useEffect(() => {
    // If we already successfully rehydrated in THIS session, skip.
    if (sessionStorage.getItem(REHYDRATE_GUARD_KEY)) {
      setIsHydrating(false);
      return;
    }

    if (!userToken) {
      setIsHydrating(false);
      return;
    }

    let cancelled = false;

    getMe()
      .then((me) => {
        if (cancelled) return;
        if (me) {
          _setuser(me);
          localStorage.setItem("user", JSON.stringify(me));
        }
      })
      .catch((err) => {
        /* 401 / auth-failure → the interceptor redirects to /login.
         * Mark the guard so we don't loop on reload after the redirection. */
        if (err?.response?.status === 401) {
          sessionStorage.setItem(REHYDRATE_GUARD_KEY, "1");
        }
      })
      .finally(() => {
        if (!cancelled) setIsHydrating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userToken]);

  /* ── Context helpers ── */
  const handleLogin = useCallback(
    async (credentials) => {
      const result = await login(credentials);
      sessionStorage.setItem(REHYDRATE_GUARD_KEY, "1");
      return result;
    },
    []
  );

  const handleLogout = useCallback(async () => {
    try {
      await authLogout();
    } catch (_) {
      /* logout is always best-effort */
    } finally {
      sessionStorage.removeItem(REHYDRATE_GUARD_KEY);
      setuser(null);
      setuserToken(null);
    }
  }, []);

  if (isHydrating) {
    // Minimal loader so the router doesn't flash unguarded content while
    // /auth/me resolves.
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
        logout: handleLogout,
        isHydrating,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}