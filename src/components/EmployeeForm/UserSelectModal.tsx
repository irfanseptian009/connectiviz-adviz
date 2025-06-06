import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchUsers, assignMultipleUsersToDivision } from "@/store/userSlice";
import { toast } from "react-hot-toast";
import type { AppDispatch } from "@/store";

interface UserSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  divisionId: number | null;
}

const UserSelectModal: React.FC<UserSelectModalProps> = ({ open, onOpenChange, divisionId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.list);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  useEffect(() => {
    if (open) dispatch(fetchUsers());
    if (!open) setSelectedUserIds([]);
  }, [open, dispatch]);

  const handleToggle = (id: number) => {
    setSelectedUserIds((ids) =>
      ids.includes(id) ? ids.filter((uid) => uid !== id) : [...ids, id]
    );
  };

  const handleAssign = async () => {
    if (!divisionId || selectedUserIds.length === 0) return;
    await dispatch(assignMultipleUsersToDivision({ userIds: selectedUserIds, divisionId }));
    toast.success("Users assigned to division!");
    setSelectedUserIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Users to Division</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {users.length === 0 && <div className="text-muted-foreground text-sm">No users available.</div>}
          {users.map((user) => (
            <label key={user.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted">
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleToggle(user.id)}
                className="accent-primary"
              />
              <span>{user.fullName || user.username} <span className="ml-1 text-xs text-muted-foreground">({user.email})</span></span>
            </label>
          ))}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
          <Button onClick={handleAssign} disabled={selectedUserIds.length === 0} type="button">Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserSelectModal;
