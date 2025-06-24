import React from 'react';
import {
  CalenderIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  UserCircleIcon,
} from "../icons/index";
import logo from "../../public/images/logo/naruku_logo-removebg-preview.png";
import Image from 'next/image';






const Sidebar = () => {
  return (
    <div className=" fixed left-0 shadow-lg shadow-gray-400 rounded-2xl dark:bg-gray-700  top-0 m-4 h-full w-16 bg-white  border-l-4 border-orange-500/40 flex flex-col items-center py-4 space-y-4">
      {/* Logo/Home Icon */}
      <Image
        src={logo}
        width={36}
        height={36}
        className="w-9 h-9 mx-auto text-orange-400"
        alt="Home"
        priority
      />
      <div className="bg-orange-100 p-2 rounded-lg mt-9">
        <GridIcon className="h-6 w-6 text-orange-500" />
      </div>
      
      {/* Chat Icon */}
      <div className="p-2 hover:bg-gray-100 rounded-lg">
        <CalenderIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </div>
      
      {/* Refresh/Sync Icon */}
      <div className="p-2 hover:bg-gray-100 rounded-lg">
        <ListIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </div>
      
      {/* Calendar Icon */}
      <div className="p-2 hover:bg-gray-100 rounded-lg">
        <PageIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </div>
      
      {/* User Icon */}
      <div className="p-2 hover:bg-gray-100 rounded-lg mt-auto">
        <UserCircleIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </div>
    </div>
  );
};

export default Sidebar;


