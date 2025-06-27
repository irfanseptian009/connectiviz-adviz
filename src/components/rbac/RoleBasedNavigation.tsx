import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserRole } from '../../hooks/useRBAC';

interface NavigationProps {
  className?: string;
  onItemClick?: (path: string) => void;
}

/**
 * Navigation component that renders menu items based on user permissions
 */
export const RoleBasedNavigation: React.FC<NavigationProps> = ({ 
  className = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onItemClick,
}) => {
  const { role } = useUserRole();
  const pathname = usePathname();

  return (
    <nav className={`role-based-navigation ${className}`}>
      <h2>Navigation Menu for {role}</h2>
      <p>Current path: {pathname}</p>
    </nav>
  );
};

/**
 * Simple breadcrumb component that respects permissions
 */
export const PermissionAwareBreadcrumb: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className="breadcrumb">
      <span>Path: {pathname}</span>
    </nav>
  );
};

/**
 * Quick access menu for common actions based on role
 */
export const QuickActionsMenu: React.FC = () => {
  const { isSuperAdmin, isAdmin, isEmployee } = useUserRole();

  const quickActions = [];

  // Only Super Admin can access ConnectiViz management features
  if (isSuperAdmin) {
    quickActions.push(
      { name: 'Create User', path: '/connectiviz/users/create', icon: 'user-plus' },
      { name: 'Manage Divisions', path: '/connectiviz/divisions', icon: 'organization' },
    );
  }

  // Super Admin, Admin, and Employee can access Naruku Dashboard
  if (isSuperAdmin || isAdmin || isEmployee) {
    quickActions.push(
      { name: 'Naruku Dashboard', path: '/naruku/dashboard', icon: 'dashboard' },
    );
  }

  // Only Super Admin can access system settings
  if (isSuperAdmin) {
    quickActions.push(
      { name: 'System Settings', path: '/connectiviz/settings', icon: 'settings' },
      { name: 'Role Management', path: '/connectiviz/rbac', icon: 'shield' },
    );
  }

  // Always show profile for authenticated users
  quickActions.push(
    { name: 'My Profile', path: '/profile/me', icon: 'user' },
  );

  if (quickActions.length === 0) return null;

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions-grid">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            href={action.path}
            className="action-card"
          >
            <span className={`icon ${action.icon}`} />
            <span className="action-name">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
