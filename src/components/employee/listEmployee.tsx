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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, Filter, Download, RefreshCw } from "lucide-react";

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




  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchUsers());
    setIsRefreshing(false);
    toast.success("Data refreshed successfully!");
  };

  const handleView = (id: number) => {
    // Add a subtle visual feedback
    toast.success("Opening employee details...", { duration: 1000 });
    router.push(`/detail-employee?id=${id}`);
  };

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
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Employee Management
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and view all employee information
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {filtered.length} Total
              </Badge>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Actions Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
  size="sm"
  className="gap-2 bg-blue-600 hover:bg-blue-700"
  onClick={() => router.push("/form-elements")}
>
  <UserPlus className="h-4 w-4" />
  Add Employee
</Button>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {status === "loading" ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Loading employees...
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Please wait while we fetch the data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Employee Table */}
          <Card>
            <CardContent className="p-0">
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
            </CardContent>
          </Card>

          {/* Pagination */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold">{paginated.length}</span> of{" "}
                  <span className="font-semibold">{filtered.length}</span> employees
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    variant="outline"
                    size="sm"
                    className="min-w-20"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 text-gray-400">...</span>
                        <Button
                          onClick={() => setPage(totalPages)}
                          variant={page === totalPages ? "default" : "outline"}
                          size="sm"
                          className="w-10 h-10"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    disabled={page === totalPages || !totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    variant="outline"
                    size="sm"
                    className="min-w-20"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modals */}
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

export default withAuth(ListEmployee);
