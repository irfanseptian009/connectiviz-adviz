import { useAuth } from '@/context/AuthContext';


export const useUserRole = () => {
  const { user, isSuperAdmin, isAdmin, isEmployee } = useAuth();
  
  return {
    role: user?.role || 'EMPLOYEE',
    isSuperAdmin: isSuperAdmin(),
    isAdmin: isAdmin(),
    isEmployee: isEmployee(),
    canManageUsers: isSuperAdmin(),
    canAccessConnectiViz: isSuperAdmin(),
  };
};


export const useNavigation = () => {
  return {
    data: null,
    isLoading: false,
    error: null
  };
};


export const useHasPermission = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resource: string, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action: string
) => {
  const { isSuperAdmin } = useAuth();
  
  return isSuperAdmin();
};


export const useCanAccessApp = (applicationName: string) => {
  const { isSuperAdmin, isAdmin, isEmployee } = useAuth();
  
  if (applicationName.toLowerCase() === 'naruku') {
    return isSuperAdmin() || isAdmin() || isEmployee();
  }
  
  return isSuperAdmin();
};
