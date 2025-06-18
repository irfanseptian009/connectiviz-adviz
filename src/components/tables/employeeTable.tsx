"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RiDeleteBin5Line, RiEditLine } from "react-icons/ri";
import { User } from "@/types/employee";
import { Button } from "@/components/ui/button";

type Props = {
  data: User[];
  onView(id: number): void;
  onEdit(id: number): void;
  onDelete(id: number): void;
};

export default function EmployeeTable({ data = [], onView, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-xl border border-muted bg-background p-4 dark:border-white/[0.05]">
      <div className="overflow-x-auto">
        <Table className="text-sm">
          <TableHeader className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            <TableRow>
              <TableCell isHeader className="w-[200px] p-2 font-semibold">Nama</TableCell>
              <TableCell isHeader className="p-2 font-semibold">Email</TableCell>
              <TableCell isHeader className="p-2 font-semibold">Role</TableCell>
              <TableCell isHeader className="p-2 font-semibold text-center">Aksi</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(data?.length ?? 0) > 0 ? (
              data.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <TableCell className="p-2">
                    <button
                      onClick={() => onView(user.id)}
                      className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
                    >
                      {user.name ?? "-"}
                    </button>
                  </TableCell>
                  <TableCell className="p-2">{user.email ?? "-"}</TableCell>
                  <TableCell className="p-2 capitalize">{user.role?.toLowerCase() ?? "-"}</TableCell>
                  <TableCell className="p-2">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(user.id)}
                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <RiEditLine size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(user.id)}
                        className="text-red-500 hover:text-red-600 dark:hover:text-red-300"
                      >
                        <RiDeleteBin5Line size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell  className="text-center py-6 text-muted-foreground">
                  Tidak ada data karyawan ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
