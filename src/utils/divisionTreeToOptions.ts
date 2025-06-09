export interface DivisionOption {
  id: number;
  name: string;
  label: string;
}

export interface DivisionTree {
  id: number;
  name: string;
  subDivisions?: DivisionTree[];
}

export function divisionTreeToOptions(tree?: DivisionTree[], prefix = ""): DivisionOption[] {
  if (!Array.isArray(tree)) return [];

  let result: DivisionOption[] = [];

  for (const division of tree) {
    result.push({
      id: division.id,
      name: division.name,
      label: prefix + division.name,
    });

    if (Array.isArray(division.subDivisions)) {
      result = result.concat(divisionTreeToOptions(division.subDivisions, prefix + "— "));
    }
  }

  return result;
}
