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
import TableLoadingSkeleton from "@/components/common/TableLoadingSkeleton";
import { employeeUpdateSchema } from "@/schemas/employeeUpdateSchema";
import { User } from "@/types/employee";
import { normalizeEmployee } from "@/utils/normalizationEmployee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, Filter, Download, RefreshCw } from "lucide-react";
import { exportEmployeesTableToCSV, exportEmployeesTableToJSON, exportEmployeesTableToPDF } from "@/utils/employeeUtils";

function ListEmployee() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { list, status } = useSelector((state: RootState) => state.user);  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [divisionFilter, setDivisionFilter] = useState<string>("");
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string>("");
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
    console.log('Normalized data being sent:', normalized);
    const validated = employeeUpdateSchema.parse(normalized);
    console.log('Validated data:', validated);
    
    // Filter out fields that shouldn't be sent to the backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id,  ...updateFields } = validated;
    
    const payload = Object.fromEntries(
      Object.entries(updateFields).map(([key, value]) => [key, value === null ? undefined : value])
    );
    console.log('Final payload:', payload);

    await dispatch(editUser({ id: validated.id, payload })).unwrap();
    await dispatch(fetchUsers());       

    toast.success("Data karyawan berhasil diperbarui");
    setEditOpen(false);
  } catch (err: unknown) {
    console.error('Error in handleSave:', err);
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
  // Filter and Export Functions
  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      if (format === 'csv') {
        exportEmployeesTableToCSV(filtered);
        toast.success(`${filtered.length} employees exported to CSV!`);
      } else if (format === 'json') {
        exportEmployeesTableToJSON(filtered);
        toast.success(`${filtered.length} employees exported to JSON!`);
      } else if (format === 'pdf') {
        await exportEmployeesTableToPDF(filtered);
        toast.success(`${filtered.length} employees exported to PDF!`);
      }
      setShowExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data. Please try again.');
    }
  };
  const clearFilters = () => {
    setRoleFilter("");
    setStatusFilter("");
    setDivisionFilter("");
    setBusinessUnitFilter("");
    toast.success("Filters cleared!");
  };
  // Get unique business units for filter dropdown
  const businessUnits = useMemo(() => {
    const units = new Set<string>();
    list.forEach(user => {
      if (user.division?.businessUnit?.name) {
        units.add(user.division.businessUnit.name);
      }
    });
    return Array.from(units).sort();
  }, [list]);

  const filtered = useMemo(
    () =>
      list.filter((u) => {
        const matchesSearch = 
          u.username?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.fullName?.toLowerCase().includes(search.toLowerCase());
        
        const matchesRole = !roleFilter || u.role === roleFilter;
        const matchesStatus = !statusFilter || 
          (statusFilter === "active" && u.isActive) ||
          (statusFilter === "inactive" && !u.isActive);
        const matchesDivision = !divisionFilter || 
          u.division?.name?.toLowerCase().includes(divisionFilter.toLowerCase()) ||
          u.divisionId?.toString() === divisionFilter;        const matchesBusinessUnit = !businessUnitFilter || 
          u.division?.businessUnit?.name === businessUnitFilter;

        return matchesSearch && matchesRole && matchesStatus && matchesDivision && matchesBusinessUnit;
      }),
    [search, list, roleFilter, statusFilter, divisionFilter, businessUnitFilter]
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
            </div>            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowFilterModal(true)}
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowExportModal(true)}
              >
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
      </Card>      {/* Loading State */}
      {status === "loading" ? (
        <Card>
          <CardContent className="p-6">
            <TableLoadingSkeleton rows={8} columns={6} showHeader={true} />
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
      />      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId!)}
        userName={getUserName(deleteId)}
      />

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Filter Employees
            </h3>
              <div className="space-y-4">
              {/* Business Unit Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Unit</label>
                <select 
                  value={businessUnitFilter} 
                  onChange={(e) => setBusinessUnitFilter(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">All Business Units</option>
                  {businessUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Division Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Division</label>
                <Input
                  type="text"
                  placeholder="Search division..."
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
              <div className="flex gap-2">
                <Button onClick={() => setShowFilterModal(false)} variant="ghost">
                  Cancel
                </Button>
                <Button onClick={() => setShowFilterModal(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Export Employee Table
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Export {filtered.length} employee records from the current table view:
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => handleExport('csv')}
                className="w-full justify-start"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-3" />
                Export Table as CSV
                <span className="text-xs text-gray-500 ml-auto">Excel compatible</span>
              </Button>
              
              <Button
                onClick={() => handleExport('json')}
                className="w-full justify-start"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-3" />
                Export Table as JSON
                <span className="text-xs text-gray-500 ml-auto">Data format</span>
              </Button>
              
              <Button
                onClick={() => handleExport('pdf')}
                className="w-full justify-start"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-3" />
                Export Table as PDF
                <span className="text-xs text-gray-500 ml-auto">Print ready</span>
              </Button>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setShowExportModal(false)}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(ListEmployee);


