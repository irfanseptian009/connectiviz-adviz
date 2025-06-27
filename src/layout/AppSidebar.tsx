"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useHasMounted } from "../hooks/useClientOnly";
import { useAdaptiveNavigation } from "../hooks/useAdaptiveNavigation";
import { useAdaptiveLoading } from "../context/AdaptiveLoadingContext";
import { useRoleCheck } from "@/components/common/RoleGuard";
import logo from "../../public/images/logo/logo1.png";
import logo2 from "../../public/images/logo/logo-connectiviz.png";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Application", path: "/", pro: false }],
  },

  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Create New Employee", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Table Employee", path: "/basic-tables", pro: false }],
  },  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Business Analytics Hub", path: "/business-analytics", pro: false },
      { name: "Organization", path: "/organization", pro: false },
      { name: "Business Unit", path: "/business-unit", pro: false },
    ],
  },
  
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Employee",
    subItems: [
      { name: "Employee Monitoring", path: "/list-employee", pro: false },
    ],
  },
  {
    
    icon: <BoxCubeIcon />,
    name: "Article",
    subItems: [
      { name: "Article Example", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
    ],
  },
    {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const hasMounted = useHasMounted();
  const { navigateWithAdaptiveLoading, preloadRoute } = useAdaptiveNavigation();
  const { isLoading } = useAdaptiveLoading();
  const { canCreateEmployee, canViewEmployeeList, canAccessBusinessUnits } = useRoleCheck();

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => {
    // Dashboard is accessible to all
    if (item.name === "Dashboard") return true;
    
    // Forms (Create Employee) - only for SUPER_ADMIN and ADMIN
    if (item.name === "Forms") {
      return canCreateEmployee();
    }
    
    // Tables (Employee Table) - only for SUPER_ADMIN and ADMIN
    if (item.name === "Tables") {
      return canViewEmployeeList();
    }
    
    // Pages (Business Analytics, Organization, Business Unit) - only for SUPER_ADMIN and ADMIN
    if (item.name === "Pages") {
      return canAccessBusinessUnits();
    }
    
    return true;
  });

  const filteredOthersItems = othersItems.filter(item => {
    // Employee Monitoring - only for SUPER_ADMIN and ADMIN
    if (item.name === "Employee") {
      return canViewEmployeeList();
    }
    
    // Article - accessible to all
    if (item.name === "Article") return true;
    
    // Authentication - accessible to all
    if (item.name === "Authentication") return true;
    
    return true;
  });

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Handle navigation with loading feedback
  const handleNavigation = useCallback((path: string, itemName: string) => {
    setClickedItem(path);
    navigateWithAdaptiveLoading(path, `Loading ${itemName}...`);
    
    // Clear clicked state after a short delay
    setTimeout(() => {
      setClickedItem(null);
    }, 800);
  }, [navigateWithAdaptiveLoading]);

  // Check if item is currently loading
  const isItemLoading = useCallback((path: string) => {
    return isLoading && clickedItem === path;
  }, [isLoading, clickedItem]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // Prevent hydration mismatch
  if (!hasMounted) {
    return null;
  }

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-3">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`flex items-center rounded-lg px-1 py-2.5 w-full text-sm transition-all duration-200
                ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "bg-white/10 font-light text-black dark:text-blue-300 dark:bg-gray-800/60"
                    : "text-gray-800 dark:text-gray-300 hover:bg-gray-800/10 dark:hover:bg-gray-200/30"
                }
                ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-between"}
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-6 h-6 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "text-gray-800 dark:text-white"
                      : "text-orange-800 dark:text-blue-300"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="font-medium">{nav.name}</span>
                )}
              </div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (            nav.path && (
              <button
                onClick={() => handleNavigation(nav.path!, nav.name)}
                onMouseEnter={() => preloadRoute(nav.path!)}
                disabled={isItemLoading(nav.path!)}
                className={`flex items-center rounded-lg px-1 py-2.5 w-full text-sm transition-all duration-200 relative
                  ${
                    isActive(nav.path)
                      ? "bg-black/10 font-medium text-gray-600 dark:bg-gray-800/60 dark:text-white"
                      : "text-gray-800 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30"
                  }
                  ${isItemLoading(nav.path!) ? "opacity-60 cursor-not-allowed" : ""}
                  ${!isExpanded && !isHovered ? "lg:justify-center" : ""}
                `}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 ${
                    isActive(nav.path)
                      ? "text-gray-600 dark:text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }
                `}
                >
                  {isItemLoading(nav.path!) ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    nav.icon
                  )}
                </span>                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`font-medium ${isItemLoading(nav.path!) ? "opacity-70" : ""}`}>
                    {nav.name}
                    {isItemLoading(nav.path!) && (
                      <span className="ml-2 text-xs opacity-60">Loading...</span>
                    )}
                  </span>
                )}
              </button>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>                    <button
                      onClick={() => handleNavigation(subItem.path, subItem.name)}
                      onMouseEnter={() => preloadRoute(subItem.path)}
                      disabled={isItemLoading(subItem.path)}
                      className={`flex items-center rounded-md px-3 py-2 text-sm transition-all duration-200 w-full text-left relative
                        ${
                          isActive(subItem.path)
                            ? "bg-blue-500/10 font-medium text-black dark:bg-gray-100/10 dark:text-white "
                            : "text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-600/30"
                        }
                        ${isItemLoading(subItem.path) ? "opacity-60 cursor-not-allowed" : ""}
                      `}
                    >
                      <span className="flex items-center gap-2">
                        {isItemLoading(subItem.path) && (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                        {subItem.name}
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded-full ${
                              isActive(subItem.path)
                                ? "bg-black/20 text-black dark:bg-gray-700"
                                : "bg-blue-200/20 text-blue-900 dark:bg-gray-700"
                            }`}
                          >
                            Connectiviz
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded-full ${
                              isActive(subItem.path)
                                ? "bg-black/20 text-gray-500 dark:bg-gray-700"
                                : "bg-blue-700/20 text-blue-300 dark:bg-gray-700"
                            }`}
                          >
                            adviz
                          </span>
                        )}                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside 
      className={`fixed mt-16 lg:mt-2 top-0 left-2 rounded-3xl h-screen z-50
        bg-cyan-100  dark:bg-gray-900 border-2 border-blue-700/10 dark:border-gray-700
        transition-all duration-300 ease-in-out shadow-lg
        ${isExpanded || isMobileOpen ? "w-72" : isHovered ? "w-72" : "w-20"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >      <div className={`py-5 m-2 mt-3  flex ${!isExpanded && !isHovered ? "justify-center" : "px-4"}`}>        <button 
          onClick={() => handleNavigation('/', 'Dashboard')}
          onMouseEnter={() => preloadRoute('/')}
          disabled={isItemLoading('/')}
          className={`flex items-center gap-3 transition-all duration-200 ${
            isItemLoading('/') ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"
          }`}
        >
          <div className="relative">
            <Image
              src={logo}
              alt="Logo"
              width={isExpanded || isHovered || isMobileOpen ? 50 : 45}
              height={isExpanded || isHovered || isMobileOpen ? 50 : 45}
              className="transition-all duration-300 dark:brightness-200"
            />
            {isItemLoading('/') && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-full">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="text-xl font-extrablold text-gray-900 dark:text-gray-100 ">
               <Image
            src={logo2}
            alt="Logo2"
            width={isExpanded || isHovered || isMobileOpen ? 200 : 32}
            height={isExpanded || isHovered || isMobileOpen ? 200 : 32}
            className="transition-all duration-300 dark:brightness-200"
          />            </span>
          )}
        </button>
      </div>

      <div className="flex  flex-col h-[calc(100vh-7rem)] overflow-y-auto px-1 py-4 no-scrollbar">
        <nav className="mb-6 rounded-lg bg-orange-25 shadow-xl border-2  border-slate-100 dark:border-slate-700 dark:bg-gray-800 mx-2  py-3 px-3">
          <div>
            <h2
              className={`text-xs font-semibold uppercase tracking-wider 
                text-blue-900 dark:text-gray-500 mb-3 
                ${!isExpanded && !isHovered ? "text-center" : "px-3"}`}
            >
              {isExpanded || isHovered || isMobileOpen ? "Menu" : "•••"}
            </h2>
            {renderMenuItems(filteredNavItems, "main")}
          </div>

          <div>
            <h2
              className={`text-xs font-semibold uppercase tracking-wider 
                text-blue-200 dark:text-gray-500 mb-4 mt-4 
                ${!isExpanded && !isHovered ? "text-center" : "px-3"}`}
            >
              {isExpanded || isHovered || isMobileOpen ? "Others" : "•••"}
            </h2>
            {renderMenuItems(filteredOthersItems, "others")}
          </div>
        </nav>

        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-auto px-3 pb-6">
            <SidebarWidget />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;