"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/auth/SignInForm";
import { useKaryawan } from "@/hooks/useEmployee";
import EmployeeTable from "@/components/tables/employeeTable";
import EditEmployeeModal from "@/components/employee/editEmployeeModal";
import DeleteConfirmModal from "@/components/employee/deleteConfirmModal";
import { Karyawan } from "@/types/karyawan";
import EmployeeMonitoring from "@/components/employee/employeeMonitoring";

function EmployeePage() {
  const router = useRouter();
  const { list, loading, fetchById, save, remove } = useKaryawan();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isEditOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<Karyawan | null>(null);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleView = (id: number) => router.push(`/detail-employee?id=${id}`);

  const openEdit = async (id: number) => {
    const data = await fetchById(id);
    if (data) {
      const editDataWithNumberId = {
        ...data,
        id: Number(data.id ?? 0)
      } as const;
      setEditData(editDataWithNumberId);
    }
    setFormError({});
    setSelectedTab(0);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editData?.id) return;
    await save(Number(editData.id), editData);
    setEditOpen(false);
  };

  const openDelete = (id: number) => setDeleteId(id);

  const handleDelete = async (id: number) => {
    await remove(id);
    setDeleteId(null);
  };

  const getUserName = (id: number | null) =>
    list.find((u) => u.id === id)?.name ?? "karyawan tidak ditemukan";

  const filtered = list.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="overflow-hidden shadow-2xl p-10 rounded-xl border border-gray-200 bg-cyan-100 dark:bg-[#1D2247] dark:border-white/[0.05]">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        employee list
      </h1>

  

      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border dark:text-gray-100 dark:bg-gray-700 rounded-lg w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full" />
        </div>
      ) : (
        <>
          <EmployeeTable
            data={paginated}
            onView={handleView}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm gap-2">
            <p className="text-gray-500 dark:text-gray-400">
              Menampilkan {paginated.length} dari {filtered.length} karyawan
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
          <div className="p-10 space-y-12">
            <EmployeeMonitoring />
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
    </div>


  );
}

export default withAuth(EmployeePage);
