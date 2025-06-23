"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { RootState, AppDispatch } from "@/store";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { divisionTreeToOptions } from "@/utils/divisionTreeToOptions";

interface DivisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessUnits: { id: number; name: string }[];
  onCreate: (name: string, businessUnitId: number, parentId?: number) => Promise<void>;
}

export function DivisionModal({ 
  open, 
  onOpenChange, 
  businessUnits, 
  onCreate 
}: DivisionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [businessUnitId, setBusinessUnitId] = useState("");
  const [parentId, setParentId] = useState("");
  const [loading, setLoading] = useState(false);

  const divisionTree = useSelector((state: RootState) => 
    businessUnitId ? state.division.tree[Number(businessUnitId)] || [] : []
  );
  
  const parentDivisionOptions = divisionTreeToOptions(divisionTree);

  useEffect(() => {
    if (businessUnitId) {
      dispatch(fetchDivisionTree(Number(businessUnitId)));
    }
  }, [dispatch, businessUnitId]);

  const handleCreate = async () => {
    if (!name.trim() || !businessUnitId) return;
    
    setLoading(true);
    try {
      const parentIdNumber = parentId && parentId !== "-" ? Number(parentId) : undefined;
      await onCreate(name.trim(), Number(businessUnitId), parentIdNumber);
      
      // Reset form
      setName("");
      setBusinessUnitId("");
      setParentId("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating division:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setBusinessUnitId("");
    setParentId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Division</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="divisionName">Name</Label>
            <Input
              id="divisionName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Division Name"
              autoFocus
            />
          </div>
          
          <div>
            <Label htmlFor="businessUnit">Business Unit</Label>
            <Select value={businessUnitId} onValueChange={setBusinessUnitId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Business Unit" />
              </SelectTrigger>
              <SelectContent>
                {businessUnits.map((bu) => (
                  <SelectItem key={bu.id} value={String(bu.id)}>
                    {bu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {businessUnitId && (
            <div>
              <Label htmlFor="parentDivision">Parent Division (optional)</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No Parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">None</SelectItem>
                  {parentDivisionOptions.map((opt) => (
                    <SelectItem key={opt.id} value={String(opt.id)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            type="button"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!name.trim() || !businessUnitId || loading} 
            type="button"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
