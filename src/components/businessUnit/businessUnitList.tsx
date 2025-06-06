"use client";

import React, { useState, useEffect } from "react";
import { useBusinessUnit } from "@/hooks/useBusinessUnit";
import { useDivision } from "@/hooks/useDivision";
import { useEmployee } from "@/hooks/useEmployee";
import { FiChevronRight, FiUsers, FiBriefcase, FiGrid, FiUser } from "react-icons/fi";

// Updated type definitions to match Prisma schema
interface User {
  id: number;
  username: string;
  fullName?: string | null;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
  divisionId?: number | null;
  nationalId?: string | null;
  address?: string | null;
  placeOfBirth?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  phoneNumber?: string | null;
  officeEmail?: string | null;
}

interface Division {
  id: number;
  name: string;
  businessUnitId: number;
  parentId?: number | null;
}



export default function BusinessUnitList() {
  const { list: businessUnits, loading: loadingBU } = useBusinessUnit();
  const { list: divisions, loading: loadingDiv } = useDivision();
  const { list: employees, loading: loadingEmp } = useEmployee();

  // State untuk expand/collapse pada setiap level
  const [openBU, setOpenBU] = useState<number | null>(null);
  const [openDivisions, setOpenDivisions] = useState<Set<number>>(new Set());

  // Debug: Log untuk melihat struktur data
  useEffect(() => {
    console.log("=== DEBUG DATA ===");
    console.log("Loading states:", { loadingBU, loadingDiv, loadingEmp });
    
    if (!loadingBU && businessUnits.length > 0) {
      console.log("Business Units:", businessUnits);
    }
    
    if (!loadingDiv && divisions.length > 0) {
      console.log("Divisions:", divisions);
      console.log("Division IDs:", divisions.map(d => ({ 
        id: d.id, 
        name: d.name, 
        businessUnitId: d.businessUnitId,
        parentId: d.parentId 
      })));
    }
    
    if (!loadingEmp) {
      console.log("Users/Employees:", employees);
      console.log("Users count:", employees.length);
      if (employees.length > 0) {
        console.log("User sample:", employees[0]);
        console.log("User divisionIds:", employees.map(e => ({ 
          id: e.id, 
          username: e.username, 
          fullName: e.fullName,
          divisionId: e.divisionId,
          divisionIdType: typeof e.divisionId
        })));
      }
    }
    
    // Check mapping between divisions and users
    if (!loadingDiv && !loadingEmp && divisions.length > 0 && employees.length > 0) {
      console.log("=== DIVISION-USER MAPPING ===");
      divisions.forEach(div => {
        const usersInDiv = employees.filter(user => 
          user.divisionId !== null && 
          user.divisionId !== undefined && 
          Number(user.divisionId) === Number(div.id)
        );
        console.log(`Division ${div.id} (${div.name}):`, usersInDiv.length, "users", usersInDiv.map(u => ({ id: u.id, username: u.username, fullName: u.fullName })));
      });
    }
  }, [businessUnits, divisions, employees, loadingBU, loadingDiv, loadingEmp]);

  // Helper function untuk toggle division
  const toggleDivision = (divisionId: number) => {
    const newOpenDivisions = new Set(openDivisions);
    if (newOpenDivisions.has(divisionId)) {
      newOpenDivisions.delete(divisionId);
    } else {
      newOpenDivisions.add(divisionId);
    }
    setOpenDivisions(newOpenDivisions);
  };

  // Helper function untuk mendapatkan subdivisions
  const getSubDivisions = (parentId: number) => {
    return divisions.filter((div) => div.parentId === parentId);
  };

  // Helper function untuk mendapatkan root divisions (tidak punya parent)
  const getRootDivisions = (businessUnitId: number) => {
    return divisions.filter((div) => 
      div.businessUnitId === businessUnitId && 
      (div.parentId === null || div.parentId === undefined)
    );
  };

  // Helper function untuk mendapatkan users dalam division - FIXED
  const getUsersInDivision = (divisionId: number): User[] => {
    console.log(`Looking for users in division ${divisionId}`);
    const usersInDiv = employees.filter((user) => {
      // Convert both to numbers for proper comparison
      const userDivisionId = user.divisionId;
      const targetDivisionId = Number(divisionId);
      
      if (userDivisionId === null || userDivisionId === undefined) {
        return false;
      }
      
      return Number(userDivisionId) === targetDivisionId;
    });
    
    console.log(`Found ${usersInDiv.length} users in division ${divisionId}:`, 
      usersInDiv.map(u => ({ id: u.id, username: u.username, fullName: u.fullName })));
    return usersInDiv;
  };

  // Helper function untuk menghitung total users secara rekursif
  const getTotalUsersRecursive = (divisionId: number): number => {
    const directUsers = getUsersInDivision(divisionId).length;
    const subDivisions = getSubDivisions(divisionId);
    const subDivisionUsers = subDivisions.reduce((total, subDiv) => {
      return total + getTotalUsersRecursive(subDiv.id);
    }, 0);
    return directUsers + subDivisionUsers;
  };

  // Function untuk mendapatkan nama yang akan ditampilkan
  const getUserDisplayName = (user: User): string => {
    // Prioritas: fullName -> username -> fallback
    if (user.fullName && user.fullName.trim()) {
      return user.fullName;
    }
    if (user.username && user.username.trim()) {
      return user.username;
    }
    return `User #${user.id}`;
  };

  // Function untuk mendapatkan inisial nama
  const getUserInitial = (user: User): string => {
    const displayName = getUserDisplayName(user);
    return displayName.charAt(0).toUpperCase();
  };

  // Function untuk format role display
  const formatRole = (role: string): string => {
    return role.replace('_', ' ');
  };

  // Recursive component untuk render division tree
  const renderDivisionTree = (division: Division, level: number = 0) => {
    const subDivisions = getSubDivisions(division.id);
    const directUsers = getUsersInDivision(division.id);
    const totalUsers = getTotalUsersRecursive(division.id);
    const isOpen = openDivisions.has(division.id);
    const hasChildren = subDivisions.length > 0 || directUsers.length > 0;

    const marginLeft = level * 6; // 24px per level (ml-6)

    return (
      <li key={division.id}>
        <div
          className={`flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-800/30 transition-all duration-200 rounded-lg mx-2`}
          style={{ marginLeft: `${marginLeft * 4}px` }}
          onClick={() => hasChildren && toggleDivision(division.id)}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <FiChevronRight
                className={`transition-transform duration-200 text-gray-400 ${
                  isOpen ? "rotate-90 text-green-500" : ""
                }`}
                size={16}
              />
            ) : (
              <div className="w-4 h-4" />
            )}
            <FiGrid className={`${
              level === 0 ? 'text-green-500' : 
              level === 1 ? 'text-orange-500' : 
              'text-purple-500'
            }`} size={16} />
            <div>
              <span className={`font-medium ${
                level === 0 ? 'text-green-700 dark:text-green-300' : 
                level === 1 ? 'text-orange-700 dark:text-orange-300' : 
                'text-purple-700 dark:text-purple-300'
              }`}>
                {division.name}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subDivisions.length > 0 && `${subDivisions.length} subdivision${subDivisions.length !== 1 ? 's' : ''}`}
                {subDivisions.length > 0 && directUsers.length > 0 && ' • '}
                {directUsers.length > 0 && `${directUsers.length} direct user${directUsers.length !== 1 ? 's' : ''}`}
                {totalUsers > directUsers.length && ` • ${totalUsers} total`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {subDivisions.length > 0 && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                level === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                level === 1 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' :
                'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
              }`}>
                {subDivisions.length} sub
              </span>
            )}
            {totalUsers > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                {totalUsers} user{totalUsers !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Render subdivisions and users */}
        {isOpen && hasChildren && (
          <div>
            {/* Render subdivisions first */}
            {subDivisions.length > 0 && (
              <ul className="space-y-1">
                {subDivisions.map((subDiv) => renderDivisionTree(subDiv, level + 1))}
              </ul>
            )}
            
            {/* Render direct users */}
            {directUsers.length > 0 && (
              <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mx-2 mt-2`}
                   style={{ marginLeft: `${(level + 1) * 24}px` }}>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    👥 {directUsers.length} User{directUsers.length !== 1 ? 's' : ''} in {division.name}
                  </span>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {directUsers.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          user.role === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                          user.role === 'ADMIN' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                          'bg-gradient-to-br from-blue-400 to-purple-500'
                        }`}>
                          <span className="text-white text-xs font-semibold">
                            {getUserInitial(user)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {getUserDisplayName(user)}
                          </p>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                            user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                            user.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                          }`}>
                            {formatRole(user.role)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          @{user.username} • {user.email}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.phoneNumber && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              📞 {user.phoneNumber}
                            </span>
                          )}
                          {user.officeEmail && user.officeEmail !== user.email && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              📧 {user.officeEmail}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Division ID: {user.divisionId} | User ID: {user.id}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <FiUser className="text-gray-400" size={16} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </li>
    );
  };

  // Loading state
  if (loadingBU || loadingDiv || loadingEmp) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading organizational structure...</p>
      </div>
    );
  }

  // Empty state
  if (businessUnits.length === 0) {
    return (
      <div className="text-center py-16">
        <FiBriefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
          No Business Units Found
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first business unit to get started.
        </p>
      </div>
    );
  }

  // Calculate total statistics
  const totalDivisions = divisions.length;
  const totalUsers = employees.length;
  const assignedUsers = employees.filter(user => 
    user.divisionId !== null && user.divisionId !== undefined
  ).length;
  const unassignedUsers = totalUsers - assignedUsers;

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
        <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white flex items-center gap-3">
          <FiBriefcase className="text-blue-600" />
          Organizational Structure
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FiBriefcase className="text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Business Units</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{businessUnits.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FiGrid className="text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Divisions</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalDivisions}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FiUsers className="text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalUsers}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FiUser className="text-orange-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Unassigned</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{unassignedUsers}</p>
          </div>
        </div>
      </div>

      {/* Business Units List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {businessUnits.map((bu, index) => {
            const rootDivisions = getRootDivisions(bu.id);
            const totalBUUsers = divisions
              .filter(div => div.businessUnitId === bu.id)
              .reduce((total, div) => total + getTotalUsersRecursive(div.id), 0);

            return (
              <li key={bu.id} className={index === 0 ? "" : "border-t border-gray-200 dark:border-gray-700"}>
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  onClick={() => setOpenBU(openBU === bu.id ? null : bu.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <FiChevronRight
                        className={`transition-transform duration-200 text-gray-400 ${
                          openBU === bu.id ? "rotate-90 text-blue-500" : ""
                        }`}
                        size={20}
                      />
                      <FiBriefcase className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {bu.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {rootDivisions.length} division{rootDivisions.length !== 1 ? 's' : ''} • {totalBUUsers} user{totalBUUsers !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                      {rootDivisions.length} division{rootDivisions.length !== 1 ? 's' : ''}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                      {totalBUUsers} user{totalBUUsers !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Division Tree */}
                {openBU === bu.id && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 pb-4">
                    {rootDivisions.length === 0 ? (
                      <div className="p-6 text-center">
                        <FiGrid className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No divisions in this business unit
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-1 pt-2">
                        {rootDivisions.map((division) => renderDivisionTree(division, 0))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Unassigned Users Section */}
      {unassignedUsers > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-200 dark:border-orange-700 overflow-hidden">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 border-b border-orange-200 dark:border-orange-700">
            <h4 className="font-semibold text-lg text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <FiUser className="text-orange-600" />
              Unassigned Users ({unassignedUsers})
            </h4>
            <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
              Users that haven&apos;t been assigned to any division
            </p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees
                .filter(user => user.divisionId === null || user.divisionId === undefined)
                .map(user => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                        user.role === 'ADMIN' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        'bg-gradient-to-br from-blue-400 to-purple-500'
                      }`}>
                        <span className="text-white text-sm font-semibold">
                          {getUserInitial(user)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {getUserDisplayName(user)}
                        </p>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                          user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                          user.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                        }`}>
                          {formatRole(user.role)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{user.username} • {user.email}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        User ID: {user.id}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}