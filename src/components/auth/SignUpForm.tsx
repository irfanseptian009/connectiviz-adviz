"use client"

import React, {  useState } from 'react';
import {  EyeCloseIcon, EyeIcon } from "@/icons";
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import img from '../../../public/images/logo/bgLogin.png';
import connectivizLogo from '../../../public/images/logo/logo-connectiviz.png';
import profileImg from '../../../public/images/user/owner.jpg';
import logo from  '../../../public/images/logo/logo1.png';
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";




const SigninPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  // const router = useRouter();
  

  // const handleSubmit = (e: FormEvent): void => {
  //   e.preventDefault();
  //   router.push('/');
  // };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-start">
        <Image src={connectivizLogo} alt="logo" className="w-[250px] h-[60px] absolute flex top -top-0 mt-8 ml-10" />
       <Image src={img} alt="baground" className="w-full h-full object-cover absolute " />
      {/* Main container */}
      <div className="w-full max-w-[600px] h-[500px] bg-custom-gradient mt-16 rounded-4xl ml-24 shadow-xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row mt-4">
          {/* Left side - login form */}
          <div className="ml-10 mt-10">
           
            <div className="">
              <h2 className="text-gray-800 w-full text-3xl font-extralight mb-2">Let&lsquo;s Setup your Operating Agreement</h2>
              <p className="text-blue-800 mt-3 font-light w-96 mb-3">Providing strategic guidance and support to help you thrive.</p>
            </div>

            <form>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                {/* <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link> */}
              </p>
            </div>
          </div>
          
          {/* Right side - Welcome back */}
          <div className="w-96 flex flex-col pr-52 bg-transparent items-center justify-center absolute -right-44 top-20 bottom-0">
            <div className="text-center">
              <h2 className="text-gray-800 text-xl font-light">Welcome Back</h2>
            </div>
            
            {/* Decorative elements */}
            <Image src={logo} alt="logo" className="w-36 h-36" />
            <div className="absolute right-0 bottom-0">
            </div>
            
            <div className="absolute top-1/2 transform -translate-y-1/2">
              <div className="relative">
                <Image src={profileImg} alt="profile" className="w-[90px] h-[90px] rounded-full" />
              </div>
            </div>
            <h3 className="text-gray-800 text-xl font-light">Irfan septian</h3>
          </div>
        </div>
      </div>
      
      {/* Branding */}
      <div className="absolute top-7 right-7 text-white text-sm">
        <p>Connectiviz by <span className="font-bold text-orange-500">ADVIZ</span></p>
      </div>
      <div className="relative">
        <Image src={logo} alt="logo" className="w-[500px] h-[500px] ml-36 rounded-full" />
      </div>
    </div>
  );
};

export default SigninPage;