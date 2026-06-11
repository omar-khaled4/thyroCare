import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { login, resendVerification } from "../../services/authService";
import toast from "react-hot-toast";

export default function Login() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: doLogin } = useContext(UserContext);

  async function handleLogin(values) {
    setIsLoading(true);
    setServerError("");

    const toastId = toast.loading("Signing in…", { id: "auth-login" });

    try {
      await doLogin(values);
      toast.success("Welcome back!", { id: toastId });
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err.message ??
        "Login failed. Please check your credentials and try again.";
      setServerError(msg);
      if (err?.response?.status === 403) {
        setShowResendVerification(true);
      }
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendVerification() {
    const toastId = toast.loading("Sending verification email…");
    try {
      await resendVerification(formik.values.email);
      toast.success("Verification email sent!", { id: toastId });
      setShowResendVerification(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err.message ??
        "Failed to send verification email.";
      toast.error(msg, { id: toastId });
    }
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required")
      .matches(/^[a-zA-Z]{3,}/, "Email must start with 3 letters at least"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="background-image w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-4 pt-20 pb-10 md:pt-10">
        {/* Card */}
        <div className="w-full backdrop-blur-[16px] bg-white/10 rounded-2xl border border-white/15 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className="text-white font-1 text-3xl font-semibold">
              Welcome Back
            </h1>
            <p className="text-white/60 font-1 text-sm mt-2">
              Sign in to access your thyroid health dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="px-8 pb-8">
            {/* Email */}
            <div className="mt-5">
              <label
                htmlFor="email"
                className="block text-white/80 font-1 text-sm mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-xl text-white font-5 text-sm outline-none transition-all duration-200 placeholder:text-white/30 focus:border-[#00B3A1] focus:bg-white/12 focus:ring-2 focus:ring-[#00B3A1]/20"
                placeholder="name@gmail.com"
                required
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="text-red-400 font-5 text-xs mt-1.5">
                  {formik.errors.email}
                </p>
              ) : null}
            </div>

            {/* Password */}
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-white/80 font-1 text-sm mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 pr-12 bg-white/8 border border-white/20 rounded-xl text-white font-5 text-sm outline-none transition-all duration-200 placeholder:text-white/30 focus:border-[#00B3A1] focus:bg-white/12 focus:ring-2 focus:ring-[#00B3A1]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00B3A1] transition-colors"
                >
                  <i
                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"
                      } text-sm`}
                  ></i>
                </button>
              </div>
              {formik.errors.password && formik.touched.password ? (
                <p className="text-red-400 font-5 text-xs mt-1.5">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            {/* Forgot Password */}
            <div className="text-right mt-3">
              <Link
                to="/forgot-password"
                className="text-white/50 font-5 text-xs hover:text-[#00B3A1] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mt-4 p-3 bg-red-500/15 border border-red-500/25 rounded-xl">
                <p className="text-red-300 font-5 text-sm">{serverError}</p>
              </div>
            )}

            {/* Resend Verification */}
            {showResendVerification && (
              <button
                type="button"
                onClick={handleResendVerification}
                className="w-full mt-4 py-3 border border-[#00B3A1] text-[#00B3A1] rounded-xl font-1 text-sm hover:bg-[#00B3A1] hover:text-white transition-all duration-200"
              >
                Resend Verification Email
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-white/50 font-5 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#00B3A1] hover:underline font-1"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}