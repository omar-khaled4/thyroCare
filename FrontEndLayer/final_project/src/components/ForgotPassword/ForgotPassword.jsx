import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  async function handleForgotPassword(values) {
    setIsLoading(true);
    setServerError("");
    setIsSuccess(false);

    try {
      await forgotPassword(values.email);
      setSentEmail(values.email);
      setIsSuccess(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err.message ??
        "Failed to request password reset. Please try again.";
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: handleForgotPassword,
  });

  return (
    <div className="background-image w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-4 pt-20 pb-10 md:pt-10">
        <div className="w-full backdrop-blur-[16px] bg-white/10 rounded-2xl border border-white/15 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className="text-white font-1 text-3xl font-semibold">
              Forgot Password?
            </h1>
            <p className="text-white/60 font-5 text-sm mt-2">
              {isSuccess
                ? "Check your inbox for the reset link"
                : "No worries, we'll send you a reset link"}
            </p>
          </div>

          {isSuccess ? (
            /* ── Success State ── */
            <div className="px-8 pb-8 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-500/15 flex items-center justify-center">
                <i className="fas fa-envelope-circle-check text-green-400 text-2xl"></i>
              </div>
              <p className="text-green-300 font-1 text-lg font-semibold mb-2">
                Reset link sent!
              </p>
              <p className="text-white/60 font-5 text-sm mb-3">
                We sent a password reset link to:
              </p>
              <p className="text-white font-5 text-sm font-semibold bg-white/8 py-2 px-4 rounded-lg mb-5">
                {sentEmail}
              </p>
              <p className="text-white/40 font-5 text-xs mb-6">
                Check your inbox and spam folder. The link expires in 1 hour.
              </p>
              <Link
                to="/login"
                className="block w-full py-3 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 text-center"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form State ── */
            <form onSubmit={formik.handleSubmit} className="px-8 pb-8">
              <div className="mt-4">
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

              {serverError && (
                <div className="mt-4 p-3 bg-red-500/15 border border-red-500/25 rounded-xl">
                  <p className="text-red-300 font-5 text-sm">{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <p className="text-center mt-6 text-white/50 font-5 text-sm">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-[#00B3A1] hover:underline font-1"
                >
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}