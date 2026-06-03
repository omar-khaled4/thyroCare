import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleForgotPassword(values) {
    setIsLoading(true);
    setServerError("");
    setResetToken("");
    setIsSuccess(false);

    const toastId = toast.loading("Sending reset link…", { id: "auth-forgot" });

    try {
      const response = await forgotPassword(values.email);
      // The forgotPassword service returns response which contains data.token
      const token = response?.data?.token || response?.token;

      if (token) {
        setResetToken(token);
      }
      setIsSuccess(true);
      toast.success("Reset link generated successfully!", { id: toastId });
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err.message ??
        "Failed to request password reset. Please try again.";
      setServerError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(" not valid email ")
      .required(" email is required ")
      .matches(/^[a-zA-Z]{3,}/, "email must start with 3 char at least"),
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
              When your body speaks, Listening is the first step toward
              healing
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <div className="w-full backdrop-blur-[10px] bg-white/10 rounded-[50px] border border-white mb-4">
              <p className="text-white font-1 text-center text-2xl py-3 border-b-2 mx-5">
                Forgot Password
              </p>

              {isSuccess ? (
                <div className="m-5 text-white font-1 text-center">
                  <p className="text-lg text-green-300 font-bold mb-4">
                    Reset Token Generated!
                  </p>
                  <p className="text-sm mb-6 opacity-90 leading-relaxed">
                    In a production environment, a reset link would be emailed to you. For development, you can use the direct link below:
                  </p>

                  {resetToken && (
                    <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
                      <Link
                        to={`/reset-password?token=${resetToken}`}
                        className="inline-block bg-white text-black font-semibold font-1 py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all"
                      >
                        Reset Password
                      </Link>
                    </div>
                  )}

                  <div className="border-t border-white/20 pt-4 mt-6">
                    <Link to="/login" className="text-white hover:underline text-sm">
                      Back to login
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit} className="m-5">
                  <p className="text-white font-1 text-sm mb-6 opacity-90 leading-relaxed">
                    Enter the email address associated with your account and we will generate a password reset token.
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

                  {/* Server-side error message */}
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
                      Submit
                    </button>
                  )}

                  <div className="text-center mt-4">
                    <Link to="/login" className="text-white font-1 hover:underline text-sm">
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
