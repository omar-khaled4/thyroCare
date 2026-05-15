import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { register } from "../../services/authService";

export default function SignUp() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login: doLogin } = useContext(UserContext);

  async function handleSignup(values) {
    setIsLoading(true);
    setServerError("");

    try {
      // authService persists token + user to localStorage
      await register(values);
      // Re-fetch the full profile (authService.getMe / shared axios /auth/me)
      // to ensure the "user" stored in state matches what the rest of the app
      // expects (nested profile shape, roles, etc.).
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err.message ??
        "Registration failed. Please try again.";
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(3, " min lenght is 3 char ")
      .max(25, " max lenght is 25 char ")
      .required(" First name is required "),
    lastName: yup
      .string()
      .min(3, " min lenght is 3 char ")
      .max(25, " max lenght is 25 char ")
      .required(" Last name is required "),
    email: yup
      .string()
      .email(" not valid email ")
      .required(" email is required ")
      .matches(/^[a-zA-Z]{3,}/, "email must start with 3 char at least"),
    phone: yup
      .string()
      .matches(/^01[0125][0-9]{8}$/, "phone not valid")
      .required(" phone is required "),
    password: yup
      .string()
      .min(6, " min lenght is 6 ")
      .required(" password is required "),
    dateOfBirth: yup.string().required(" Date of birth is required "),
    gender: yup
      .string()
      .oneOf(["male", "female"], "gender must be male or female")
      .required(" gender is required "),
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

  return (
    <>
      <div className="background-image w-full min-h-screen">
        <div className="pt-35 mx-10 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5 fixed w-90">
            <p className="text-white font-1 text-5xl hidden md:flex leading-15">
              When your body speaks , Listening is the first step toward healing
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <div className="w-full backdrop-blur-[10px] bg-white/10 rounded-[50px] border border-white mb-4">
              <p className="text-white font-1 text-center text-2xl py-3 border-b-2 mx-5">
                Sign Up
              </p>

              <form onSubmit={formik.handleSubmit} className="m-5">
                <div className="grid gap-1 grid-cols-2">
                  <div>
                    <label
                      htmlFor="FName"
                      className="text-white font-1 w-full text-lg"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="FName"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                      required
                    />
                    {formik.errors.firstName && formik.touched.firstName ? (
                      <p className="font-1 pt-1 text-red-800">
                        {formik.errors.firstName}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="LName"
                      className="text-white font-1 w-full text-lg"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="LName"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                      required
                    />
                    {formik.errors.lastName && formik.touched.lastName ? (
                      <p className="font-1 pt-1 text-red-800">
                        {formik.errors.lastName}
                      </p>
                    ) : null}
                  </div>
                </div>

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
                    htmlFor="phone"
                    className="text-white font-1 w-full text-lg"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                    placeholder="01000000000"
                    required
                  />
                  {formik.errors.phone && formik.touched.phone ? (
                    <p className="font-1 pt-1 text-red-800">
                      {formik.errors.phone}
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

                <div className="grid gap-1 grid-cols-2 mt-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="text-white font-1 w-full text-lg"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="dateOfBirth"
                      value={formik.values.dateOfBirth}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                      required
                    />
                    {formik.errors.dateOfBirth && formik.touched.dateOfBirth ? (
                      <p className="font-1 pt-1 text-red-800">
                        {formik.errors.dateOfBirth}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="text-white font-1 w-full text-lg"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                      required
                    >
                      <option value="female" className="text-black">
                        Female
                      </option>
                      <option value="male" className="text-black">
                        Male
                      </option>
                    </select>
                  </div>
                </div>

                {/* Server-side error message */}
                {serverError && (
                  <p className="font-1 pt-2 text-red-600 bg-red-100/20 rounded p-2">
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
