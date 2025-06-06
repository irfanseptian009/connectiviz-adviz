export interface DivisionOption {
  id: number;
  name: string;
  label: string;
}

interface DivisionTree {
  id: number;
  name: string;
  subDivisions?: DivisionTree[];
}

export function divisionTreeToOptions(tree: DivisionTree[], prefix = ""): DivisionOption[] {
  let result: DivisionOption[] = [];
  for (const div of tree) {
    result.push({
      id: div.id,
      name: div.name,
      label: prefix + div.name,
    });
    if (div.subDivisions && div.subDivisions.length > 0) {
      result = result.concat(divisionTreeToOptions(div.subDivisions, prefix + "— "));
    }
  }
  return result;
}
