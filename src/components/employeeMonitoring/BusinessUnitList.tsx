"use client";

import React, { useState, useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchBusinessUnits } from "@/store/businessUnitSlice";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { fetchUsers } from "@/store/userSlice";
import { FiChevronRight, FiUsers, FiBriefcase, FiGrid, FiUser } from "react-icons/fi";

import { User as ImportedUser } from '@/types/employee';

type User = ImportedUser & {
  role: NonNullable<ImportedUser['role']>;
};

interface Division {
  id: number;
  name: string;
  businessUnitId: number;
  parentId?: number | null;
  subDivisions?: Division[];
}



const ROLE_COLORS = {
  SUPER_ADMIN: {
    gradient: 'bg-gradient-to-br from-red-400 to-red-600',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
  },
  ADMIN: {
    gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
  },
  EMPLOYEE: {
    gradient: 'bg-gradient-to-br from-blue-400 to-purple-500',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
  }
} as const;

const LEVEL_COLORS = {
  0: {
    text: 'text-green-700 dark:text-green-300',
    icon: 'text-green-500',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
  },
  1: {
    text: 'text-orange-700 dark:text-orange-300',
    icon: 'text-orange-500',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
  },
  default: {
    text: 'text-purple-700 dark:text-purple-300',
    icon: 'text-purple-500',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
  }
} as const;

const BusinessUnitList: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);
  const divisionTree = useSelector((state: RootState) => state.division.tree);
  const users = useSelector((state: RootState) => state.user.list);
  
  const isLoadingBU = useSelector((state: RootState) => state.businessUnit.loading);
  const isLoadingDiv = useSelector((state: RootState) => state.division.loading);
  const isLoadingUsers = useSelector((state: RootState) => state.user.status === 'loading');
  
  const userStatus = useSelector((state: RootState) => state.user.status || 'idle');
  const divisionStatus = useSelector((state: RootState) => state.division.status || 'idle');

  const [openBU, setOpenBU] = useState<number | null>(null);
  const [openDivisions, setOpenDivisions] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (businessUnits.length === 0) {
      dispatch(fetchBusinessUnits());
    }
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [businessUnits.length, userStatus, dispatch]);

  useEffect(() => {
    if (businessUnits.length > 0 && divisionStatus === 'idle') {
      businessUnits.forEach((bu) => {
        dispatch(fetchDivisionTree(bu.id));
      });
    }
  }, [businessUnits, divisionStatus, dispatch]);

  const toggleDivision = (divisionId: number): void => {
    const newOpenDivisions = new Set(openDivisions);
    if (newOpenDivisions.has(divisionId)) {
      newOpenDivisions.delete(divisionId);
    } else {
      newOpenDivisions.add(divisionId);
    }
    setOpenDivisions(newOpenDivisions);
  };

  const getAllDivisions = (): Division[] => {
    const allDivisions: Division[] = [];
    
    const flattenDivisions = (divisions: Division[]): Division[] => {
      let result: Division[] = [];
      divisions.forEach(division => {
        result.push(division);
        if (division.subDivisions && division.subDivisions.length > 0) {
          result = result.concat(flattenDivisions(division.subDivisions));
        }
      });
      return result;
    };

    Object.values(divisionTree).forEach((businessUnitDivisions) => {
      allDivisions.push(...flattenDivisions(businessUnitDivisions));
    });
    
    return allDivisions;
  };

  const getRootDivisions = (businessUnitId: number): Division[] => {
    return divisionTree[businessUnitId] || [];
  };

  const getUsersInDivision = (divisionId: number): User[] => {
    return users.filter((user): user is User => {
      if (!user.role) return false;
      const userDivisionId = user.divisionId;
      const targetDivisionId = Number(divisionId);
      
      if (userDivisionId === null || userDivisionId === undefined) {
        return false;
      }
      
      return Number(userDivisionId) === targetDivisionId;
    });
  };

  const getTotalUsersRecursive = (divisionId: number): number => {
    const directUsers = getUsersInDivision(divisionId).length;
    const allDivisions = getAllDivisions();
    const division = allDivisions.find(d => d.id === divisionId);
    
    if (!division || !division.subDivisions) {
      return directUsers;
    }
    
    const subDivisionUsers = division.subDivisions.reduce((total, subDiv) => {
      return total + getTotalUsersRecursive(subDiv.id);
    }, 0);
    
    return directUsers + subDivisionUsers;
  };

  const getUserDisplayName = (user: User): string => {
    if (user.fullName && user.fullName.trim()) {
      return user.fullName;
    }
    if (user.username && user.username.trim()) {
      return user.username;
    }
    return `User #${user.id}`;
  };

  const getUserInitial = (user: User): string => {
    const displayName = getUserDisplayName(user);
    return displayName.charAt(0).toUpperCase();
  };

  const formatRole = (role: string): string => {
    return role.replace('_', ' ');
  };

  const getLevelColors = (level: number) => {
    if (level === 0) return LEVEL_COLORS[0];
    if (level === 1) return LEVEL_COLORS[1];
    return LEVEL_COLORS.default;
  };

  const getRoleColors = (role: User['role']) => {
    return ROLE_COLORS[role];
  };

  // Components
  const StatCard: FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
  }> = ({ icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  const UserCard: FC<{ user: User; showDivisionInfo?: boolean }> = ({ 
    user, 
    showDivisionInfo = false 
  }) => {
    const roleColors = getRoleColors(user.role);
    
    return (
      <li className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${roleColors.gradient}`}>
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
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${roleColors.badge}`}>
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
          {showDivisionInfo && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Division ID: {user.divisionId} | User ID: {user.id}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <FiUser className="text-gray-400" size={16} />
        </div>
      </li>
    );
  };

  const renderDivisionTree = (division: Division, level: number = 0): React.ReactNode => {
    const subDivisions = division.subDivisions || [];
    const directUsers = getUsersInDivision(division.id);
    const totalUsers = getTotalUsersRecursive(division.id);
    const isOpen = openDivisions.has(division.id);
    const hasChildren = subDivisions.length > 0 || directUsers.length > 0;
    const colors = getLevelColors(level);
    const marginLeft = level * 24;

    return (
      <li key={division.id}>
        <div
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-800/30 transition-all duration-200 rounded-lg mx-2"
          style={{ marginLeft: `${marginLeft}px` }}
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
            <FiGrid className={colors.icon} size={16} />
            <div>
              <span className={`font-medium ${colors.text}`}>
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
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
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

        {isOpen && hasChildren && (
          <div>
            {subDivisions.length > 0 && (
              <ul className="space-y-1">
                {subDivisions.map((subDiv) => renderDivisionTree(subDiv, level + 1))}
              </ul>
            )}
            
            {directUsers.length > 0 && (
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mx-2 mt-2"
                style={{ marginLeft: `${(level + 1) * 24}px` }}
              >
                <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    👥 {directUsers.length} User{directUsers.length !== 1 ? 's' : ''} in {division.name}
                  </span>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {directUsers.map((user) => (
                    <UserCard key={user.id} user={user} showDivisionInfo />
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
  if (isLoadingBU || isLoadingDiv || isLoadingUsers) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading organizational structure...
        </p>
      </div>
    );
  }

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

  // Calculate statistics
  const allDivisions = getAllDivisions();
  const totalDivisions = allDivisions.length;
  const totalUsers = users.length;
  const assignedUsers = users.filter(user => 
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
          <StatCard
            icon={<FiBriefcase className="text-blue-500" />}
            label="Business Units"
            value={businessUnits.length}
            color="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={<FiGrid className="text-green-500" />}
            label="Divisions"
            value={totalDivisions}
            color="text-green-600 dark:text-green-400"
          />
          <StatCard
            icon={<FiUsers className="text-purple-500" />}
            label="Total Users"
            value={totalUsers}
            color="text-purple-600 dark:text-purple-400"
          />
          <StatCard
            icon={<FiUser className="text-orange-500" />}
            label="Unassigned"
            value={unassignedUsers}
            color="text-orange-600 dark:text-orange-400"
          />
        </div>
      </div>

      {/* Business Units List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {businessUnits.map((bu, index) => {
            const rootDivisions = getRootDivisions(bu.id);
            const businessUnitDivisions = divisionTree[bu.id] || [];
            const totalBUUsers = businessUnitDivisions.reduce((total, div) => {
              return total + getTotalUsersRecursive(div.id);
            }, 0);

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
              {users
                .filter((user): user is User => {
                  if (!user.role) return false;
                  return user.divisionId === null || user.divisionId === undefined;
                })
                .map(user => {
                  const roleColors = getRoleColors(user.role);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleColors.gradient}`}>
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
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${roleColors.badge}`}>
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
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessUnitList;