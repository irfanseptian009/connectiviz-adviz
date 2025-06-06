"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/auth/SignInForm";
import { useEmployee } from "@/hooks/useEmployee";
import EmployeeTable from "@/components/tables/employeeTable";
import EditEmployeeModal from "@/components/employee/editEmployeeModal";
import DeleteConfirmModal from "@/components/employee/deleteConfirmModal";
import { Employee } from "@/types/employee";
import { employeeSchema } from "@/schemas/employee";

function ListEmpolyee() {
  const router = useRouter();
  const { list, loading, fetchById, save, remove } = useEmployee();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isEditOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<Employee | null>(null);
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
  if (!editData?.id || !editData.fullName) return;

  // NORMALIZE 
  const normalized = {
    id: Number(editData.id),
    fullName: editData.fullName,
    role: editData.role as 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE',
    email: editData.email || '',
    username: editData.username || '',

    password: editData.password || undefined,

    // PERSONAL
    nationalId: editData.nationalId || undefined,
    address: editData.address || undefined,
    placeOfBirth: editData.placeOfBirth || undefined,
    dateOfBirth: editData.dateOfBirth ? (editData.dateOfBirth.length === 10 ? `${editData.dateOfBirth}T00:00:00.000Z` : editData.dateOfBirth) : undefined,
    gender: editData.gender || undefined,
    phoneNumber: editData.phoneNumber || undefined,
    officeEmail: editData.officeEmail || undefined,
    divisionId: editData.divisionId ? Number(editData.divisionId) : undefined,

    // FAMILY
    motherName: editData.motherName || undefined,
    fatherName: editData.fatherName || undefined,
    maritalStatus: editData.maritalStatus || undefined,
    spouseName: editData.spouseName || undefined,
    childrenNames: Array.isArray(editData.childrenNames)
      ? editData.childrenNames
      : (editData.childrenNames && typeof editData.childrenNames === "string" && String(editData.childrenNames).trim() !== ""
        ? String(editData.childrenNames).split(",").map((s: string) => s.trim()).filter(Boolean)
        : undefined),

    // EDUCATION
    lastEducation: editData.lastEducation || undefined,
    schoolName: editData.schoolName || undefined,
    major: editData.major || undefined,
    yearStart: editData.yearStart ? Number(editData.yearStart) : undefined,
    yearGraduate: editData.yearGraduate ? Number(editData.yearGraduate) : undefined,

    // DOCUMENTS
    identityCard: editData.identityCard || undefined,
    taxNumber: editData.taxNumber || undefined,
    drivingLicense: editData.drivingLicense || undefined,
    bpjsHealth: editData.bpjsHealth || undefined,
    bpjsEmployment: editData.bpjsEmployment || undefined,
    insuranceCompany: editData.insuranceCompany || undefined,
    insuranceNumber: editData.insuranceNumber || undefined,
    policyNumber: editData.policyNumber || undefined,
    ptkpStatus: editData.ptkpStatus || undefined,

    // EMERGENCY
    emergencyContactName: editData.emergencyContactName || undefined,
    emergencyContactRelation: editData.emergencyContactRelation || undefined,
    emergencyContactPhone: editData.emergencyContactPhone || undefined,

    // BANK
    bankName: editData.bankName || undefined,
    bankAccountNumber: editData.bankAccountNumber || undefined,
    bankAccountName: editData.bankAccountName || undefined,

    // SOCIAL MEDIA
    instagram: editData.instagram || undefined,
    facebook: editData.facebook || undefined,
    twitter: editData.twitter || undefined,
    linkedin: editData.linkedin || undefined,
    tiktok: editData.tiktok || undefined,

    // HEALTH
    bloodType: editData.bloodType || undefined,
    medicalHistory: editData.medicalHistory || undefined,
    allergies: editData.allergies || undefined,
    height: editData.height ? Number(editData.height) : undefined,
    weight: editData.weight ? Number(editData.weight) : undefined,
  };

 try {
  const employeeData = employeeSchema.parse(normalized);
  await save(Number(editData.id), employeeData);
  setEditOpen(false);
  setFormError({}); 
} catch (err: unknown) {
  if (err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors: unknown[] }).errors)) {
    const errors: Record<string, string> = {};
    (err as { errors: { path: string | string[], message: string }[] }).errors.forEach((e) => {
      const field = Array.isArray(e.path) ? e.path.join(".") : e.path;
      errors[field] = e.message;
    });
    setFormError(errors);
  } else {
    setFormError({ global: "Validation failed or unknown error" });
  }
}

};


  const openDelete = (id: number) => setDeleteId(id);

  const handleDelete = async (id: number) => {
    await remove(id);
    setDeleteId(null);
  };

  const getUserName = (id: number | null) =>
    list.find((u) => u.id === id)?.username ?? "employee not found";

  const filtered = list.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        employee list
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full" />
        </div>
      ) : (
        <>
          
           <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border dark:text-gray-100 dark:bg-gray-700 rounded-lg w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>
          <EmployeeTable
            data={paginated}
            onView={handleView}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm gap-2">
            <p className="text-gray-500 dark:text-gray-400">
              show {paginated.length} from {filtered.length} employee
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

export default withAuth(ListEmpolyee);







