import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../../services/authService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const token = searchParams.get('token');

  if (!token) {
    return (
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
                Reset Password
              </p>
              <div className="m-5 text-white font-1 text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-lg text-red-300 font-bold mb-2">
                  Invalid or expired reset link
                </p>
                <p className="text-sm opacity-80 mb-6">
                  The link may have expired or is invalid. Please request a new one.
                </p>
                <Link
                  to="/forgot-password"
                  className="inline-block bg-white text-black font-semibold font-1 py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Request New Link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Must contain at least one lowercase letter')
      .matches(/\d/, 'Must contain at least one number')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Must contain at least one special character'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setServerError('');
    try {
      await resetPassword(token, values.newPassword);
      toast.success('Password reset successfully! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || 'Reset password failed';
      setServerError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              Reset Password
            </p>

            <Formik
              initialValues={{ newPassword: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="m-5">
                  <div className="mt-4">
                    <label htmlFor="newPassword" className="text-white font-1 w-full text-lg">
                      New Password
                    </label>
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="p"
                      className="font-1 pt-1 text-red-800"
                    />
                    <p className="font-1 pt-1 text-white/50 text-xs">
                      8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
                    </p>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="confirmPassword" className="text-white font-1 w-full text-lg">
                      Confirm Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="w-full font-1 bg-[#00000000] text-white rounded-lg"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="font-1 pt-1 text-red-800"
                    />
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
                      Reset Password
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;