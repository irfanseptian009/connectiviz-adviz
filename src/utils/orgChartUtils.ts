import { User } from '@/types/employee';

interface OrgChartNode {
  label: string;
  expanded?: boolean;
  data?: User;
  children?: OrgChartNode[];
}

// Helper: group users by division
export const buildOrgChartData = (users: User[]): OrgChartNode => {
  const divisionMap: Record<number, OrgChartNode> = {};

  users.forEach(user => {
    const division = user.division;
    if (division) {
      if (!divisionMap[division.id]) {
        divisionMap[division.id] = {
          label: division.name,
          expanded: true,
          children: [],
        };
      }
      divisionMap[division.id].children?.push({
        label: user.fullName || user.username,
        data: user,
      });
    }
  });

  return {
    label: 'Organization Structure',
    expanded: true,
    children: Object.values(divisionMap),
  };
};
