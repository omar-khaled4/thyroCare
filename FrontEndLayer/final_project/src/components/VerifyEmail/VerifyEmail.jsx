import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail, resendVerification } from "../../services/authService";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    if (token) {
      setLoading(true);
      verifyEmail(token)
        .then(() => {
          setSuccess(true);
          setLoading(false);
        })
        .catch((err) => {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Verification failed";
          setError(msg);
          setLoading(false);
        });
    } else {
      setError("No token provided");
      setLoading(false);
    }
  }, []);

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      await resendVerification(email);
      toast.success("Verification email sent");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to resend verification";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="background-image w-full min-h-screen">
        <div className="pt-35 mx-10 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5 fixed w-90">
            <p className="text-white font-1 text-5xl hidden md:flex leading-15">
              When your body speaks, Listening is the first step toward
              healing
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <div className="w-full backdrop-blur-[10px] bg-white/10 rounded-[50px] border border-white mb-4">
              <p className="text-white font-1 text-center text-2xl py-3 border-b-2 mx-5">
                Verify Email
              </p>

              {loading ? (
                <p className="bg-white font-1 text-lg w-full my-8 py-2 rounded-lg cursor-pointer text-center">
                  <i className="fas fa-spinner fa-spin text-black"></i>
                  Verifying...
                </p>
              ) : success ? (
                <div className="m-5 text-center">
                  <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
                  <p className="text-white font-1 text-lg">Email Verified!</p>
                  <Link to="/login" className="bg-white font-1 text-lg w-full my-8 py-2 rounded-lg cursor-pointer block">
                    Go to Login
                  </Link>
                </div>
              ) : (
                <div className="m-5">
                  <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                  <p className="text-white font-1">{error}</p>
                  <div className="mt-4">
                    <label htmlFor="resendEmail" className="text-white font-1 w-full text-lg">
                      Email
                    </label>
                    <input
                      type="email"
                      id="resendEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full font-1 bg-[#00000000] text-white rounded-lg mt-1"
                      placeholder="name@gmail.com"
                      required
                    />
                  </div>
                  <button
                    onClick={handleResend}
                    className="bg-white font-1 text-lg w-full my-4 py-2 rounded-lg cursor-pointer"
                  >
                    Resend Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
);
}