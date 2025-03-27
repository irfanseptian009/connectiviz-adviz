import React from 'react';
import {
  CalenderIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  UserCircleIcon,
} from "../icons/index";





const Sidebar = () => {
  return (
    <div className=" fixed left-0 shadow-lg shadow-gray-400 rounded-2xl dark:bg-gray-700  top-0 m-4 h-full w-16 bg-white  border-l-4 border-orange-500/40 flex flex-col items-center py-4 space-y-4">
      {/* Logo/Home Icon */}
      <svg className="w-9 h-9 mx-auto text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
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


