"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface BusinessUnitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => Promise<void>;
}

export function BusinessUnitModal({ 
  open, 
  onOpenChange, 
  onCreate 
}: BusinessUnitModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onCreate(name.trim());
      setName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating business unit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Business Unit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessUnitName">Name</Label>
            <Input
              id="businessUnitName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Business Unit Name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
            />
          </div>
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
            disabled={!name.trim() || loading} 
            type="button"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
