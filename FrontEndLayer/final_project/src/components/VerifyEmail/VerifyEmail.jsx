import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerification } from "../../services/authService";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error | resend
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("resend");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
          "Verification failed. The link may have expired."
        );
      });
  }, [searchParams]);

  async function handleResend(e) {
    e.preventDefault();
    if (!email) return;

    setResendLoading(true);
    try {
      await resendVerification(email);
      setMessage("Verification email sent! Check your inbox.");
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Failed to resend. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  }

  // Shared input classes
  const inputClass =
    "flex-1 px-4 py-3 bg-white/8 border border-white/20 rounded-xl text-white font-5 text-sm outline-none transition-all duration-200 placeholder:text-white/30 focus:border-[#00B3A1] focus:bg-white/12 focus:ring-2 focus:ring-[#00B3A1]/20";

  return (
    <div className="background-image w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-4 pt-20 pb-10 md:pt-10">
        <div className="w-full backdrop-blur-[16px] bg-white/10 rounded-2xl border border-white/15 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className="text-white font-1 text-3xl font-semibold">
              Verify Your Email
            </h1>
            <p className="text-white/60 font-5 text-sm mt-2">
              {status === "loading" && "One moment..."}
              {status === "success" && "You're all set!"}
              {status === "error" && "Something went wrong"}
              {status === "resend" && "Check your inbox"}
            </p>
          </div>

          <div className="px-8 pb-8 text-center">
            {/* ── Loading ── */}
            {status === "loading" && (
              <div className="py-8">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#00B3A1]/15 flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin text-[#00B3A1] text-2xl"></i>
                </div>
                <p className="text-white/70 font-5 text-sm">
                  Verifying your email...
                </p>
              </div>
            )}

            {/* ── Success ── */}
            {status === "success" && (
              <div className="py-4">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-500/15 flex items-center justify-center">
                  <i className="fas fa-circle-check text-green-400 text-2xl"></i>
                </div>
                <p className="text-green-300 font-1 text-lg font-semibold mb-2">
                  {message}
                </p>
                <p className="text-white/60 font-5 text-sm mb-6">
                  You can now log in to your account.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20 cursor-pointer"
                >
                  Go to Login
                </button>
              </div>
            )}

            {/* ── Error / Expired ── */}
            {status === "error" && (
              <div className="py-4">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/15 flex items-center justify-center">
                  <i className="fas fa-clock-rotate-left text-red-400 text-2xl"></i>
                </div>
                <p className="text-red-300 font-1 text-lg font-semibold mb-2">
                  Link Expired
                </p>
                <p className="text-white/60 font-5 text-sm mb-6">
                  {message}
                </p>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-white/50 font-5 text-xs mb-3">
                    Enter your email to get a new verification link:
                  </p>
                  <form
                    onSubmit={handleResend}
                    className="flex gap-2 items-start"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className={inputClass}
                      required
                    />
                    <button
                      type="submit"
                      disabled={resendLoading}
                      className="px-5 py-3 bg-[#00B3A1] text-white font-1 text-sm rounded-xl hover:bg-[#009e8e] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {resendLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        "Resend"
                      )}
                    </button>
                  </form>
                </div>

                <div className="border-t border-white/10 pt-4 mt-6">
                  <Link
                    to="/login"
                    className="text-white/50 font-5 text-sm hover:text-[#00B3A1] transition-colors"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            )}

            {/* ── Resend form (no token in URL) ── */}
            {status === "resend" && (
              <div className="py-4">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#00B3A1]/15 flex items-center justify-center">
                  <i className="fas fa-envelope-open-text text-[#00B3A1] text-2xl"></i>
                </div>
                <p className="text-white/80 font-1 text-lg font-semibold mb-2">
                  Check your inbox
                </p>
                <p className="text-white/60 font-5 text-sm mb-6">
                  We sent a verification link to your email. Click it to activate
                  your account. If you didn't receive it, resend below.
                </p>

                <form
                  onSubmit={handleResend}
                  className="flex gap-2 items-start mb-5"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className={inputClass}
                    required
                  />
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="px-5 py-3 bg-[#00B3A1] text-white font-1 text-sm rounded-xl hover:bg-[#009e8e] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {resendLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "Resend"
                    )}
                  </button>
                </form>

                {message && (
                  <p className="text-green-300 font-5 text-xs mb-4">
                    {message}
                  </p>
                )}

                <div className="border-t border-white/10 pt-4">
                  <Link
                    to="/login"
                    className="text-white/50 font-5 text-sm hover:text-[#00B3A1] transition-colors"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}