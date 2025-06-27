"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null
}) => {
  const { user, canAccess } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const hasAccess = canAccess(allowedRoles);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Specific role guards for convenience
export const SuperAdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleGuard allowedRoles={['SUPER_ADMIN']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMIN']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const EmployeeAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Hook for role checking in components
export const useRoleCheck = () => {
  const { user, isSuperAdmin, isAdmin, isEmployee, hasRole, canAccess } = useAuth();
  
  return {
    user,
    isSuperAdmin,
    isAdmin,
    isEmployee,
    hasRole,
    canAccess,
    // Convenience methods - Only Super Admin can manage employees
    canCreateEmployee: () => canAccess(['SUPER_ADMIN']),
    canEditEmployee: () => canAccess(['SUPER_ADMIN']),
    canDeleteEmployee: () => canAccess(['SUPER_ADMIN']),
    canViewEmployeeList: () => canAccess(['SUPER_ADMIN']),
    canAccessBusinessUnits: () => canAccess(['SUPER_ADMIN']),
    canAccessAnalytics: () => canAccess(['SUPER_ADMIN']),
    // Application access - Super Admin, Admin, and Employee can access Naruku
    canAccessNaruku: () => canAccess(['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE']),
  };
};
