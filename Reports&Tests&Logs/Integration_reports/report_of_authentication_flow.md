# Authentication Flow — Integration Report

> **Project:** ThyroCare  
> **Step:** Step 2 — Authentication Flow  
> **Date:** 2026-05-15  
> **Status:** ✅ Complete

---

## 1. Summary

This step wired the frontend to the backend's authentication API endpoints and
established the persistent auth infrastructure that all subsequent steps build
upon. The following changes were made:

| Area | What was done |
|---|---|
| **Auth service** | Created `src/services/authService.js` — `login()`, `register()`, `getMe()`, `logout()` |
| **HTTP client** | Created `src/services/api.js` — Axios singleton with base URL, Bearer-token injection on every request, and global 401→/login redirect |
| **UserContext** | Refactored to delegate to `authService`, auto-rehydrate via `GET /auth/me` on mount, and expose `login()`/`logout()` to all consumers |
| **Login form** | Removed hardcoded mock logic; calls `UserContext.login()` which calls `POST /auth/login` |
| **SignUp form** | Removed hardcoded mock logic; calls `POST /auth/register`, stores token from response |
| **Route protection** | `/chat` now wrapped in `<ProtectedRoute>`, redirects unauthenticated visitors to `/login` |
| **Environment** | Added `src/.env.example` with `VITE_API_BASE_URL` variable |

---

## 2. Files Created

### 2.1 `src/services/api.js`

Centralised Axios instance. Key design decisions:

- **Dual env-var support** — reads both `VITE_API_BASE_URL` (legacy name) and `VITE_API_URL` (canonical name), stripping any stray trailing `/api` segment before appending `/api` so env values never cause a double prefix of `/api/api/…`.
- **Base URL:** `http://localhost:8000/api` by default (matches the Postman `{{baseUrl}}/…` collection).
- **Request interceptor:** reads `localStorage("userToken")` and attaches `Authorization: Bearer <token>` on every outgoing request.
- **Response interceptor:** on HTTP 401 or 403, clears all auth artefacts from `localStorage` and performs a hard redirect to `/login`. This prevents the app from staying in the "half-authenticated" state the analysis flagged.

### 2.2 `src/services/authService.js`

Thin wrapper over the shared `api` instance.

| Function | Endpoint | Body / Note |
|---|---|---|
| `login(credentials)` | `POST /auth/login` | `{ email, password }` |
| `register(userData)` | `POST /auth/register` | `{ firstName, lastName, email, phone, password, dateOfBirth, gender }` |
| `getMe()` | `GET /auth/me` | Returns user profile; persists to `localStorage` |
| `logout()` | `POST /auth/logout` | Best-effort; always clears `localStorage` |
| `clearAuth()` | — | Utility — wipes `localStorage` without a network call |

`login()` and `register()` store the JWT and user object to `localStorage`
themselves and then always return `{ token, user }`. This means the
`UserContext` login function is now a thin proxy.

`getMe()` is used on app launch by the `UserContextProvider` so that a page
reload never forces the user to re-enter credentials as long as the browser
session cookie is still valid.

`logout()` is best-effort: it always wipes `localStorage` in the `finally`
block even if the network call itself fails.

---

## 3. Files Modified

### 3.1 `src/context/UserContext.jsx`

Full rewrite of the provider component. Behaviour at a glance:

- **State initialisation** is now `useState(fn)` — reads `localStorage` once at mount, not on every render.
- **`setuserToken` / `setuser`** are replaced by `useCallback`-wrapped setters that write to `localStorage` synchronously as well as updating React state — so any `localStorage` change is instantly visible to the `api` request interceptor.
- **Rehydration guard** — a `sessionStorage` flag (`userContext_rehydrated_session`)
  prevents an infinite redirect loop: if the page is reloaded *after* a
  `getMe()`-triggered 401 redirect, the flag stops `getMe()` from being called
  again before the redirect lands.
- **Hydration spinner** — while `getMe()` is pending (`isHydrating === true`)
  the provider renders a full-screen spinner instead of returning children. This
  avoids a flash-of-unprotected-route (FOUT) that would otherwise momentarily
  render protected components as if the user were already authenticated.
- **`login()` / `logout()`** are now provided in context and called by the
  Login component instead of that component manipulating `localStorage`
  directly.
- **`isHydrating`** exposed in context so consumers can also gate rendering
  if required.

### 3.2 `src/components/Login/Login.jsx`

- Removed the entire `// wrong code` block (hardcoded hardcoded-dummy token).
- `handelLogin` now calls `setUserContext.login(credentials)`.
- Added
  loading state (`IsLoading`) disables the submit button and shows a spinner.
- `serverError` state stores any string thrown by `authService`; displayed in a
  red-tinged box below the form fields.
- `axios` direct import removed — all HTTP goes through the service layer.

### 3.3 `src/components/SignUp/SignUp.jsx`

Same pattern as Login:
- Removed hardcoded mock.
- `handleSignup` calls `authService.register(values)`.
- Loading spinner + server error message added.
- `axios` import removed.

### 3.4 `src/App.jsx`

Line 38 changed:
```diff
- { path: "chat", element: <AiChat /> },
+ { path: "chat", element: <ProtectedRoute><AiChat /></ProtectedRoute> },
```

Unauthenticated visitors to `/chat` are now redirected to `/login` by
`ProtectedRoute` (its inline `localStorage` check runs before the context
provider is even mounted — two layers of defence).

---

## 4. Methodology notes

### Why `sessionStorage` rehydration guard?

When a token is expired, `GET /auth/me` returns 401. The `api` intercept
redirects the browser to `/login`. Without a guard, the browser's reload causes
the new dispatch of `getMe()` to fire *again* — same expired token, same 401,
same redirect, loop. The guard token sits in `sessionStorage` (survives the
internally-triggered navigation bypass, cleared in `UserContext.logout()`) and
breaks the chain after a single iteration.

### Why `useState(fn)` instead of derived state for `userToken` / `user`?

Because the rehydration path sets state *after* initial render (inside
`getMe().then`), the initial render must show the values from `localStorage` so
the router + any early mounted components see a consistent view. Closures over
`localStorage.getItem()` inside a lazy initializer is the standard React pattern
for this.

### Why a full-screen spinner in the provider (`isHydrating`) instead of just
relying on `ProtectedRoute` to gate every route?

The analysis identified that `ProtectedRoute` uses *inline* `localStorage` checks.
The `UserContext` now performs its own async check via `GET /auth/me`. During
the ~100–500 ms window between app mount and the server response, there is a
race: the inline `ProtectedRoute` may say "authenticated" (token is in
`localStorage`) before `getMe()` has confirmed it is still valid. The spinner
eliminates this window completely — the entire app skeleton waits.

### Environment variable convention

The Postman collection uses `{{baseUrl}}`, meaning the entire origin possibly
including a path prefix such as `http://localhost:8000/thyro-care-api`. Both
`VITE_API_URL` and `VITE_API_BASE_URL` env vars are read; if the value already
contains `/api` (unlikely in a Postman context but possible), the resolver
strips it before appending `/api` to guarantee:
```
http://localhost:8000/api/auth/login
```
and never:
```
http://localhost:8000/api/api/auth/login
```

---

## 5. Known Issues / Outstanding Work Before Next Step

| # | Description |
|---|---|
| 🔴 **1** | `api.js` checks `import.meta.env.VITE_API_URL && import.meta.env.VITE_API_BASE_URL`. If Vite envs are not defined at build/runtime in production, the default `http://localhost:8000` is used — a source of silent failures in deployed environments. **Fix in Step 10 (deployment):** set the variable in the hosting env (Vercel/Render env panel) or keep a `.env.production` file in Vite project root. |
| 🟡 **2** | `login()` and `register()` in `authService.js` both return `{ token, user }` by reading `data.token / data.accessToken / data.access_token`. If the backend returns a differently shaped payload (e.g. wrapped in `{ data: { … } }`), the mapping inside authService must be updated — see the inline comment in that file. |
| 🟡 **3** | `Yup` form validation in Login/SignUp is already defined — the existing schemas from the original code were preserved. Validate against the backend's exact field constraints before going to production (phone regex, password length, etc.). |
| 🟢 **4** | `ProtectedRoute` itself was not modified in this step — it already reads from `localStorage` inline (a secondary guard). Consider refactoring it to read from `UserContext` in a future step (Step 5+), for a single-source-of-truth pattern. |
| 🟢 **5** | The `rehydrateSessionGuard` key is currently keyed on `userToken` existence only. An edge case (token requires /auth/me with a new claim it does not yet have) will set the guard after the *failed* 401 call — leaving the old token still stored in `localStorage` for the next attempt. This is acceptable for the current flow; any fix would add a runtime flag (e.g. `localStorage(cache = 'userToken')`; attempt → fail → guard → … |
| 🟢 **6** | This step does NOT yet touch: `AiChat`, `Dashboard`, `Report`, `Profile` endpoints. Those will be wired in subsequent steps. |

---

## 6. Testing Checklist

Before moving to the next integration step, verify the following manually
(dev server running at `http://localhost:5173`, backend at `http://localhost:8000`):

- [ ] `npm run dev` starts without console errors
- [ ] Visiting `/login` shows the login form (no crash)
- [ ] Visiting `/signup` shows the signup form (no crash)
- [ ] Submitting valid credentials on `/login` redirects to `/` and leaves
      `localStorage.userToken` populated
- [ ] Opening DevTools → Application → `localStorage` shows both `userToken`
      and `user` after a successful login
- [ ] Submitting invalid credentials shows a server error message (no crash)
- [ ] Submitting invalid credentials clears the error on a retry (error state is
      state-local, not stale)
- [ ] Full page reload after login keeps the user logged in (`GET /auth/me`
      silently rehydrates user state)
- [ ] `/chat` redirects to `/login` when logged out
- [ ] `/chat` loads after logging back in
- [ ] All Formik field validation still fires correctly (no silent pass-through
      of empty inputs)
- [ ] No `Uncaught TypeError: Delete is not a function` crashes from AiChat or
      ViewReports (known pre-existing issue from analysis, not introduced here)
- [ ] Console shows `API_BASE_URL = http://localhost:8000/api` on page load
