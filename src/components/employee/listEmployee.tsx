"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, } from "@/store";
import { fetchUsers, editUser, deleteUser } from "@/store/userSlice";
import { toast } from "react-hot-toast";
import { withAuth } from "@/context/AuthContext";
import EmployeeTable from "@/components/tables/employeeTable";
import EditEmployeeModal from "@/components/employee/editEmployeeModal";
import DeleteConfirmModal from "@/components/employee/deleteConfirmModal";
import { employeeUpdateSchema } from "@/schemas/employeeUpdateSchema";
import { User } from "@/types/employee";
import { normalizeEmployee } from "@/utils/normalizationEmployee";

function ListEmployee() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { list, status } = useSelector((state: RootState) => state.user);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);




  const handleView = (id: number) => router.push(`/detail-employee?id=${id}`);

  const openEdit = (id: number) => {
    const user = list.find((u) => u.id === id);
    if (user) {
      setEditData({ ...user });
      setFormError({});
      setSelectedTab(0);
      setEditOpen(true);
    }
  };

  

const handleSave = async () => {
  if (!editData) return;

  try {
    const normalized = normalizeEmployee(editData);           
    const validated = employeeUpdateSchema.parse(normalized);
    const payload = Object.fromEntries(
      Object.entries(validated).map(([key, value]) => [key, value === null ? undefined : value])
    );

    await dispatch(editUser({ id: validated.id, payload })).unwrap();
    await dispatch(fetchUsers());       

    toast.success("Data karyawan berhasil diperbarui");
    setEditOpen(false);
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'errors' in err) {
      const obj: Record<string,string> = {};
      const zodErr = err as { errors: Array<{ path: string[], message: string }> };
      zodErr.errors.forEach(e => obj[e.path[0]] = e.message);
      setFormError(obj);                  
    } else {
      const apiErr = err as { response?: { data?: string } };
      toast.error(apiErr?.response?.data ?? "Gagal menyimpan");
    }
  }
};


  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("Employee successfully deleted.");
      dispatch(fetchUsers());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to delete employee: ${errorMessage}`);
    }
    setDeleteId(null);
  };

  const getUserName = (id: number | null) =>
    list.find((u) => u.id === id)?.username || "Employee not found";

  const filtered = useMemo(
    () =>
      list.filter(
        (u) =>
          u.username?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      ),
    [search, list]
  );

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Employee List
      </h1>

      {status === "loading" ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full" />
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border dark:text-gray-100 dark:bg-gray-700 rounded-lg w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <EmployeeTable
            data={paginated.map(user => ({
              ...user,
              fullName: user.fullName || '',
              position: user.position || '',
            }))}
            onView={handleView}
            onEdit={openEdit}
            onDelete={(id) => setDeleteId(id)}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm gap-2">
            <p className="text-gray-500 dark:text-gray-400">
              Showing {paginated.length} of {filtered.length} employees
            </p>

            <div className="flex gap-2 items-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg font-semibold">
                {page} / {totalPages || 1}
              </span>
              <button
                disabled={page === totalPages || !totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <EditEmployeeModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        editData={editData}
        setEditData={setEditData}
        formError={formError}
        setFormError={setFormError}
        handleSave={handleSave}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId!)}
        userName={getUserName(deleteId)}
      />
    </>
  );
}

export default withAuth(ListEmployee);
