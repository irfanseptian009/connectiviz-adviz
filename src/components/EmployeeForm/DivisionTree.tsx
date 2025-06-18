import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { AppDispatch } from "@/store";

interface DivisionNode {
  id: number;
  name: string;
  parentId?: number | null;
  subDivisions?: DivisionNode[];
}

interface Props {
  businessUnitId: number;
}

const DivisionTree: React.FC<Props> = ({ businessUnitId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tree = useSelector((state: RootState) => state.division.tree);

  useEffect(() => {
    dispatch(fetchDivisionTree(businessUnitId));
  }, [businessUnitId, dispatch]);

  const divisionList = tree[businessUnitId] ?? [];

  return (
    <div className="ml-2">
      {divisionList.length === 0 ? (
        <span className="text-muted-foreground text-sm">No division.</span>
      ) : (
        <ul>
          {divisionList.map((node) => (
            <DivisionTreeNode node={node} key={node.id} />
          ))}
        </ul>
      )}
    </div>
  );
};

const DivisionTreeNode: React.FC<{ node: DivisionNode }> = ({ node }) => {
  const [open, setOpen] = React.useState(false);
  const hasChildren = node.subDivisions && node.subDivisions.length > 0;

  return (
    <li className="my-1">
      <div className="flex items-center gap-1">
        {hasChildren && (
          <button type="button" className="p-1" onClick={() => setOpen((v) => !v)}>
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        <span>{node.name}</span>
      </div>
      {hasChildren && open && (
        <ul className="ml-5 border-l border-muted pl-2">
          {node.subDivisions!.map((child) => (
            <DivisionTreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default DivisionTree;
