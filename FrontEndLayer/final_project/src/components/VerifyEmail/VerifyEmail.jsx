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

  // Auto-verify when token is in the URL
  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      // No token — show the resend form
      setStatus("resend");
      return;
    }

    // Token found — attempt verification
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

  // Resend verification email
  async function handleResend(e) {
    e.preventDefault();
    if (!email) return;

    setResendLoading(true);
    try {
      await resendVerification(email);
      setStatus("error"); // keep on same page
      setMessage("Verification email sent! Check your inbox.");
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Failed to resend. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <>
      <div className="background-image w-full min-h-screen">
        <div className="pt-35 mx-10 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5 fixed w-90">
            <p className="text-white font-1 text-5xl hidden md:flex leading-15">
              When your body speaks, Listening is the first step toward healing
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <div className="w-full backdrop-blur-[10px] bg-white/10 rounded-[50px] border border-white mb-4">
              <p className="text-white font-1 text-center text-2xl py-3 border-b-2 mx-5">
                Verify Your Email
              </p>

              <div className="m-5 text-white font-1 text-center">
                {/* ── Loading ── */}
                {status === "loading" && (
                  <div className="py-10">
                    <i className="fas fa-spinner fa-spin text-4xl text-white mb-4"></i>
                    <p className="text-lg">Verifying your email...</p>
                  </div>
                )}

                {/* ── Success ── */}
                {status === "success" && (
                  <div className="py-10">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="text-lg text-green-300 font-bold mb-2">
                      {message}
                    </p>
                    <p className="text-sm opacity-90 mb-6">
                      You can now log in to your account.
                    </p>
                    <button
                      onClick={() => navigate("/login")}
                      className="bg-white text-black font-semibold font-1 py-2 px-8 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer"
                    >
                      Go to Login
                    </button>
                  </div>
                )}

                {/* ── Error / Expired ── */}
                {status === "error" && (
                  <div className="py-10">
                    <div className="text-5xl mb-4">⚠️</div>
                    <p className="text-lg text-red-300 font-bold mb-2">
                      {message}
                    </p>

                    <div className="border-t border-white/20 pt-6 mt-6">
                      <p className="text-sm opacity-90 mb-4">
                        Enter your email to resend the verification link:
                      </p>
                      <form onSubmit={handleResend} className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@gmail.com"
                          className="flex-1 bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white font-1 text-sm"
                          required
                        />
                        <button
                          type="submit"
                          disabled={resendLoading}
                          className="bg-white text-black font-semibold font-1 py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer disabled:opacity-60 text-sm"
                        >
                          {resendLoading ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            "Resend"
                          )}
                        </button>
                      </form>
                    </div>

                    <div className="border-t border-white/20 pt-4 mt-6">
                      <Link
                        to="/login"
                        className="text-white hover:underline text-sm"
                      >
                        Back to login
                      </Link>
                    </div>
                  </div>
                )}

                {/* ── Resend form (no token in URL) ── */}
                {status === "resend" && (
                  <div className="py-10">
                    <div className="text-5xl mb-4">📧</div>
                    <p className="text-lg mb-2">
                      A verification email has been sent to your inbox.
                    </p>
                    <p className="text-sm opacity-80 mb-6">
                      Click the link in the email to verify your account. If you
                      didn't receive it, enter your email below to resend.
                    </p>

                    <form onSubmit={handleResend} className="flex gap-2 mb-6">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="flex-1 bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white font-1 text-sm"
                        required
                      />
                      <button
                        type="submit"
                        disabled={resendLoading}
                        className="bg-white text-black font-semibold font-1 py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer disabled:opacity-60 text-sm"
                      >
                        {resendLoading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          "Resend"
                        )}
                      </button>
                    </form>

                    {message && (
                      <p className="text-sm text-green-300 mb-4">{message}</p>
                    )}

                    <div className="border-t border-white/20 pt-4">
                      <Link
                        to="/login"
                        className="text-white hover:underline text-sm"
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
      </div>
    </>
  );
}