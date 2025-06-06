// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEmployee } from "@/hooks/useEmployee";
// import { EmployeeData } from "@/schemas/employee";
// import { Employee } from "@/types/employee";
// import toast from "react-hot-toast";

// // Option enum sesuai prisma
// const dropdownOptions: Record<string, string[]> = {
//   role: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"],
//   gender: ["Male", "Female"],
//   maritalStatus: ["Single", "Married", "Divorced"],
//   bloodType: ["A", "B", "AB", "O"],
//   lastEducation: ["High School", "Diploma", "Bachelor", "Master", "Doctor"],
//   ptkpStatus: ["TK/0", "TK/1", "TK/2", "TK/3", "K/0", "K/1", "K/2", "K/3"],
// };

// const fieldList = [
//   "username", "email", "role", "password",
//   "fullName", "nationalId", "address", "placeOfBirth", "dateOfBirth", "gender", "phoneNumber", "officeEmail", "divisionId",
//   "motherName", "fatherName", "maritalStatus", "spouseName", "childrenNames",
//   "lastEducation", "schoolName", "major", "yearStart", "yearGraduate",
//   "identityCard", "taxNumber", "drivingLicense", "bpjsHealth", "bpjsEmployment",
//   "insuranceCompany", "insuranceNumber", "policyNumber", "ptkpStatus",
//   "emergencyContactName", "emergencyContactRelation", "emergencyContactPhone",
//   "bankName", "bankAccountNumber", "bankAccountName",
//   "instagram", "facebook", "twitter", "linkedin", "tiktok",
//   "bloodType", "medicalHistory", "allergies", "height", "weight"
// ];

// function formatLabel(field: string) {
//   return field
//     .replace(/([A-Z])/g, " $1")
//     .replace(/^./, (s) => s.toUpperCase())
//     .trim();
// }

// function EditEmployeePage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const { fetchById, save } = useEmployee();

//   const [form, setForm] = useState<EmployeeData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     fetchById(Number(id))
//       .then((data: Employee) => {
//         // Handle array childrenNames, fallback to []
//         setForm({ ...data, childrenNames: Array.isArray(data.childrenNames) ? data.childrenNames : [] });
//       })
//       .catch(() => {
//         toast.error("Failed to load employee");
//         router.push("/list-employee");
//       })
//       .finally(() => setLoading(false));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     if (name === "childrenNames") {
//       setForm((prev) => prev && { ...prev, childrenNames: value.split(",").map((v) => v.trim()).filter(Boolean) });
//     } else if (type === "number") {
//       setForm((prev) => prev && { ...prev, [name]: value ? Number(value) : "" });
//     } else {
//       setForm((prev) => prev && { ...prev, [name]: value });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!id || !form) return;
//     await save(Number(id), form);
//     router.push("/list-employee");
//   };

//   if (loading || !form) return <p className="p-8">Loading...</p>;

//   return (
//     <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-xl font-bold">Edit Employee</h1>
//         <button
//           onClick={() => router.back()}
//           className="text-sm bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200"
//         >
//           Back
//         </button>
//       </div>
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//         {fieldList.map((field) => (
//           <div key={field}>
//             <label className="block mb-1 font-medium text-gray-700">
//               {formatLabel(field)}
//             </label>
//             {dropdownOptions[field] ? (
//               <select
//                 name={field}
//                 value={form[field as keyof EmployeeData] || ""}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//               >
//                 <option value="">Select {formatLabel(field)}</option>
//                 {dropdownOptions[field].map((opt) => (
//                   <option key={opt} value={opt}>
//                     {opt}
//                   </option>
//                 ))}
//               </select>
//             ) : field === "childrenNames" ? (
//               <textarea
//                 name="childrenNames"
//                 rows={2}
//                 placeholder="Separate with comma, e.g. John, Mary"
//                 value={(form.childrenNames || []).join(", ")}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             ) : (
//               <input
//                 type={
//                   field.toLowerCase().includes("date") ? "date"
//                   : ["yearStart", "yearGraduate", "height", "weight", "divisionId"].includes(field) ? "number"
//                   : field === "password" ? "password"
//                   : "text"
//                 }
//                 name={field}
//                 value={form[field as keyof EmployeeData] ?? ""}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             )}
//           </div>
//         ))}
//         <div className="col-span-2 text-right mt-4">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EditEmployeePage;
