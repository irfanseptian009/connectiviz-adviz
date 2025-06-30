"use client";

import React, { FormEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import img from '../../../public/images/logo/bgLogin.png';
import connectivizLogo from '../../../public/images/logo/logo-connectiviz.png';
import logo from '../../../public/images/logo/logo1.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showProfileAnimation, setShowProfileAnimation] = useState(false);
  const [isFormCentered, setIsFormCentered] = useState(true);
  const [showGateAnimation, setShowGateAnimation] = useState(false);
  const [showProfileReveal, setShowProfileReveal] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [isReadyToNavigate, setIsReadyToNavigate] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth(); 
  useEffect(() => {
    const message = searchParams.get('message');
    const redirect = searchParams.get('redirect');
    
    if (message) {
      setSuccessMessage(message);
      const url = new URL(window.location.href);
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url.toString());
    }
    
    // Store redirect parameter for post-login navigation
    if (redirect) {
      sessionStorage.setItem('postLoginRedirect', redirect);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showProfileReveal) {
      console.log("Profile reveal triggered, current user data:", user);
      setIsLoadingUserData(true);
    }
    
    if (user && showProfileReveal && !showProfileAnimation) {
      console.log("Triggering profile animation with user data:", user);
      setIsLoadingUserData(false);
      setTimeout(() => {
        setShowProfileAnimation(true);
      }, 300);
      
      setTimeout(() => {
        setIsReadyToNavigate(true);
      }, 800);
    }
  }, [user, showProfileReveal, showProfileAnimation]);

  useEffect(() => {
    if (isReadyToNavigate && user && showProfileAnimation) {
      console.log("All data loaded, starting final navigation sequence...");
      
      setTimeout(() => {
        console.log("Starting gate animation...");
        setShowGateAnimation(true);
      }, 1500);
      
      setTimeout(() => {
        console.log("Navigating...");
        
        // Check for post-login redirect
        const postLoginRedirect = sessionStorage.getItem('postLoginRedirect');
        
        if (postLoginRedirect === 'naruku') {
          sessionStorage.removeItem('postLoginRedirect');
          console.log("Redirecting to Naruku with SSO...");
          
          // Generate SSO token and redirect to Naruku
          const token = localStorage.getItem('token');
          if (token) {
            const narukyUrl = process.env.NEXT_PUBLIC_NARUKU_URL || 'http://localhost:3002';
            window.location.href = `${narukyUrl}?ssoToken=${encodeURIComponent(token)}`;
            return;
          }
        }
        
        // Default navigation to admin dashboard
        router.push('/');
      }, 4300); 
    }
  }, [isReadyToNavigate, user, showProfileAnimation, router]);const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsLoadingUserData(false);
    setIsReadyToNavigate(false);
    
    localStorage.removeItem('token');
    console.log("Cleared existing token before login");
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });
      console.log("Login response:", res.data);
      console.log("Access token received:", res.data.accessToken);
      
      await login(res.data.accessToken);
      console.log("Login process completed, starting animation sequence...");
      console.log("Current token after login:", localStorage.getItem('token'));
      
      // Start animation sequence - navigation will be handled by useEffect
      setTimeout(() => {
        setIsFormCentered(false);
      }, 500);
      
      setTimeout(() => {
        setShowProfileReveal(true);
      }, 1000);
      
    }catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Login error:", err.response?.data);
        setError(err.response?.data?.message || 'Login failed');
      } else {
        console.error("Unexpected login error:", err);
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes bigLogoRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-big-logo-rotate {
          animation: bigLogoRotate 8s linear infinite !important;
          transform-origin: center center !important;
        }
        

        
        @keyframes profileGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
          }
        }
        
        @keyframes gateOpen {
          0% {
            transform: scaleX(0) scaleY(1);
            opacity: 0;
          }
          20% {
            transform: scaleX(0.3) scaleY(1);
            opacity: 0.5;
          }
          40% {
            transform: scaleX(0.7) scaleY(1);
            opacity: 0.8;
          }
          60% {
            transform: scaleX(1) scaleY(1);
            opacity: 1;
          }
          100% {
            transform: scaleX(1) scaleY(1);
            opacity: 1;
          }
        }
        
        @keyframes gateSlideLeft {
          0% {
            transform: translateX(0) scaleX(1);
          }
          30% {
            transform: translateX(-10%) scaleX(0.95);
          }
          70% {
            transform: translateX(-50%) scaleX(0.7);
          }
          100% {
            transform: translateX(-100%) scaleX(0.3);
          }
        }
        
        @keyframes gateSlideRight {
          0% {
            transform: translateX(0) scaleX(1);
          }
          30% {
            transform: translateX(10%) scaleX(0.95);
          }
          70% {
            transform: translateX(50%) scaleX(0.7);
          }
          100% {
            transform: translateX(100%) scaleX(0.3);
          }
        }
        
        @keyframes gateGlow {
          0%, 100% {
            box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: inset 0 0 40px rgba(59, 130, 246, 0.6);
          }
        }
        
        @keyframes profileReveal {
          0% {
            opacity: 0;
            transform: scale(0.3) rotateY(180deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.7) rotateY(90deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }
        
        @keyframes dramaticEntrance {
          0% {
            opacity: 0;
            transform: scale(0.1) rotate(360deg);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2) rotate(180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes spectacular {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          25% {
            transform: scale(1.1);
            filter: brightness(1.3);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.1);
          }
          75% {
            transform: scale(1.08);
            filter: brightness(1.2);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }
        
        @keyframes sparkleFloat {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0;
          }
        }
        
        .gate-left {
          animation: gateOpen 1.8s ease-out forwards, 
                     gateGlow 2s ease-in-out infinite,
                     gateSlideLeft 1.5s ease-in 1.8s forwards;
        }
        
        .gate-right {
          animation: gateOpen 1.8s ease-out forwards, 
                     gateGlow 2s ease-in-out infinite,
                     gateSlideRight 1.5s ease-in 1.8s forwards;
        }
        
        .profile-reveal {
          animation: profileReveal 1s ease-out forwards;
        }
        
        .dramatic-entrance {
          animation: dramaticEntrance 1.2s ease-out forwards;
        }
        
        .spectacular {
          animation: spectacular 2s ease-in-out infinite;
        }
        
        .sparkle-float {
          animation: sparkleFloat 3s ease-in-out infinite;
        }
        
        .animate-profileReveal {
          animation: profileReveal 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        .animate-profileBounce {
          animation: profileBounce 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-profileCheck {
          animation: profileCheck 0.6s ease-out 1.5s forwards;
          opacity: 0;
          transform: scale(0);
        }
        
        .animate-profileText {
          animation: profileText 0.8s ease-out 1s forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes profileReveal {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-180deg);
            filter: blur(20px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) rotate(-90deg);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: blur(0px);
          }
        }
        
        @keyframes profileBounce {
          0% {
            opacity: 0;
            transform: scale(0) rotateY(-180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotateY(-90deg);
          }
          70% {
            transform: scale(0.9) rotateY(-45deg);
          }
          85% {
            transform: scale(1.05) rotateY(-10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }
        
        @keyframes profileCheck {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) rotate(-90deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes profileText {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }
        
        @keyframes inputFocus {
          0% {
            transform: scale(1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .input-focus-animation {
          animation: inputFocus 0.3s ease-out;
        }
        
        .button-pulse {
          animation: buttonPulse 2s infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes gateTextReveal {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) scale(0.3);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) scale(1);
          }
        }
        
        @keyframes gateLetterLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px) rotate(45deg) scale(0);
          }
          100% {
            opacity: 0.7;
            transform: translateX(0) rotate(12deg) scale(1);
          }
        }
        
        @keyframes gateLetterRight {
          0% {
            opacity: 0;
            transform: translateX(100px) rotate(-45deg) scale(0);
          }
          100% {
            opacity: 0.7;
            transform: translateX(0) rotate(-12deg) scale(1);
          }
        }
        
        .gate-text-reveal {
          animation: gateTextReveal 1s ease-out forwards;
        }
        
        .gate-letter-left {
          animation: gateLetterLeft 0.8s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        .gate-letter-right {
          animation: gateLetterRight 0.8s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        @keyframes fadeToBlack {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        .fade-to-black {
          animation: fadeToBlack 0.5s ease-out 3.5s forwards;
        }
      `}</style>
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-400 flex items-center justify-between overflow-hidden relative">
      {/* Floating Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-blue-300/30 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute top-60 left-40 w-2 h-2 bg-purple-300/40 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        <div className="absolute bottom-40 right-20 w-5 h-5 bg-pink-300/25 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3.5s'}}></div>
        <div className="absolute bottom-20 left-32 w-3 h-3 bg-yellow-300/30 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4.5s'}}></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse float-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse float-animation" style={{animationDelay: '1s'}}></div>
      </div>
      
      <Image 
        src={connectivizLogo} 
        alt="logo" 
        className="w-[250px] h-[60px] absolute flex top -top-0 mt-8 ml-10 z-10 transition-all duration-1000 drop-shadow-lg" 
      />
      <Image src={img} alt="baground" className="w-full h-full object-cover absolute opacity-90" />

      {showGateAnimation && (
        <div className="absolute inset-0 z-30 pointer-events-none fade-to-black">
          {/* Gate Opening Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 text-center gate-text-reveal">
        
          

            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
          
          {/* Left Gate Panel */}
          <div className="gate-left absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-slate-950 via-purple-800 to-blue-700 opacity-95 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(59,130,246,0.3)_70%)]"></div>
            
            {/* Left Gate Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* <div className="text-white/70 text-8xl font-bold gate-letter-left">
                C
              </div> */}
            </div>
          </div>
          
          {/* Right Gate Panel */}
          <div className="gate-right absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-slate-950 via-purple-800 to-blue-700 opacity-95 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(59,130,246,0.3)_70%)]"></div>
            
            {/* Right Gate Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* <div className="text-white/70 text-8xl font-bold gate-letter-right">
                V
              </div> */}
            </div>
          </div>
          
          {/* Enhanced Sparkle and Particle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full animate-ping sparkle-float"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse sparkle-float" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-blue-300 rounded-full animate-bounce sparkle-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-300 rounded-full animate-ping sparkle-float" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-purple-300 rounded-full animate-pulse sparkle-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-pink-300 rounded-full animate-bounce sparkle-float" style={{animationDelay: '2.5s'}}></div>
            
            {/* Central light beam effect */}
            <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-white/50 to-transparent transform -translate-x-1/2 animate-pulse"></div>
            
            {/* Radial light bursts */}
            <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-400/5 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>
      )}

      <div className={`"w-full max-w-[500px] relative transition-all duration-1000 h-[500px] bg-custom-gradient mt-16 rounded-4xl ml-24 shadow-xl overflow-hidden relative" ${
        isFormCentered ? 'ml-52' : 'ml-28 -translate-x-16'
      }`}>
        {/* Gradient Border Effect */}

        <div className="flex flex-col md:flex-row relative z-10">
          <div className="m-14  relative z-20">
            {/* Header Section */}
            <div className="mb-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 n">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-gray-800 text-3xl font-bold mb-1">Welcome Back</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              
              <p className="text-gray-800 text-xm font-light leading-relaxed">
                Sign in to your account to continue your journey with 
                <span className=" font-normal"> Connectiviz</span>
              </p>
              
              {/* Decorative Elements */}
              <div className="flex space-x-2 mt-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-3 w-full space-y-4" suppressHydrationWarning>
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-3 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl border-2 border-gray-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 hover:bg-white hover:shadow-xl placeholder-gray-400"
                  required
                  suppressHydrationWarning
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl border-2 border-gray-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 hover:bg-white hover:shadow-xl placeholder-gray-400"
                  required
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-blue-500 transition-colors duration-200 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  suppressHydrationWarning
                >
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Error & Success Messages */}
              {error && (
                <div className="flex items-center space-x-1 p-1 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-700 text-sm font-medium">{successMessage}</p>
                </div>
              )}
              
              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 relative group"
                  style={{ pointerEvents: 'auto' }}
                >
                  Forgot Password?
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-2 px-6 bg-gradient-to-r from-blue-600/70 to-blue-700/70 hover:from-blue-700/70 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
                suppressHydrationWarning
                disabled={loading || showProfileReveal}
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span className="text-lg">Signing In...</span>
                    </>
                  ) : showProfileReveal ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span className="text-lg">Loading Profile...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">Sign In</span>
                      <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
              </button>
            </form>
          </div>

          <div className="w-96 flex flex-col pr-52 bg-transparent items-center justify-center absolute -right-44 top-20 bottom-0 pointer-events-none">
            <div className={`text-center transition-all duration-1000 ${
              showProfileReveal ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
           
            </div>
          </div>
        </div>
      </div>

      {/* Profile Overlay - Centered on Screen */}
      {showProfileReveal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-6 rounded-3xl p-12 animate-profileReveal pointer-events-auto max-w-sm mx-4">
            
            {/* Loading indicator - Show while waiting for user data */}
            {isLoadingUserData && !user && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
              </div>
            )}
            
            {/* Profile Photo - Show when user data is loaded */}
            {user && (
              <>
                <div className="relative mx-auto w-40 h-40 animate-profileBounce">
                  {user.profilePictureUrl ? (
                    <Image
                      src={user.profilePictureUrl}
                      alt={user.fullName || user.username || 'User'}
                      fill
                      className="rounded-full object-cover border-4 border-white/50 shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center border-4 border-white/50 shadow-2xl">
                      <span className="text-white text-6xl font-bold">
                        {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  
                  {/* Animated rings around profile */}
                  <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-40"></div>
                  <div className="absolute -inset-2 rounded-full border-2 border-blue-400 animate-pulse opacity-50"></div>
                  <div className="absolute -inset-4 rounded-full border border-yellow-300 animate-spin opacity-30"></div>
                  <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-lg animate-pulse"></div>
                  
                  {/* Success checkmark */}
                  <div className="absolute -right-3 bg-blue-700 rounded-full p-1 animate-profileCheck shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                {/* User Name and Welcome Message */}
                <div className="animate-profileText">
                  <h2 className="text-3xl font-bold text-white mb-1">
                    Welcome back!
                  </h2>
                  <h3 className="text-2xl font-semibold text-white/90 mb-2">
                    {user.fullName || user.username || 'User'}
                  </h3>
                </div>
              </>
            )}
            
            {/* Sparkle effects */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-8 right-6 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 left-6 w-4 h-4 bg-blue-300 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-pink-300 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      <div className="absolute top-7 right-7 text-white text-sm">
        <p>Connectiviz by <span className="font-bold text-orange-500">ADVIZ</span></p>
      </div>
      <div className={`relative transition-all duration-1000 right-44 mt-10 ${
        isFormCentered ? 'ml-24' : 'ml-56 translate-x-40'
      }`}>
        <Image 
          src={logo} 
          alt="logo" 
          className="w-[500px] h-[500px] bg-blue-700/10 border-2 border-blue-600/50 rounded-full animate-big-logo-rotate"
          style={{
            animation: 'bigLogoRotate 8s linear infinite',
            transformOrigin: 'center center'
          }}
        />
      </div>
    </div>
    </>
  );
};

export default LoginPage;