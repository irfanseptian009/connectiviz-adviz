"use client";

import React, { FormEvent, useState } from 'react';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import img from '../../../public/images/logo/bgLogin.png';
import connectivizLogo from '../../../public/images/logo/logo-connectiviz.png';
import profileImg from '../../../public/images/icons/image.png';
import logo from '../../../public/images/logo/logo1.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://connectiviz-be.vercel.app/api/auth/login', {
        email,
        password,
      });
      login(res.data.accessToken);
      router.push('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login filed');
      } else {
        setError('Login filed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-start">
      <Image src={connectivizLogo} alt="logo" className="w-[250px] h-[60px] absolute flex top -top-0 mt-8 ml-10" />
      <Image src={img} alt="baground" className="w-full h-full object-cover absolute" />

      <div className="w-full max-w-[600px] h-[500px] bg-custom-gradient mt-16 rounded-4xl ml-24 shadow-xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row mt-4">
          <div className="ml-10 mt-14">
            <div>
              <h2 className="text-gray-800 w-full text-3xl font-extralight mb-2">Let&lsquo;s Setup your Operating Agreement</h2>
              <p className="text-blue-800 mt-3 font-light w-96 mb-3">Providing strategic guidance and support to help you thrive.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-2 w-80">
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 bg-white text-gray-500 py-2 rounded-lg border shadow-2xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="mb-2 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white text-gray-500 rounded-lg border shadow-2xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeCloseIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

              <div className="mb-2 text-right">
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="w-full py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="w-96 flex flex-col pr-52 bg-transparent items-center justify-center absolute -right-44 top-20 bottom-0">
            <div className="text-center">
              <h2 className="text-gray-800 text-xl font-light">Welcome Back</h2>
            </div>
            <Image src={logo} alt="logo" className="w-36 h-36" />
            <div className="absolute top-52 mt-1 transform -translate-y-1/2">
              <div className="relative">
                <Image src={profileImg} alt="profile" className="w-[91px] h-[91px] rounded-full" />
              </div>
            </div>
            <h3 className="text-gray-800 text-xl font-light">Irfan septian</h3>
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

export default LoginPage;