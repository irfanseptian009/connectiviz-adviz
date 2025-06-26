"use client";

import React from "react";
import { useSSO } from "@/context/SSOContext";
import { LogOut, User, Shield } from "lucide-react";

export const SSOStatus: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading } = useSSO();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        <span className="text-sm">Checking authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-2 text-orange-600">
        <Shield className="w-4 h-4" />
        <span className="text-sm">Not authenticated for SSO</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
        <User className="w-5 h-5" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.username}</span>
          <span className="text-xs text-green-600 dark:text-green-500">{user.email}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
          {user.role}
        </span>
        <button
          onClick={logout}
          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
          title="Logout from SSO"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
