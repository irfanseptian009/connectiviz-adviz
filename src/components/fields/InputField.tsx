"use client";
import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
    error?: string;
  [key: string]: number | string | boolean | React.ChangeEvent<HTMLInputElement> | ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
}

export default function InputField({ label, name, value, type = "text", required = false, onChange, error, ...props }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        name={name} 
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg transition-colors ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`} 
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}