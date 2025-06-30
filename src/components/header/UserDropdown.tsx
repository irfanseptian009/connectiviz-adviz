"use client";

import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import UserMetaCard from "../user-profile/UserMetaCard";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { useHasMounted } from "@/hooks/useClientOnly";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();
  const hasMounted = useHasMounted();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    logout();
    router.push("/signin");
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'EMPLOYEE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="relative">
        <button className="flex items-center dropdown-toggle">
          <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-200 dark:bg-gray-700"></span>
          <div className="flex flex-col items-start">
            <span className="block mr-1 font-medium text-theme-sm">Loading...</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center dropdown-toggle"
        suppressHydrationWarning={true}
        key="user-dropdown-button"
      >        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <UserAvatar 
            src={user?.profilePictureUrl}
            name={user?.fullName || user?.username}
            size={44}
            className="border-2 border-white/20"
          />
        </span>
        <div className="flex flex-col items-start">
          <span className="block mr-1 font-medium text-theme-sm">
            {user?.fullName || user?.username || "User"}
          </span>
          {user?.role && (
            <Badge 
              variant="secondary" 
              className={`text-xs mt-1 ${getRoleColor(user.role)}`}
            >
              {user.role.replace('_', ' ')}
            </Badge>
          )}
        </div>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[25px]  flex w-[320px] flex-col rounded-2xl border  border-gray-200 bg-white p-0 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <UserMetaCard />
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800 px-7">
          <li>
            <DropdownItem className="dark:text-white dark:hover:bg-white/5" onItemClick={closeDropdown} tag="a" href="/profile">
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem className="dark:text-white dark:hover:bg-white/5" onItemClick={closeDropdown} tag="a" href="/profile">
              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem className="dark:text-white dark:hover:bg-white/5" onItemClick={closeDropdown} tag="a" href="/support">
              Support
            </DropdownItem>
          </li>
        </ul>
        <div className="px-7 pb-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 dark:text-white  dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <svg
              className="fill-gray-500  group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                fill=""
              />
            </svg>
            Sign out
          </button>
        </div>
      </Dropdown>
    </div>
  );
}