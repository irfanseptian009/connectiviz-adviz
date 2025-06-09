import EmployeeManagementCreateForm from "@/components/EmployeeForm/EmployeeManagementCreateForm";


export default function CreateUserPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
      <EmployeeManagementCreateForm />
    </main>
  );
}

