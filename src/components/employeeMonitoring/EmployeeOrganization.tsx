"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchBusinessUnits } from "@/store/businessUnitSlice";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { fetchUsers } from "@/store/userSlice";
import { OrganizationChart as PrimeOrganizationChart } from 'primereact/organizationchart';
import { FiUsers, FiBriefcase, FiGrid, FiUser, FiPhone, FiMail, FiAward } from "react-icons/fi";

import type { User as ImportedUser } from "@/types/employee";
type User = ImportedUser;

interface Division {
  id: number;
  name: string;
  businessUnitId: number;
  parentId?: number | null;
  subDivisions?: Division[];
}

interface OrgChartNode {
  key: string;
  type: 'businessUnit' | 'division' | 'user';
  data: {
    id: number;
    name: string;
    title?: string;
    role?: string;
    jobLevel?: string;
    position?: string;
    email?: string;
    officeEmail?: string;
    username?: string;
    phoneNumber?: string;
    userCount?: number;
    divisionCount?: number;
    subDivisionCount?: number;
  };
  children?: OrgChartNode[];
  expanded?: boolean;
  selectable?: boolean;
}

export default function OrganizationChart() {
  const dispatch = useDispatch<AppDispatch>();

  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);
  const divisionTree = useSelector((state: RootState) => state.division.tree);
  const users = useSelector((state: RootState) => state.user.list);

  const isLoadingBU = useSelector((state: RootState) => state.businessUnit.loading);
  const isLoadingDiv = useSelector((state: RootState) => state.division.loading);
  const isLoadingUsers = useSelector((state: RootState) => state.user.status === "loading");

  // Get status from Redux state
  const userStatus = useSelector((state: RootState) => state.user.status || 'idle');
  const divisionStatus = useSelector((state: RootState) => state.division.status || 'idle');
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<number | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<number | null>(null);
  const [orgData, setOrgData] = useState<OrgChartNode[]>([]);

  useEffect(() => {
    if (businessUnits.length === 0) {
      dispatch(fetchBusinessUnits());
    }
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [businessUnits.length, userStatus, dispatch]);  // Reset selected division when business unit changes
  useEffect(() => {
    setSelectedDivision(null);
  }, [selectedBusinessUnit]);

  useEffect(() => {
    if (businessUnits.length > 0 && divisionStatus === 'idle') {
      businessUnits.forEach((bu) => {
        dispatch(fetchDivisionTree(bu.id));
      });
    }
  }, [businessUnits, divisionStatus, dispatch]);

  // Helper function to get users in a division
  const getUsersInDivision = React.useCallback((divisionId: number): User[] => {
    console.log('Getting users for division ID:', divisionId);
    console.log('All users:', users.length);
    
    const filteredUsers = users.filter((user) => {
      const userDivisionId = user.divisionId;
      const targetDivisionId = Number(divisionId);
      
      console.log(`User ${user.id} (${user.username}): divisionId=${userDivisionId}, target=${targetDivisionId}`);
      
      if (userDivisionId === null || userDivisionId === undefined) {
        return false;
      }
      
      return Number(userDivisionId) === targetDivisionId;
    });
    
    console.log('Filtered users for division', divisionId, ':', filteredUsers);
    return filteredUsers;
  }, [users]);

  // Helper function to get display name for user
  const getUserDisplayName = React.useCallback((user: User): string => {
    if (user.fullName && user.fullName.trim()) {
      return user.fullName;
    }
    if (user.username && user.username.trim()) {
      return user.username;
    }
    return `User #${user.id}`;
  }, []);

  // Helper function to format role display
  const formatRole = (role: string): string => {
    return role.replace('_', ' ');
  };

  // Helper function to get role color
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-500';
      case 'ADMIN':
        return 'bg-orange-500';
      case 'EMPLOYEE':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Helper function to get job level color
  const getJobLevelColor = (jobLevel: string): string => {
    switch (jobLevel?.toLowerCase()) {
      case 'senior':
        return 'text-yellow-300';
      case 'junior':
        return 'text-green-300';
      case 'lead':
      case 'manager':
        return 'text-purple-300';
      default:
        return 'text-blue-300';
    }
  };

  // Helper function to count all subdivisions recursively
  const countAllSubDivisions = React.useCallback((division: Division): number => {
    let count = 0;
    if (division.subDivisions) {
      count = division.subDivisions.length;
      division.subDivisions.forEach(subDiv => {
        count += countAllSubDivisions(subDiv);
      });
    }
    return count;
  }, []);

  // Convert division tree to organization chart format
  const convertDivisionToOrgChart = React.useCallback((division: Division): OrgChartNode => {
    console.log('Converting division:', division);
    const divisionUsers = getUsersInDivision(division.id);
    console.log('Division users for', division.name, ':', divisionUsers);
    const subDivisions = division.subDivisions || [];
    console.log('Sub divisions for', division.name, ':', subDivisions);
    const totalSubDivisionCount = countAllSubDivisions(division);
    
    const userNodes: OrgChartNode[] = divisionUsers.map(user => ({
      key: `user-${user.id}`,
      type: 'user',
      data: {
        id: user.id,
        name: getUserDisplayName(user),
        title: user.position || 'No Position',
        role: user.role,
        jobLevel: user.jobLevel?.toString() || 'Not Specified',
        position: user.position,
        email: user.email,
        officeEmail: user.officeEmail,
        username: user.username,
        phoneNumber: user.phoneNumber || 'Not Available'
      },
      selectable: false
    }));

    const divisionNodes: OrgChartNode[] = subDivisions.map(subDiv => 
      convertDivisionToOrgChart(subDiv)
    );    const result: OrgChartNode = {
      key: `division-${division.id}`,
      type: 'division' as const,
      data: {
        id: division.id,
        name: division.name,
        userCount: divisionUsers.length,
        divisionCount: subDivisions.length,
        subDivisionCount: totalSubDivisionCount
      },
      children: [...divisionNodes, ...userNodes],
      expanded: true,
      selectable: false
    };
    
    console.log('Converted division result:', result);
    return result;
  }, [getUsersInDivision, getUserDisplayName, countAllSubDivisions]);
  // Build organization chart data for selected division
  useEffect(() => {
    console.log('=== EmployeeOrganization Debug ===');
    console.log('selectedBusinessUnit:', selectedBusinessUnit);
    console.log('selectedDivision:', selectedDivision);
    console.log('divisionTree:', divisionTree);
    console.log('divisionTree for selected BU:', divisionTree[selectedBusinessUnit || 0]);
    console.log('users:', users);
    console.log('businessUnits:', businessUnits);
    
    if (selectedBusinessUnit && selectedDivision && divisionTree[selectedBusinessUnit]) {
      const rootDivisions = divisionTree[selectedBusinessUnit] || [];
      console.log('rootDivisions:', rootDivisions);
      
      // Find the selected division from the tree
      const findDivision = (divisions: Division[], targetId: number): Division | null => {
        for (const division of divisions) {
          if (division.id === targetId) {
            return division;
          }
          if (division.subDivisions) {
            const found = findDivision(division.subDivisions, targetId);
            if (found) return found;
          }
        }
        return null;
      };
      
      const selectedDivisionData = findDivision(rootDivisions, selectedDivision);
      if (selectedDivisionData) {
        const orgChartData = [convertDivisionToOrgChart(selectedDivisionData)];
        console.log('orgChartData:', orgChartData);
        setOrgData(orgChartData);
      } else {
        setOrgData([]);
      }
    } else {
      setOrgData([]);
    }
  }, [selectedBusinessUnit, selectedDivision, divisionTree, users, convertDivisionToOrgChart, businessUnits]);

  // Custom node template for organization chart
  const nodeTemplate = (node: OrgChartNode) => {
    if (node.type === 'businessUnit') {
      return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg min-w-64 max-w-80">
          <div className="flex items-center gap-3 mb-3">
            <FiBriefcase size={24} />
            <span className="font-bold text-xl">{node.data.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <FiGrid size={14} />
              <span>{node.data.divisionCount} Divisions</span>
            </div>
            <div className="flex items-center gap-1">
              <FiUsers size={14} />
              <span>{node.data.userCount} Users</span>
            </div>
          </div>
        </div>
      );
    }

    if (node.type === 'division') {
      return (
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-5 rounded-xl shadow-lg min-w-56 max-w-72">
          <div className="flex items-center gap-2 mb-3">
            <FiGrid size={20} />
            <span className="font-bold text-lg">{node.data.name}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <FiUsers size={12} />
              <span>{node.data.userCount} Direct Users</span>
            </div>
            {node.data.subDivisionCount && node.data.subDivisionCount > 0 && (
              <div className="flex items-center gap-2">
                <FiGrid size={12} />
                <span>{node.data.subDivisionCount} Total Sub-divisions</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (node.type === 'user') {
      const roleColor = getRoleColor(node.data.role || 'EMPLOYEE');
      const jobLevelColor = getJobLevelColor(node.data.jobLevel || '');

      return (
        <div className={`${roleColor} text-white p-4 rounded-xl shadow-lg min-w-64 max-w-80`}>
          <div className="flex items-center gap-2 mb-2">
            <FiUser size={16} />
            <span className="font-bold text-base">{node.data.name}</span>
          </div>
          
          <div className="space-y-2 text-sm">
            {/* Position and Job Level */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FiAward size={12} />
                <span className="font-medium">{node.data.position || 'No Position'}</span>
              </div>
              <div className={`text-xs ${jobLevelColor} font-semibold ml-4`}>
                {node.data.jobLevel || 'Level not specified'}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-white/20 pt-2 space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <FiMail size={10} />
                <span className="truncate">{node.data.officeEmail || node.data.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <FiPhone size={10} />
                <span>{node.data.phoneNumber}</span>
              </div>
              <div className="text-xs opacity-75">
                @{node.data.username}
              </div>
            </div>

            {/* Role Badge */}
            <div className="flex justify-end">
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                {formatRole(node.data.role || 'EMPLOYEE')}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return <div>Unknown Node</div>;
  };

  // Loading state
  if (isLoadingBU || isLoadingDiv || isLoadingUsers) {
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
  // Calculate statistics for selected division
  const selectedBU = businessUnits.find(bu => bu.id === selectedBusinessUnit);
  const selectedBUDivisions = selectedBusinessUnit ? divisionTree[selectedBusinessUnit] || [] : [];
  
  // Find selected division data
  const findDivision = (divisions: Division[], targetId: number): Division | null => {
    for (const division of divisions) {
      if (division.id === targetId) {
        return division;
      }
      if (division.subDivisions) {
        const found = findDivision(division.subDivisions, targetId);
        if (found) return found;
      }
    }
    return null;
  };
  
  const selectedDivisionData = selectedDivision ? findDivision(selectedBUDivisions, selectedDivision) : null;
  
  const totalUsers = selectedDivisionData ? 
    (() => {
      const getAllDivisionIds = (division: Division): number[] => {
        let ids: number[] = [division.id];
        if (division.subDivisions) {
          division.subDivisions.forEach(subDiv => {
            ids = ids.concat(getAllDivisionIds(subDiv));
          });
        }
        return ids;
      };
      const divisionIds = getAllDivisionIds(selectedDivisionData);
      return users.filter(user => user.divisionId && divisionIds.includes(user.divisionId)).length;
    })() : 0;

  const totalDivisions = selectedDivisionData ?
    (() => {
      const countDivisions = (division: Division): number => {
        let count = division.subDivisions ? division.subDivisions.length : 0;
        if (division.subDivisions) {
          division.subDivisions.forEach(subDiv => {
            count += countDivisions(subDiv);
          });
        }
        return count;
      };
      return countDivisions(selectedDivisionData);
    })() : 0;

  // Calculate role distribution
  const roleDistribution = selectedDivisionData ? 
    (() => {
      const getAllDivisionIds = (division: Division): number[] => {
        let ids: number[] = [division.id];
        if (division.subDivisions) {
          division.subDivisions.forEach(subDiv => {
            ids = ids.concat(getAllDivisionIds(subDiv));
          });
        }
        return ids;
      };
      const divisionIds = getAllDivisionIds(selectedDivisionData);
      return users.filter(user => user.divisionId && divisionIds.includes(user.divisionId))
        .reduce((acc, user) => {
          const role = user.role || 'EMPLOYEE';
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
    })() : {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Business Unit Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-3">
          <FiBriefcase className="text-blue-600" />
          Organizational Hierarchy Chart
        </h3>
          {/* Business Unit Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Business Unit:
          </label>
          <select
            value={selectedBusinessUnit || ''}
            onChange={(e) => setSelectedBusinessUnit(e.target.value ? Number(e.target.value) : null)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Choose a business unit...</option>
            {businessUnits.map(bu => (
              <option key={bu.id} value={bu.id}>
                {bu.name}
              </option>
            ))}
          </select>
        </div>

        {/* Division Selector */}
        {selectedBusinessUnit && divisionTree[selectedBusinessUnit] && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Division:
            </label>
            <select
              value={selectedDivision || ''}
              onChange={(e) => setSelectedDivision(e.target.value ? Number(e.target.value) : null)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Choose a division...</option>
              {divisionTree[selectedBusinessUnit].map(division => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
        )}        {/* Enhanced Statistics for selected business unit and division */}
        {selectedBU && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <FiBriefcase className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Business Unit</span>
              </div>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400 truncate">{selectedBU.name}</p>
            </div>
            
            {selectedDivisionData && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <FiGrid className="text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Selected Division</span>
                </div>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 truncate">{selectedDivisionData.name}</p>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <FiGrid className="text-green-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {selectedDivisionData ? 'Sub-Divisions' : 'Total Divisions'}
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalDivisions}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <FiUsers className="text-purple-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalUsers}</p>
            </div>

            {Object.keys(roleDistribution).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <FiAward className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Role Distribution</span>
                </div>
                <div className="space-y-1 text-xs">
                  {Object.entries(roleDistribution).map(([role, count]) => (
                    <div key={role} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{formatRole(role)}:</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>      {/* Organization Chart */}
      {selectedBusinessUnit && selectedDivision ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {orgData.length > 0 ? (
            <div className="overflow-auto">
              <PrimeOrganizationChart 
                value={orgData} 
                nodeTemplate={nodeTemplate}
                className="organization-chart"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <FiGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                No Data Found
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                This division doesn&apos;t have any sub-divisions or users yet.
              </p>
            </div>
          )}
        </div>
      ) : selectedBusinessUnit ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="text-center">
            <FiGrid className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
              Select a Division
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a division from the dropdown above to view its detailed organizational hierarchy.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="text-center">
            <FiBriefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
              Select a Business Unit
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a business unit from the dropdown above to view its divisions and organizational hierarchy.
            </p>
          </div>
        </div>
      )}

      {/* Custom CSS for organization chart styling */}
      <style jsx global>{`
        .organization-chart .p-organizationchart-node-content {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
        }
        
        .organization-chart .p-organizationchart-line-down {
          background-color: #e5e7eb;
        }
        
        .organization-chart .p-organizationchart-line-right {
          border-right: 1px solid #e5e7eb;
        }
        
        .organization-chart .p-organizationchart-line-left {
          border-left: 1px solid #e5e7eb;
        }
        
        .organization-chart .p-organizationchart-line-top {
          border-top: 1px solid #e5e7eb;
        }

        .organization-chart .p-organizationchart-node {
          padding: 0.5rem;
        }

        @media (prefers-color-scheme: dark) {
          .organization-chart .p-organizationchart-line-down {
            background-color: #4b5563;
          }
          
          .organization-chart .p-organizationchart-line-right {
            border-right-color: #4b5563;
          }
          
          .organization-chart .p-organizationchart-line-left {
            border-left-color: #4b5563;
          }
          
          .organization-chart .p-organizationchart-line-top {
            border-top-color: #4b5563;
          }
        }
      `}</style>
    </div>
  );
}