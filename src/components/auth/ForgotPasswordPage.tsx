"use client";

import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import img from '../../../public/images/logo/bgLogin.png';
import connectivizLogo from '../../../public/images/logo/logo-connectiviz.png';
import logo from '../../../public/images/logo/logo1.png';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        email,
      });
      
      console.log("Forgot password response:", res.data);
      setMessage(res.data.message);
      setIsSuccess(true);
      
      // Optionally, you can show the reset token for testing
      if (res.data.resetToken) {
        console.log("Reset token (for testing):", res.data.resetToken);
      }
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Forgot password error:", err.response?.data);
        setError(err.response?.data?.message || 'Failed to send reset instructions');
      } else {
        console.error("Unexpected error:", err);
        setError('Failed to send reset instructions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-start">
      <Image src={connectivizLogo} alt="logo" className="w-[250px] h-[60px] absolute flex top -top-0 mt-8 ml-10" />
      <Image src={img} alt="background" className="w-full h-full object-cover absolute" />

      <div className="w-full max-w-[600px] h-[500px] bg-custom-gradient mt-16 rounded-4xl ml-24 shadow-xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row mt-4">
          <div className="ml-10 mt-14">
            <div>
              <h2 className="text-gray-800 w-full text-3xl font-extralight mb-2">
                {isSuccess ? 'Check Your Email' : 'Forgot Password?'}
              </h2>
              <p className="text-blue-800 mt-3 font-light w-96 mb-3">
                {isSuccess 
                  ? 'We\'ve sent password reset instructions to your email address.' 
                  : 'Enter your email address and we\'ll send you instructions to reset your password.'
                }
              </p>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="mt-2 w-80" suppressHydrationWarning>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 bg-white text-gray-500 py-2 rounded-lg border shadow-2xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                    suppressHydrationWarning
                  />
                </div>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

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
                    disabled={loading}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : null}
                    {loading ? 'Sending...' : 'Send Instructions'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-2 w-80">
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    Reset instructions have been sent to <strong>{email}</strong>
                  </p>
                </div>
                
                <button
                  onClick={handleBackToLogin}
                  className="w-full py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  suppressHydrationWarning
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>

          <div className="w-96 flex flex-col pr-52 bg-transparent items-center justify-center absolute -right-44 top-20 bottom-0">
            <div className="text-center">
              <h2 className="text-gray-800 text-xl font-light">Password Recovery</h2>
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

export default ForgotPasswordPage;
