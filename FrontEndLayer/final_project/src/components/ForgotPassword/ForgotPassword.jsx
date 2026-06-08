import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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
      .email("Not a valid email")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: handleForgotPassword,
  });

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
                Forgot Password
              </p>

              {isSuccess ? (
                <div className="m-5 text-white font-1 text-center">
                  <div className="text-5xl mb-4">📧</div>
                  <p className="text-lg text-green-300 font-bold mb-2">
                    Reset link sent!
                  </p>
                  <p className="text-sm mb-6 opacity-90 leading-relaxed">
                    We sent a password reset link to:
                  </p>
                  <p className="text-white font-bold mb-6">{sentEmail}</p>
                  <p className="text-sm opacity-80 mb-6">
                    Check your inbox and spam folder. The link expires in 1 hour.
                  </p>
                  <div className="border-t border-white/20 pt-4 mt-6">
                    <Link
                      to="/login"
                      className="text-white hover:underline text-sm"
                    >
                      Back to login
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit} className="m-5">
                  <p className="text-white font-1 text-sm mb-6 opacity-90 leading-relaxed">
                    Enter the email address associated with your account and we
                    will send you a link to reset your password.
                  </p>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-white font-1 w-full text-lg"
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
                      className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                      placeholder="name@gmail.com"
                      required
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <p className="font-1 pt-1 text-red-800">
                        {formik.errors.email}
                      </p>
                    ) : null}
                  </div>

                  {serverError && (
                    <p className="font-1 pt-2 text-red-600 bg-red-100/20 rounded p-2 mt-4">
                      {serverError}
                    </p>
                  )}

                  {isLoading ? (
                    <p className="bg-white font-1 text-lg w-full my-8 py-2 rounded-lg cursor-pointer text-center">
                      <i className="fas fa-spinner fa-spin text-black"></i>
                    </p>
                  ) : (
                    <button
                      type="submit"
                      className="bg-white font-1 text-lg w-full my-8 py-2 rounded-lg cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                  )}

                  <div className="text-center mt-4">
                    <Link
                      to="/login"
                      className="text-white font-1 hover:underline text-sm"
                    >
                      Back to login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}