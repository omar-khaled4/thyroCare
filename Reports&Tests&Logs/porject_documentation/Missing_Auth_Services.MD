# Missing Auth Services — Step-by-Step Implementation Plan

> **Project**: ThyroCare  
> **Date**: June 2, 2026  
> **Scope**: Backend auth endpoints, Frontend `authService.js` functions, Frontend UI pages & routing

---

## Table of Contents

1. [Gap Analysis Summary](#1-gap-analysis-summary)
2. [Part A — Backend: Email Verification Feature](#2-part-a--backend-email-verification-feature)
3. [Part B — Frontend `authService.js`: Missing & Mismatched Endpoints](#3-part-b--frontend-authservicejs-missing--mismatched-endpoints)
4. [Part C — Frontend UI: Pages That Need to Be Built](#4-part-c--frontend-ui-pages-that-need-to-be-built)
5. [Part D — Routing & App Wiring](#5-part-d--routing--app-wiring)
6. [Part E — Context & State Updates](#6-part-e--context--state-updates)
7. [File Change Checklist](#7-file-change-checklist)

---

## 1. Gap Analysis Summary

### What currently EXISTS in the Backend (`auth.controller.js` + `auth.routes.js`):

| Endpoint                       | Method | Auth? | Status       |
|-------------------------------|--------|-------|--------------|
| `POST /api/auth/register`     | POST   | No    | ✅ Exists    |
| `POST /api/auth/login`        | POST   | No    | ✅ Exists    |
| `GET  /api/auth/me`           | GET    | Yes   | ✅ Exists    |
| `POST /api/auth/forgot-password` | POST | No    | ✅ Exists    |
| `POST /api/auth/reset-password`  | POST | No    | ✅ Exists    |

### What currently EXISTS in the Frontend (`authService.js`):

| Function           | Calls Endpoint            | Status       |
|-------------------|---------------------------|--------------|
| `login()`          | `POST /auth/login`        | ✅ Exists    |
| `register()`       | `POST /auth/register`     | ✅ Exists    |
| `forgotPassword()` | `POST /auth/forgot-password` | ✅ Exists |
| `resetPassword()`  | `POST /auth/reset-password`  | ✅ Exists |
| `getMe()`          | `GET /auth/me`            | ✅ Exists    |
| `logout()`         | `POST /auth/logout`       | ⚠️ **No backend route!** |
| `clearAuth()`      | *(local only)*            | ✅ Exists    |
| `updateProfile()`  | `PUT /auth/update`        | ⚠️ **Wrong endpoint!** Backend is `PUT /api/profile` |

### What is MISSING entirely:

| Feature                   | Backend | authService.js | Frontend UI Page |
|--------------------------|---------|----------------|------------------|
| Email Verification        | ❌       | ❌              | ❌                |
| Forgot Password Page      | —       | ✅              | ❌                |
| Reset Password Page       | —       | ✅              | ❌                |
| Logout backend route      | ❌       | ⚠️ Calls it    | —                |

---

## 2. Part A — Backend: Email Verification Feature

### Overview
After a user registers, they should receive a verification email with a unique token link. Until they verify their email, they should not be able to log in (or should see a warning).

---

### Step A1: Install `nodemailer` dependency

**File**: `BackEndLayer/package.json`

```bash
cd BackEndLayer
npm install nodemailer
```

---

### Step A2: Add email verification fields to the User model

**File**: [`BackEndLayer/src/models/User.js`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/src/models/User.js)

Add these two fields inside the schema definition (after `role`):

```js
isEmailVerified: { type: Boolean, default: false },
emailVerificationToken: { type: String, default: null },
emailVerificationExpires: { type: Date, default: null },
```

---

### Step A3: Create an email utility

**File**: `BackEndLayer/src/utils/sendEmail.js` — **[NEW FILE]**

```js
const nodemailer = require("nodemailer");

/**
 * Sends an email using nodemailer.
 * @param {string} to      — Recipient email
 * @param {string} subject — Email subject
 * @param {string} html    — HTML body
 */
async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,        // e.g. "gmail"
    auth: {
      user: process.env.EMAIL_USER,            // e.g. "thyrocare.app@gmail.com"
      pass: process.env.EMAIL_PASS,            // App Password (not account password)
    },
  });

  await transporter.sendMail({
    from: `"ThyroCare" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;
```

---

### Step A4: Add environment variables for email

**File**: [`BackEndLayer/.env`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/.env)

```env
EMAIL_SERVICE=gmail
EMAIL_USER=thyrocare.app@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Important**: Use a Gmail **App Password** (not your account password). Enable 2FA in your Google account first, then generate an App Password from Google Account → Security → App Passwords.

---

### Step A5: Create email verification controller functions

**File**: [`BackEndLayer/src/controllers/auth.controller.js`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/src/controllers/auth.controller.js)

Add these new imports at the top:

```js
const sendEmail = require("../utils/sendEmail");
```

#### A5.1 — Modify the `register` function

After `User.create(...)`, generate a verification token and send the email **before** responding:

```js
const register = tryCatch(async (req, res) => {
  const { firstName, lastName, email, phone, password, dateOfBirth, gender } = req.body;

  // ... existing validation ...

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await User.create({
    firstName, lastName, email, phone, password, dateOfBirth, gender,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
    isEmailVerified: false,
  });

  // Send verification email
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to: email,
    subject: "ThyroCare — Verify Your Email",
    html: `
      <h2>Welcome to ThyroCare, ${firstName}!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}" style="
        display: inline-block; padding: 12px 24px;
        background-color: #00b3a1; color: white;
        text-decoration: none; border-radius: 8px;
        font-weight: bold;
      ">Verify Email</a>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  respond(res, 201, { user, token }, "Registered successfully. Please check your email to verify your account.");
});
```

#### A5.2 — Add `verifyEmail` controller function

```js
/**
 * GET /api/auth/verify-email?token=xxx
 * Marks the user's email as verified.
 */
const verifyEmail = tryCatch(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return respond(res, 400, null, "Verification token is required");
  }

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    return respond(res, 400, null, "Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  respond(res, 200, null, "Email verified successfully! You can now log in.");
});
```

#### A5.3 — Add `resendVerification` controller function

```js
/**
 * POST /api/auth/resend-verification
 * Body: { email }
 * Resends the verification email.
 */
const resendVerification = tryCatch(async (req, res) => {
  const { email } = req.body;
  if (!email) return respond(res, 400, null, "Email is required");

  const user = await User.findOne({ email });
  if (!user) return respond(res, 404, null, "No user found with that email");

  if (user.isEmailVerified) {
    return respond(res, 400, null, "Email is already verified");
  }

  // Generate new token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = verificationExpires;
  await user.save();

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to: email,
    subject: "ThyroCare — Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}" style="
        display: inline-block; padding: 12px 24px;
        background-color: #00b3a1; color: white;
        text-decoration: none; border-radius: 8px;
        font-weight: bold;
      ">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  respond(res, 200, null, "Verification email resent successfully");
});
```

#### A5.4 — (Optional) Block login for unverified users

In the existing `login` function, add a check **after** password validation:

```js
if (!user.isEmailVerified) {
  return respond(res, 403, null, "Please verify your email before logging in. Check your inbox for the verification link.");
}
```

---

### Step A6: Update the exports

**File**: [`BackEndLayer/src/controllers/auth.controller.js`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/src/controllers/auth.controller.js#L130)

```diff
-module.exports = { register, login, getMe, forgotPassword, resetPassword };
+module.exports = { register, login, getMe, forgotPassword, resetPassword, verifyEmail, resendVerification };
```

---

### Step A7: Add the new routes

**File**: [`BackEndLayer/src/routes/auth.routes.js`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/src/routes/auth.routes.js)

```diff
 const {
   register,
   login,
   getMe,
   forgotPassword,
   resetPassword,
+  verifyEmail,
+  resendVerification,
 } = require("../controllers/auth.controller");

 router.post("/register", register);
 router.post("/login", login);
 router.post("/forgot-password", forgotPassword);
 router.post("/reset-password", resetPassword);
+router.get("/verify-email", verifyEmail);
+router.post("/resend-verification", resendVerification);
 router.get("/me", auth, getMe);
```

---

## 3. Part B — Frontend `authService.js`: Missing & Mismatched Endpoints

**File**: [`FrontEndLayer/final_project/src/services/authService.js`](file:///c:/Omars_final_Project/thyroCare/FrontEndLayer/final_project/src/services/authService.js)

---

### Step B1: Fix `updateProfile()` — Wrong Endpoint

The current code calls `PUT /auth/update` but the backend route is `PUT /api/profile`.

```diff
 export async function updateProfile(values) {
   try {
-    const { data } = await api.put("/auth/update", values);
+    const { data } = await api.put("/profile", values);
     toast.success("Profile updated successfully!");
-    return data;
+    const user = data.data || data;
+    return user;
   } catch (err) {
```

---

### Step B2: Add `verifyEmail()` function

```js
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
```

---

### Step B3: Add `resendVerification()` function

```js
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
```

---

### Step B4: Fix `logout()` — Backend has no `/auth/logout` route

The `logout()` function calls `POST /auth/logout` but there is no such backend route. Two options:

**Option 1 (Recommended)**: Remove the network call entirely since JWT is stateless — just clear local state:

```js
export async function logout() {
  // JWT is stateless — no backend call needed
  clearAuth();
}
```

**Option 2**: Add a backend logout route (if you want server-side token blacklisting in the future). For now, Option 1 is simplest.

---

## 4. Part C — Frontend UI: Pages That Need to Be Built

These `authService.js` functions exist but have **no corresponding UI page/component**:

---

### Step C1: Create `ForgotPassword` component

**File**: `FrontEndLayer/final_project/src/components/ForgotPassword/ForgotPassword.jsx` — **[NEW]**  
**File**: `FrontEndLayer/final_project/src/components/ForgotPassword/ForgotPassword.module.css` — **[NEW]**

**What it does**:
- Shows a form with a single **email** field
- On submit, calls `forgotPassword(email)` from `authService.js`
- Shows success/error message from the server
- Provides a link back to Login

**Key implementation details**:
- Use `useFormik` + `yup` for validation (consistent with Login/SignUp)
- Use the same glassmorphism card styling as the Login page (`backdrop-blur-[10px] bg-white/10 rounded-[50px] border border-white`)
- Email validation: required, valid email format
- On success, show: *"Reset link sent! Check your email."*
- Include a "Back to Login" link

---

### Step C2: Create `ResetPassword` component

**File**: `FrontEndLayer/final_project/src/components/ResetPassword/ResetPassword.jsx` — **[NEW]**  
**File**: `FrontEndLayer/final_project/src/components/ResetPassword/ResetPassword.module.css` — **[NEW]**

**What it does**:
- Reads the `token` from the URL query string (e.g., `/reset-password?token=abc123`)
- Shows a form with **new password** and **confirm password** fields
- On submit, calls `resetPassword(token, newPassword)` from `authService.js`
- On success, redirects to `/login`

**Key implementation details**:
- Use `useSearchParams()` from `react-router-dom` to read the `token` query param
- Validate: password min 6 chars, passwords must match
- If no token in URL, show an error message
- Use the same glassmorphism card styling as Login
- On success, auto-redirect to `/login` after 2 seconds

---

### Step C3: Create `VerifyEmail` component

**File**: `FrontEndLayer/final_project/src/components/VerifyEmail/VerifyEmail.jsx` — **[NEW]**  
**File**: `FrontEndLayer/final_project/src/components/VerifyEmail/VerifyEmail.module.css` — **[NEW]**

**What it does**:
- Reads the `token` from the URL query string (e.g., `/verify-email?token=abc123`)
- Automatically calls `verifyEmail(token)` on mount (via `useEffect`)
- Shows loading spinner → success/error result
- Provides a "Go to Login" button on success
- Provides a "Resend Verification" button on failure (calls `resendVerification(email)`)

**Key implementation details**:
- Three states: `loading`, `success`, `error`
- On mount, call `verifyEmail(token)` from `authService.js`
- On success: show ✅ icon + "Email Verified!" message + "Go to Login" button
- On error: show ❌ icon + error message + email input + "Resend" button
- Use the same glassmorphism card styling as Login

---

## 5. Part D — Routing & App Wiring

### Step D1: Add the new routes to `App.jsx`

**File**: [`FrontEndLayer/final_project/src/App.jsx`](file:///c:/Omars_final_Project/thyroCare/FrontEndLayer/final_project/src/App.jsx)

```diff
 import SignUp from './components/SignUp/SignUp';
+import ForgotPassword from './components/ForgotPassword/ForgotPassword';
+import ResetPassword from './components/ResetPassword/ResetPassword';
+import VerifyEmail from './components/VerifyEmail/VerifyEmail';
 import Report from './components/Report/Report';

 // Inside the router children array:
       { path: "login", element: <Login /> },
       { path: "signup", element: <SignUp /> },
+      { path: "forgot-password", element: <ForgotPassword /> },
+      { path: "reset-password", element: <ResetPassword /> },
+      { path: "verify-email", element: <VerifyEmail /> },
```

---

### Step D2: Add "Forgot Password?" link to the Login page

**File**: [`FrontEndLayer/final_project/src/components/Login/Login.jsx`](file:///c:/Omars_final_Project/thyroCare/FrontEndLayer/final_project/src/components/Login/Login.jsx)

Add a link below the password field and above the submit button:

```jsx
<div className="mt-2 text-right">
  <Link to="/forgot-password" className="text-white font-1 text-sm underline hover:opacity-80">
    Forgot Password?
  </Link>
</div>
```

> **Note**: Import `Link` from `react-router-dom` at the top of the file.

---

### Step D3: Add "Resend Verification" info to the Login page (optional UX improvement)

If login fails with a 403 "verify your email" error, show a "Resend Verification Email" button. In `Login.jsx`'s `handleLogin` catch block:

```js
} catch (err) {
  const msg = err?.response?.data?.message ?? "Login failed.";
  setServerError(msg);
  
  // If the error is about email verification, show resend option
  if (err?.response?.status === 403) {
    setShowResendVerification(true);
  }
}
```

---

## 6. Part E — Context & State Updates

### Step E1: Update `UserContext.jsx` to handle verification state (optional)

**File**: [`FrontEndLayer/final_project/src/context/UserContext.jsx`](file:///c:/Omars_final_Project/thyroCare/FrontEndLayer/final_project/src/context/UserContext.jsx)

If you want to block unverified users from accessing certain features, you can expose `user?.isEmailVerified` from the context. The existing context already passes the full `user` object, so no changes are strictly required — components can check `user?.isEmailVerified` directly.

---

## 7. File Change Checklist

### Backend Layer (6 files)

| # | File | Action | Description |
|---|------|--------|-------------|
| 1 | [`package.json`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/package.json) | MODIFY | Add `nodemailer` dependency |
| 2 | [`.env`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/.env) | MODIFY | Add `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`, `FRONTEND_URL` |
| 3 | [`User.js`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/src/models/User.js) | MODIFY | Add `isEmailVerified`, `emailVerificationToken`, `emailVerificationExpires` fields |
| 4 | `sendEmail.js` | **NEW** | `BackEndLayer/src/utils/sendEmail.js` — Nodemailer utility |
| 5 | [`auth.controller.js`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/src/controllers/auth.controller.js) | MODIFY | Add `sendEmail` import, modify `register`, add `verifyEmail` + `resendVerification`, optionally block unverified login |
| 6 | [`auth.routes.js`](file:///c:/Omars_final_Project/thyroCare/BackEndLayer/src/routes/auth.routes.js) | MODIFY | Add `GET /verify-email` and `POST /resend-verification` routes |

### Frontend Layer — Services (1 file)

| # | File | Action | Description |
|---|------|--------|-------------|
| 7 | [`authService.js`](file:///c:/Omars_final_Project/thyroCare/FrontEndLayer/final_project/src/services/authService.js) | MODIFY | Fix `updateProfile` endpoint, add `verifyEmail()`, add `resendVerification()`, fix `logout()` |

### Frontend Layer — New Components (6 files)

| # | File | Action | Description |
|---|------|--------|-------------|
| 8 | `ForgotPassword.jsx` | **NEW** | `components/ForgotPassword/ForgotPassword.jsx` — Forgot password form |
| 9 | `ForgotPassword.module.css` | **NEW** | `components/ForgotPassword/ForgotPassword.module.css` — Styles |
| 10 | `ResetPassword.jsx` | **NEW** | `components/ResetPassword/ResetPassword.jsx` — Reset password form |
| 11 | `ResetPassword.module.css` | **NEW** | `components/ResetPassword/ResetPassword.module.css` — Styles |
| 12 | `VerifyEmail.jsx` | **NEW** | `components/VerifyEmail/VerifyEmail.jsx` — Email verification page |
| 13 | `VerifyEmail.module.css` | **NEW** | `components/VerifyEmail/VerifyEmail.module.css` — Styles |

### Frontend Layer — Modifications (2 files)

| # | File | Action | Description |
|---|------|--------|-------------|
| 14 | [`App.jsx`](file:///c:/Omars_final_Project/thyroCare/FrontEndLayer/final_project/src/App.jsx) | MODIFY | Import + add routes for `ForgotPassword`, `ResetPassword`, `VerifyEmail` |
| 15 | [`Login.jsx`](file:///c:/Omars_final_Project/thyroCare/FrontEndLayer/final_project/src/components/Login/Login.jsx) | MODIFY | Add "Forgot Password?" link, handle 403 verification error |

---

### 📋 Recommended Implementation Order

```
1.  Backend: npm install nodemailer
2.  Backend: Add .env variables
3.  Backend: Update User.js model
4.  Backend: Create utils/sendEmail.js
5.  Backend: Update auth.controller.js (modify register + add verifyEmail + resendVerification)
6.  Backend: Update auth.routes.js
7.  Backend: TEST with Postman (register → check email → verify-email?token=xxx)
8.  Frontend: Fix authService.js (updateProfile endpoint + logout + add new functions)
9.  Frontend: Create ForgotPassword component
10. Frontend: Create ResetPassword component
11. Frontend: Create VerifyEmail component
12. Frontend: Update App.jsx routes
13. Frontend: Update Login.jsx (Forgot Password link + verification error handling)
14. Full E2E Testing
```

---

> **Total files to touch**: 15 (6 backend + 9 frontend)  
> **New files**: 7 (1 backend utility + 6 frontend component files)  
> **Modified files**: 8
