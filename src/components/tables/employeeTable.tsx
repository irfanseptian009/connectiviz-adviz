"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiDeleteBin5Line, RiEditLine } from "react-icons/ri";
import { Employee } from "@/types/employee";

type Props = {
  data: Employee[];
  onView(id: number): void;
  onEdit(id: number): void;
  onDelete(id: number): void;
};

export default function EmployeeTable({
  data,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden p-4 rounded-xl border border-gray-200 bg-blue-50 dark:bg-gray-800 dark:border-white/[0.05]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px] p-2">
          <Table className="min-w-full text-sm">
            <TableHeader className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
              <TableRow>
                <TableCell className="p-2 border-b font-medium">Nama</TableCell>
                <TableCell className="p-2 border-b font-medium">Email</TableCell>
                <TableCell className="p-2 border-b font-medium">
                  role
                </TableCell>
                <TableCell className="p-2 border-b font-medium">Action</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y dark:divide-gray-600">
              {data.length ? (
                data.map((u) => (
                  <TableRow
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="p-2 border-b dark:border-gray-600">
                      <span
                        onClick={() => onView(u.id)}
                        className="text-blue-500 dark:text-blue-300 hover:underline cursor-pointer font-medium"
                      >
                        {u.username ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="p-2 border-b dark:border-gray-600 dark:text-gray-200">
                      {u.email ?? "-"}
                    </TableCell>
                    <TableCell className="p-2 border-b dark:border-gray-600 dark:text-gray-200">
                      {u.role ?? "-"}
                    </TableCell>
                    <TableCell className="p-2 border-b dark:border-gray-600 flex gap-2">
                      <button
                        onClick={() => onEdit(u.id)}
                        className="text-blue-500 hover:shadow-lg  dark:hover:text-blue-300 dark:hover:shadow-lg  dark:shadow-sm dark:shadow-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md p-2 rounded-lg"
                        aria-label="Edit"
                      >
                        <RiEditLine size={20} />
                      </button>

                      <button
                        onClick={() => onDelete(u.id)}
                        className="text-red-500 hover:shadow-lg dark:hover:shadow-lg dark:shadow-blue-600 dark:shadow-sm dark:hover:text-red-300 transition-all duration-300 transform hover:-translate-y-1 shadow-md p-2 rounded-lg"
                        aria-label="Delete"
                      >
                        <RiDeleteBin5Line size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
