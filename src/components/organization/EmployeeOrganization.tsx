"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchBusinessUnits } from "@/store/businessUnitSlice";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { fetchUsers } from "@/store/userSlice";
import { OrganizationChart as PrimeOrganizationChart } from 'primereact/organizationchart';
import { FiUsers, FiBriefcase, FiGrid, FiUser } from "react-icons/fi";

interface User {
  id: number;
  username: string;
  fullName?: string | null;
  email: string;
  position: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
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
  subDivisions?: Division[];
}



interface OrgChartNode {
  key: string;
  type: 'businessUnit' | 'division' | 'user';
  data: {
    id: number;
    name: string;
    title?: string;
    position?: string;
    email?: string;
    username?: string;
    userCount?: number;
    divisionCount?: number;
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
  const isLoadingUsers = useSelector((state: RootState) => state.user.loading);

  // Get status from Redux state
  const userStatus = useSelector((state: RootState) => state.user.status || 'idle');
  const divisionStatus = useSelector((state: RootState) => state.division.status || 'idle');

  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<number | null>(null);
  const [orgData, setOrgData] = useState<OrgChartNode[]>([]);

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

  // Helper function to get users in a division
  const getUsersInDivision = (divisionId: number): User[] => {
    return users.filter((user) => {
      const userDivisionId = user.divisionId;
      const targetDivisionId = Number(divisionId);
      
      if (userDivisionId === null || userDivisionId === undefined) {
        return false;
      }
      
      return Number(userDivisionId) === targetDivisionId;
    });
  };

  // Helper function to get display name for user
  const getUserDisplayName = (user: User): string => {
    if (user.fullName && user.fullName.trim()) {
      return user.fullName;
    }
    if (user.username && user.username.trim()) {
      return user.username;
    }
    return `User #${user.id}`;
  };

  // Helper function to format position display
  const formatRole = (position: string): string => {
    return position.replace('_', ' ');
  };

  // Convert division tree to organization chart format
  const convertDivisionToOrgChart = (division: Division): OrgChartNode => {
    const divisionUsers = getUsersInDivision(division.id);
    const subDivisions = division.subDivisions || [];
    
    const userNodes: OrgChartNode[] = divisionUsers.map(user => ({
      key: `user-${user.id}`,
      type: 'user',
      data: {
        id: user.id,
        name: getUserDisplayName(user),
        title: formatRole(user.position),
        position: user.position,
        email: user.email,
        username: user.username
      },
      selectable: false
    }));

    const divisionNodes: OrgChartNode[] = subDivisions.map(subDiv => 
      convertDivisionToOrgChart(subDiv)
    );

    return {
      key: `division-${division.id}`,
      type: 'division',
      data: {
        id: division.id,
        name: division.name,
        userCount: divisionUsers.length,
        divisionCount: subDivisions.length
      },
      children: [...divisionNodes, ...userNodes],
      expanded: true,
      selectable: false
    };
  };

  // Build organization chart data for selected business unit
  useEffect(() => {
    if (selectedBusinessUnit && divisionTree[selectedBusinessUnit]) {
      const rootDivisions = divisionTree[selectedBusinessUnit] || [];
      const orgChartData = rootDivisions.map(division => convertDivisionToOrgChart(division));
      setOrgData(orgChartData);
    } else {
      setOrgData([]);
    }
  }, [selectedBusinessUnit, divisionTree, users]);

  // Custom node template for organization chart
  const nodeTemplate = (node: OrgChartNode) => {
    if (node.type === 'businessUnit') {
      return (
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg min-w-48">
          <div className="flex items-center gap-2 mb-2">
            <FiBriefcase size={20} />
            <span className="font-bold text-lg">{node.data.name}</span>
          </div>
          <div className="text-sm opacity-90">
            {node.data.divisionCount} Divisions • {node.data.userCount} Users
          </div>
        </div>
      );
    }

    if (node.type === 'division') {
      return (
        <div className="bg-green-500 text-white p-3 rounded-lg shadow-md min-w-44">
          <div className="flex items-center gap-2 mb-1">
            <FiGrid size={16} />
            <span className="font-semibold">{node.data.name}</span>
          </div>
          <div className="text-xs opacity-90">
            {node.data.userCount} Users
            {node.data.divisionCount && node.data.divisionCount > 0 && ` • ${node.data.divisionCount} Sub-divisions`}
          </div>
        </div>
      );
    }

    if (node.type === 'user') {
      const roleColor = 
        node.data.position === 'SUPER_ADMIN' ? 'bg-red-500' :
        node.data.position === 'ADMIN' ? 'bg-orange-500' :
        'bg-purple-500';

      return (
        <div className={`${roleColor} text-white p-3 rounded-lg shadow-md min-w-40`}>
          <div className="flex items-center gap-2 mb-1">
            <FiUser size={14} />
            <span className="font-medium text-sm">{node.data.name}</span>
          </div>
          <div className="text-xs opacity-90">
            {node.data.title}
          </div>
          <div className="text-xs opacity-75 mt-1">
            @{node.data.username}
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

  // Calculate statistics for selected business unit
  const selectedBU = businessUnits.find(bu => bu.id === selectedBusinessUnit);
  const selectedBUDivisions = selectedBusinessUnit ? divisionTree[selectedBusinessUnit] || [] : [];
  const totalUsers = selectedBusinessUnit ? 
    users.filter(user => {
      const getAllDivisionIds = (divisions: Division[]): number[] => {
        let ids: number[] = [];
        divisions.forEach(div => {
          ids.push(div.id);
          if (div.subDivisions) {
            ids = ids.concat(getAllDivisionIds(div.subDivisions));
          }
        });
        return ids;
      };
      const divisionIds = getAllDivisionIds(selectedBUDivisions);
      return user.divisionId && divisionIds.includes(user.divisionId);
    }).length : 0;

  const totalDivisions = selectedBusinessUnit ?
    (() => {
      const countDivisions = (divisions: Division[]): number => {
        let count = divisions.length;
        divisions.forEach(div => {
          if (div.subDivisions) {
            count += countDivisions(div.subDivisions);
          }
        });
        return count;
      };
      return countDivisions(selectedBUDivisions);
    })() : 0;

  return (
    <div className="space-y-6">
      {/* Header with Business Unit Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-3">
          <FiBriefcase className="text-blue-600" />
          Organization Chart
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

        {/* Statistics for selected business unit */}
        {selectedBU && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <FiBriefcase className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Business Unit</span>
              </div>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedBU.name}</p>
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
          </div>
        )}
      </div>

      {/* Organization Chart */}
      {selectedBusinessUnit ? (
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
                No Divisions Found
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                This business unit doesn't have any divisions yet.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="text-center">
            <FiBriefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
              Select a Business Unit
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a business unit from the dropdown above to view its organizational structure.
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

