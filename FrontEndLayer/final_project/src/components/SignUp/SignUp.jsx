import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";

export default function SignUp() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register: doRegister } = useContext(UserContext);

  async function handleSignup(values) {
    setIsLoading(true);
    setServerError("");

    const toastId = toast.loading("Creating your account…", {
      id: "auth-register",
    });

    try {
      await doRegister(values);
      toast.success("Account created successfully!", { id: toastId });
      navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err.message ??
        "Registration failed. Please try again.";
      setServerError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(3, "Must be at least 3 characters")
      .max(25, "Must be 25 characters or less")
      .required("First name is required"),
    lastName: yup
      .string()
      .min(3, "Must be at least 3 characters")
      .max(25, "Must be 25 characters or less")
      .required("Last name is required"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required")
      .matches(/^[a-zA-Z]{3,}/, "Email must start with 3 letters at least"),
    phone: yup
      .string()
      .matches(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number")
      .required("Phone is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/\d/, "Must contain at least one number")
      .matches(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        "Must contain at least one special character"
      )
      .required("Password is required"),
    dateOfBirth: yup.string().required("Date of birth is required"),
    gender: yup
      .string()
      .oneOf(["male", "female"], "Please select a gender")
      .required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      dateOfBirth: "",
      gender: "female",
    },
    validationSchema,
    onSubmit: handleSignup,
  });

  // Password strength indicator
  function getPasswordStrength(password) {
    if (!password) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", color: "bg-red-400", width: "33%" };
    if (score <= 3)
      return { label: "Fair", color: "bg-amber-400", width: "60%" };
    if (score <= 4)
      return { label: "Good", color: "bg-[#00B3A1]", width: "80%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  }

  const strength = getPasswordStrength(formik.values.password);

  // Shared input classes
  const inputClass =
    "w-full px-4 py-3 bg-white/8 border border-white/20 rounded-xl text-white font-5 text-sm outline-none transition-all duration-200 placeholder:text-white/30 focus:border-[#00B3A1] focus:bg-white/12 focus:ring-2 focus:ring-[#00B3A1]/20";

  const errorClass = "text-red-400 font-5 text-xs mt-1.5";

  const labelClass = "block text-white/80 font-1 text-sm mb-1.5";

  return (
    <div className="background-image w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg mx-4 py-20 md:py-10">
        {/* Card */}
        <div className="w-full backdrop-blur-[16px] bg-white/10 rounded-2xl border border-white/15 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className="text-white font-1 text-3xl font-semibold">
              Create Account
            </h1>
            <p className="text-white/60 font-5 text-sm mt-2">
              Join ThyroCare to start monitoring your thyroid health
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="px-8 pb-8">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass}
                  placeholder="Omar"
                  required
                />
                {formik.errors.firstName && formik.touched.firstName ? (
                  <p className={errorClass}>{formik.errors.firstName}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass}
                  placeholder="Khaled"
                  required
                />
                {formik.errors.lastName && formik.touched.lastName ? (
                  <p className={errorClass}>{formik.errors.lastName}</p>
                ) : null}
              </div>
            </div>

            {/* Email */}
            <div className="mt-4">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
                placeholder="name@gmail.com"
                required
              />
              {formik.errors.email && formik.touched.email ? (
                <p className={errorClass}>{formik.errors.email}</p>
              ) : null}
            </div>

            {/* Phone */}
            <div className="mt-4">
              <label htmlFor="phone" className={labelClass}>
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
                placeholder="01000000000"
                required
              />
              {formik.errors.phone && formik.touched.phone ? (
                <p className={errorClass}>{formik.errors.phone}</p>
              ) : null}
            </div>

            {/* Password */}
            <div className="mt-4">
              <label htmlFor="password" className={labelClass}>
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
                  className={`${inputClass} pr-12`}
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

              {/* Password strength bar */}
              {formik.values.password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                      style={{ width: strength.width }}
                    ></div>
                  </div>
                  <p className="text-white/40 font-5 text-xs mt-1">
                    Password strength:{" "}
                    <span className="text-white/60">{strength.label}</span>
                  </p>
                </div>
              )}

              {formik.errors.password && formik.touched.password ? (
                <p className={errorClass}>{formik.errors.password}</p>
              ) : null}
            </div>

            {/* Date of Birth + Gender Row */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label htmlFor="dateOfBirth" className={labelClass}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClass} [color-scheme:dark]`}
                  required
                />
                {formik.errors.dateOfBirth && formik.touched.dateOfBirth ? (
                  <p className={errorClass}>{formik.errors.dateOfBirth}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="gender" className={labelClass}>
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClass} appearance-none cursor-pointer`}
                  required
                >
                  <option value="female" className="text-black bg-white">
                    Female
                  </option>
                  <option value="male" className="text-black bg-white">
                    Male
                  </option>
                </select>
                {formik.errors.gender && formik.touched.gender ? (
                  <p className={errorClass}>{formik.errors.gender}</p>
                ) : null}
              </div>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mt-4 p-3 bg-red-500/15 border border-red-500/25 rounded-xl">
                <p className="text-red-300 font-5 text-sm">{serverError}</p>
              </div>
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
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center mt-6 text-white/50 font-5 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#00B3A1] hover:underline font-1">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}