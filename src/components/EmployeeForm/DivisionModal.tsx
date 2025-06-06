import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { divisionTreeToOptions } from "@/utils/divisionTreeToOptions";
import { toast } from "react-hot-toast";
import type { AppDispatch } from "@/store";

interface DivisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessUnits: { id: number; name: string }[];
  onCreate: (name: string, businessUnitId: number, parentId: number) => void;
}

const DivisionModal: React.FC<DivisionModalProps> = ({
  open,
  onOpenChange,
  businessUnits,
  onCreate,
}) => {
  const dispatch = useDispatch<AppDispatch>();;
  const [name, setName] = useState("");
  const [businessUnitId, setBusinessUnitId] = useState("");
  const [parentId, setParentId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch division tree sesuai businessUnit yang dipilih
  useEffect(() => {
    if (open && businessUnitId) {
      dispatch(fetchDivisionTree(Number(businessUnitId)));
    }
  }, [open, businessUnitId, dispatch]);

  const divisionTree = useSelector((state: RootState) => state.division.tree);
  const parentDivisionOptions = divisionTreeToOptions(divisionTree);

  const handleCreate = async () => {
    if (!name || !businessUnitId) return;
    setLoading(true);
    try {
      await onCreate(name, Number(businessUnitId), parentId ? Number(parentId) : -1);
      toast.success("Division created!");
      setName("");
      setBusinessUnitId("");
      setParentId("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Division</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Division Name" autoFocus />

          <Label>Business Unit</Label>
          <Select value={businessUnitId} onValueChange={setBusinessUnitId}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select Business Unit" /></SelectTrigger>
            <SelectContent>
              {businessUnits.map((bu) => (
                <SelectItem key={bu.id} value={String(bu.id)}>{bu.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {businessUnitId && (
            <>
              <Label>Parent Division (optional, hierarchical)</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger className="w-full"><SelectValue placeholder="No Parent" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">None</SelectItem>
                  {parentDivisionOptions.map(opt => (
                    <SelectItem key={opt.id} value={String(opt.id)}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
          <Button onClick={handleCreate} disabled={!name || !businessUnitId || loading} type="button">
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DivisionModal;
