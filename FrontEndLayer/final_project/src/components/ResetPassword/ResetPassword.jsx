import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../../services/authService";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  // Password strength indicator
  function getPasswordStrength(password) {
    if (!password) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

    if (score <= 2)
      return { label: "Weak", color: "bg-red-400", width: "33%" };
    if (score <= 3)
      return { label: "Fair", color: "bg-amber-400", width: "60%" };
    if (score <= 4)
      return { label: "Good", color: "bg-[#00B3A1]", width: "80%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  }

  // No token — invalid link
  if (!token) {
    return (
      <div className="background-image w-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-4 pt-20 pb-10 md:pt-10">
          <div className="w-full backdrop-blur-[16px] bg-white/10 rounded-2xl border border-white/15 overflow-hidden">
            <div className="px-8 pt-8 pb-8 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/15 flex items-center justify-center">
                <i className="fas fa-link-slash text-red-400 text-2xl"></i>
              </div>
              <h1 className="text-white font-1 text-2xl font-semibold mb-2">
                Invalid Link
              </h1>
              <p className="text-white/60 font-5 text-sm mb-6">
                This reset link is invalid or has expired. Please request a new
                one.
              </p>
              <Link
                to="/forgot-password"
                className="block w-full py-3 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 text-center"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/\d/, "Must contain at least one number")
      .matches(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setServerError("");
    try {
      await resetPassword(token, values.newPassword);
      toast.success("Password reset successfully! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Reset password failed";
      setServerError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background-image w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-4 pt-20 pb-10 md:pt-10">
        <div className="w-full backdrop-blur-[16px] bg-white/10 rounded-2xl border border-white/15 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className="text-white font-1 text-3xl font-semibold">
              Reset Password
            </h1>
            <p className="text-white/60 font-5 text-sm mt-2">
              Enter your new password below
            </p>
          </div>

          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => {
              const strength = getPasswordStrength(values.newPassword);

              return (
                <Form className="px-8 pb-8">
                  {/* New Password */}
                  <div className="mt-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-white/80 font-1 text-sm mb-1.5"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Field
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="w-full px-4 py-3 pr-12 bg-white/8 border border-white/20 rounded-xl text-white font-5 text-sm outline-none transition-all duration-200 placeholder:text-white/30 focus:border-[#00B3A1] focus:bg-white/12 focus:ring-2 focus:ring-[#00B3A1]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00B3A1] transition-colors"
                      >
                        <i
                          className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"
                            } text-sm`}
                        ></i>
                      </button>
                    </div>

                    {/* Password strength bar */}
                    {values.newPassword && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                            style={{ width: strength.width }}
                          ></div>
                        </div>
                        <p className="text-white/40 font-5 text-xs mt-1">
                          Password strength:{" "}
                          <span className="text-white/60">
                            {strength.label}
                          </span>
                        </p>
                      </div>
                    )}

                    <ErrorMessage
                      name="newPassword"
                      component="p"
                      className="text-red-400 font-5 text-xs mt-1.5"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mt-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-white/80 font-1 text-sm mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="w-full px-4 py-3 pr-12 bg-white/8 border border-white/20 rounded-xl text-white font-5 text-sm outline-none transition-all duration-200 placeholder:text-white/30 focus:border-[#00B3A1] focus:bg-white/12 focus:ring-2 focus:ring-[#00B3A1]/20"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00B3A1] transition-colors"
                      >
                        <i
                          className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                            } text-sm`}
                        ></i>
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-red-400 font-5 text-xs mt-1.5"
                    />
                  </div>

                  {/* Server Error */}
                  {serverError && (
                    <div className="mt-4 p-3 bg-red-500/15 border border-red-500/25 rounded-xl">
                      <p className="text-red-300 font-5 text-sm">
                        {serverError}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-3 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "Reset Password"
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
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;