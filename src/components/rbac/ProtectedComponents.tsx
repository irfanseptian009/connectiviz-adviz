import React from 'react';
import { useHasPermission, useCanAccessApp, useUserRole } from '../../hooks/useRBAC';

interface ProtectedComponentProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}


export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  resource,
  action,
  children,
  fallback = null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadingComponent = <div>Loading...</div>,
}) => {
  const hasPermission = useHasPermission(resource, action);
  


  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface ProtectedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallbackText?: string;
}


export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  resource,
  action,
  children,
  fallbackText = 'Access Denied',
  disabled,
  ...props
}) => {
  const hasPermission = useHasPermission(resource, action);
  
  return (
    <button 
      {...props} 
      disabled={disabled || !hasPermission}
      title={!hasPermission ? fallbackText : undefined}
    >
      {hasPermission ? children : fallbackText}
    </button>
  );
};

interface RoleGateProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}


export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { role } = useUserRole();
  
  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface ApplicationGateProps {
  applicationName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}


export const ApplicationGate: React.FC<ApplicationGateProps> = ({
  applicationName,
  children,
  fallback = <div>Access denied to application: {applicationName}</div>,
}) => {
  const canAccess = useCanAccessApp(applicationName);
  
  if (!canAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export { useHasPermission, useCanAccessApp, useUserRole } from '../../hooks/useRBAC';
