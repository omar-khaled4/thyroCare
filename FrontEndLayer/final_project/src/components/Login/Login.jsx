import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { login, resendVerification } from "../../services/authService";
import toast from "react-hot-toast";

export default function Login() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
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
      .email(" not valid email ")
      .required(" email is required ")
      .matches(/^[a-zA-Z]{3,}/, "email must start with 3 char at least"),
    password: yup
      .string()
      .min(6, " min lenght is 6 ")
      .required(" password is required "),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
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
                login
              </p>

              <form onSubmit={formik.handleSubmit} className="m-5">
                <div className="mt-4">
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

                <div className="mt-4">
                  <label
                    htmlFor="password"
                    className="text-white font-1 w-full text-lg"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                    required
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <p className="font-1 pt-1 text-red-800">
                      {formik.errors.password}
                    </p>
                  ) : null}
                </div>

                {/* Forgot Password? link */}
                <div className="text-right text-sm mt-2">
                  <a href="#" className="text-white font-1 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                {/* Server-side error message */}
                {serverError && (
                  <p className="font-1 pt-2 text-red-600 bg-red-100/20 rounded p-2">
                    {serverError}
                  </p>
                )}

                {/* Resend Verification Email button */}
                {showResendVerification && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="bg-white font-1 text-lg w-full mb-4 py-2 rounded-lg cursor-pointer"
                  >
                    Resend Verification Email
                  </button>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}