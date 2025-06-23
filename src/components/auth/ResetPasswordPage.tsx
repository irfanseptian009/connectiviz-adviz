"use client";

import React, { FormEvent, useState, useEffect } from 'react';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import img from '../../../public/images/logo/bgLogin.png';
import connectivizLogo from '../../../public/images/logo/logo-connectiviz.png';
import logo from '../../../public/images/logo/logo1.png';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        token,
        newPassword: password,
      });
      
      console.log("Reset password response:", res.data);
      
      // Redirect to login with success message
      router.push('/signin?message=Password reset successful. Please login with your new password.');
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Reset password error:", err.response?.data);
        setError(err.response?.data?.message || 'Failed to reset password');
      } else {
        console.error("Unexpected error:", err);
        setError('Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/signin');
  };

  if (!token && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-start">
      <Image src={connectivizLogo} alt="logo" className="w-[250px] h-[60px] absolute flex top -top-0 mt-8 ml-10" />
      <Image src={img} alt="background" className="w-full h-full object-cover absolute" />

      <div className="w-full max-w-[600px] h-[500px] bg-custom-gradient mt-16 rounded-4xl ml-24 shadow-xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row mt-4">
          <div className="ml-10 mt-14">
            <div>
              <h2 className="text-gray-800 w-full text-3xl font-extralight mb-2">Reset Your Password</h2>
              <p className="text-blue-800 mt-3 font-light w-96 mb-3">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-2 w-80" suppressHydrationWarning>
              <div className="mb-4 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white text-gray-500 rounded-lg border shadow-2xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                  minLength={6}
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeCloseIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>

              <div className="mb-4 relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white text-gray-500 rounded-lg border shadow-2xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                  minLength={6}
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  suppressHydrationWarning
                >
                  {showConfirmPassword ? <EyeCloseIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="flex-1 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  suppressHydrationWarning
                >
                  Back to Login
                </button>
                
                <button
                  type="submit"
                  className="flex-1 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center justify-center"
                  suppressHydrationWarning
                  disabled={loading || !token}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : null}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>

          <div className="w-96 flex flex-col pr-52 bg-transparent items-center justify-center absolute -right-44 top-20 bottom-0">
            <div className="text-center">
              <h2 className="text-gray-800 text-xl font-light">New Password</h2>
            </div>
            <Image src={logo} alt="logo" className="w-36 h-36" />
          </div>
        </div>
      </div>

      <div className="absolute top-7 right-7 text-white text-sm">
        <p>Connectiviz by <span className="font-bold text-orange-500">ADVIZ</span></p>
      </div>
      <div className="relative">
        <Image src={logo} alt="logo" className="w-[500px] h-[500px] ml-36 rounded-full" />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
