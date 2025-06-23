"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function UserHealthCard() {
  const { user } = useAuth();

  return (
    <div className="p-5 border bg-blue-50 dark:bg-gray-600 border-gray-200 rounded-2xl shadow-xl mb-6 dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Health & Personal Information
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Blood Type
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.bloodType || "Not provided"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Height
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.height ? `${user.height} cm` : "Not provided"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Weight
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.weight ? `${user.weight} kg` : "Not provided"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Marital Status
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.maritalStatus || "Not provided"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Mother Name
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.motherName || "Not provided"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Father Name
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.fatherName || "Not provided"}
          </p>
        </div>

        {user?.spouseName && (
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Spouse Name
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.spouseName}
            </p>
          </div>
        )}

        <div className="lg:col-span-2">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Medical History
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.medicalHistory || "Not provided"}
          </p>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Allergies
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {user?.allergies || "Not provided"}
          </p>
        </div>

        {user?.childrenNames && user.childrenNames.length > 0 && (
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Children
            </p>
            <div className="flex flex-wrap gap-2">
              {user.childrenNames.map((child, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 rounded-full text-sm"
                >
                  {child}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
