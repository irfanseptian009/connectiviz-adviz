import { User } from '@/types/employee';

interface OrgChartNode {
  label: string;
  expanded?: boolean;
  data?: User;
  children?: OrgChartNode[];
}

export const buildOrgChartData = (users: User[]): OrgChartNode => {
  const divisionMap: Record<number, OrgChartNode> = {};

  users.forEach(user => {
    const divisionId = user.divisionId;
    if (divisionId) {
      if (!divisionMap[divisionId]) {
        divisionMap[divisionId] = {
          label: String(divisionId),
          expanded: true,
          children: [],
        };
      }
      divisionMap[divisionId].children?.push({
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
