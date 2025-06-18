"use client";





import NotificationDropdown from "@/components/naruku/header/NotificationDropdown";
import UserDropdown from "@/components/naruku/header/UserDropdown";
import { ThemeToggleButton } from "@/components/common/naruku/ThemeToggleButton";


const NarukuHeader: React.FC = () => {

  return (
    <header className="mx-6 z-50  sticky">
    <div className=" top-0 flex rounded-2xl h-16 md:h-20   w-full mt-2 ">
      <div className="flex flex-col items-center  justify-betwen grow lg:flex-row  lg:px-6">
        <div className="flex flex-row h-10 item-center"><p className="text-lg font-extralight dark:text-gray-300">Naruku</p> <span className="text-2xl text-orange-500 ml-5">|</span> <p className="w-92 ml-5 text-xl dark:text-gray-200">Good Morning Irfan</p></div>
       
        <div className="flex items-center justify-end w-full gap-2 px-4 py-3 border-b border-orange-600/20 dark:border-gray-800/50 sm:gap-4 lg:justify-end lg:border-b-0 lg:px-0 lg:py-4">
          <div className="hidden lg:block item-end ">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="fill-white/60 dark:fill-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
         
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border border-orange-600/30 bg-orange-300/10 backdrop-blur-sm py-2.5 pl-11 pr-14 text-sm text-gray-700 placeholder:text-gray/90 focus:border-orange-400/50 focus:outline-none focus:ring-2 focus:ring-orange-400/20 dark:border-gray-700 dark:bg-gray-800/40 dark:text-white/90 dark:placeholder:text-white/40 dark:focus:border-gray-600 xl:w-[430px]"
                />

                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-orange-600/40  bg-orange-600/20 px-2 py-1 text-xs text-white/80 transition-colors duration-150 hover:bg-orange-600/40 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800/80">
                  <span>⌘</span>
                  <span>K</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className="items-center justify-between w-full gap-4 px-5 py-4 bg-orange-500/90 dark:bg-gray-900/90  lg:flex lg:justify-end lg:px-0 lg:bg-transparent dark:lg:bg-transparent"
        >
          <div className="flex items-center gap-3">
            {/* <!-- Dark Mode Toggler --> */}
            <div className="relative ">
              <ThemeToggleButton />
            </div>
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            <div className="relative ">
              <NotificationDropdown />
            </div>
            {/* <!-- Notification Menu Area --> */}
          </div>
          {/* <!-- User Area --> */}
          <div className="flex items-center ml-4">
            <UserDropdown />
          </div>
          {/* <!-- User Area --> */}
        </div>
      </div>
    </div>
    </header>
  );
};

export default NarukuHeader;