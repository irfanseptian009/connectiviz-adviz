"use client";

import React from "react";
import { Tab } from "@headlessui/react";
import { Modal } from "@/components/ui/modal";
import { RiEditLine } from "react-icons/ri";
import { Employee } from "@/types/employee";
import {Props} from "@/types/props";


// Dropdown options for select fields
const dropdownOptions: Record<string, string[]> = {
  role: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"],
  gender: ["MALE", "FEMALE"],
  maritalStatus: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'],
  bloodType:['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  lastEducation: ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'],
  ptkpStatus:['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'],
  // Add more if needed
};

const tabs = [
  {
    label: "Account & Role",
    fields: ["username", "email", "role",]
  },
  {
    label: "Personal Data",
    fields: [
      "fullName",
      "nationalId",
      "address",
      "placeOfBirth",
      "dateOfBirth",
      "gender",
      "phoneNumber",
      "officeEmail",
      "divisionId"
    ]
  },
  {
    label: "Family Data",
    fields: [
      "motherName",
      "fatherName",
      "maritalStatus",
      "spouseName",
      "childrenNames"
    ]
  },
  {
    label: "Education",
    fields: [
      "lastEducation",
      "schoolName",
      "major",
      "yearStart",
      "yearGraduate"
    ]
  },
  {
    label: "Documents",
    fields: [
      "identityCard",
      "taxNumber",
      "drivingLicense",
      "bpjsHealth",
      "bpjsEmployment",
      "insuranceCompany",
      "insuranceNumber",
      "policyNumber",
      "ptkpStatus"
    ]
  },
  {
    label: "Emergency Contact",
    fields: [
      "emergencyContactName",
      "emergencyContactRelation",
      "emergencyContactPhone"
    ]
  },
  {
    label: "Bank",
    fields: [
      "bankName",
      "bankAccountNumber",
      "bankAccountName"
    ]
  },
  {
    label: "Social Media",
    fields: [
      "instagram",
      "facebook",
      "twitter",
      "linkedin",
      "tiktok"
    ]
  },
  {
    label: "Health",
    fields: [
      "bloodType",
      "medicalHistory",
      "allergies",
      "height",
      "weight"
    ]
  }
];

// Label formatter
const formatLabel = (field: string) =>
  field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()).trim();

// Field type getter
const getFieldType = (field: string) => {
  if (field.toLowerCase().includes("date")) return "date";
  if (field.toLowerCase().includes("email")) return "email";
  if (field === "password") return "password";
  if (
    ["yearStart", "yearGraduate", "height", "weight", "divisionId"].includes(
      field
    )
  )
    return "number";
  return "text";
};

// Select component
const SelectField = ({
  label,
  name,
  options,
  required,
  value,
  onChange,
  error
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value?: string;
  onChange(val: string): void;
  error?: string;
}) => (
  <div className="flex flex-col text-sm">
    <label className="font-medium text-gray-700 dark:text-gray-400 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      className={`rounded border ${
        error ? "border-red-500" : "dark:border-gray-600"
      } dark:bg-gray-800 dark:text-white bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400`}
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Special for childrenNames
const ChildrenNamesField = ({
  value,
  onChange,
  error,
}: {
  value?: string[];
  onChange(val: string[]): void;
  error?: string;
}) => {
  const values = value && value.length > 0 ? value : [""];

  const handleChange = (idx: number, newVal: string) => {
    const updated = [...values];
    updated[idx] = newVal;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...values, ""]);
  };

  const handleRemove = (idx: number) => {
    const updated = values.filter((_, i) => i !== idx);
    onChange(updated.length === 0 ? [""] : updated);
  };

  return (
    <div className="flex flex-col text-sm">
      <label className="font-medium text-gray-700 dark:text-gray-400 mb-1">
        Children Names
      </label>
      {values.map((val, idx) => (
        <div className="flex gap-2 mb-2" key={idx}>
          <input
            type="text"
            name={`childrenNames_${idx}`}
            value={val}
            onChange={e => handleChange(idx, e.target.value)}
            placeholder={`Child ${idx + 1} name`}
            className={`rounded border ${
              error ? "border-red-500" : "dark:border-gray-600"
            } dark:bg-gray-800  dark:text-white bg-gray-50 px-3 py-2 text-sm flex-col`}
          />
          {values.length > 1 && (
            <button
              type="button"
              className="bg-red-500/30 text-white px-2  rounded"
              onClick={() => handleRemove(idx)}
              tabIndex={-1}
            >
              -
            </button>
          )}
          {idx === values.length - 1 && (
            <button
              type="button"
              className="bg-blue-500/30 text-white px-2 rounded"
              onClick={handleAdd}
              tabIndex={-1}
            >
              +
            </button>
          )}
        </div>
      ))}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};


export default function EditEmployeeModal({
  isOpen,
  onClose,
  editData,
  setEditData,
  formError,
  setFormError,
  handleSave,
  selectedTab,
  setSelectedTab
}: Props) {
  const handleInputChange = (field: keyof Employee, value: Employee[keyof Employee]) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
    if (formError[field]) {
      const clone = { ...formError };
      delete clone[field];
      setFormError(clone);
    }
  };

  if (!editData) return null;

  

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-0 mx-auto w-full max-w-4xl"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* === HEADER === */}
        <div className="bg-gradient-to-r from-[#EBB317]/50 to-[#1D95D7]/50 m-2 rounded-t-xl p-4">
          <h2 className="text-lg font-semibold text-white dark:text-gray-200 flex items-center">
            <RiEditLine className="mr-2" /> Edit Employee Data
          </h2>
        </div>

        {/* === BODY === */}
        <div className="p-5">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            {/* tab header */}
            <div className="mb-4">
              <Tab.List className="flex space-x-1 p-2 bg-blue-50 dark:bg-gray-700 rounded-md overflow-x-scroll">
                {tabs.map(tab => (
                  <Tab
                    key={tab.label}
                    className={({ selected }) =>
                      `px-3 py-2 rounded-md m-2 shadow-md dark:shadow-md dark:shadow-blue-600 text-sm font-medium transition-colors whitespace-nowrap ${
                        selected
                          ? "dark:bg-blue-600 bg-orange-500/50 text-white shadow-md"
                          : "text-gray-700 dark:bg-slate-600 bg-gray-200 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`
                    }
                  >
                    {tab.label}
                    {formError &&
                      tab.fields.some(f => !!formError[f]) && (
                        <span className="ml-1 text-red-500 dark:text-red-300">
                          •
                        </span>
                      )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            {/* tab panels */}
            <Tab.Panels className="mt-4 max-h-[60vh] overflow-y-auto px-1">
              {tabs.map(tab => (
                <Tab.Panel
                  key={tab.label}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 rounded-lg"
                >
                  {tab.fields.map(field => {
                    const isRequired = ["username", "email", "role"].includes(
                      field
                    );

                    if (field === "childrenNames") {
                      return (
                        <ChildrenNamesField
                          key={field}
                          value={editData[field] as string[]}
                          onChange={val => handleInputChange(field, val)}
                          error={formError[field]}
                        />
                      );
                    }

                    if (dropdownOptions[field]) {
                      return (
                        <SelectField
                          key={field}
                          label={formatLabel(field)}
                          name={field}
                          options={dropdownOptions[field]}
                          required={isRequired}
                          value={editData[field] as string}
                          onChange={val => handleInputChange(field, val)}
                          error={formError[field]}
                        />
                      );
                    }

                   
                    return (
                      <div className="flex flex-col text-sm" key={field}>
                        <label className="font-medium text-gray-400 mb-1">
                          {formatLabel(field)}
                          {isRequired && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <input
                          type={getFieldType(field)}
                          name={field}
                          value={
                            editData[field] !== undefined &&
                            editData[field] !== null
                              ? String(editData[field])
                              : ""
                          }
                          onChange={e =>
                            handleInputChange(field, e.target.value)
                          }
                          className={`rounded border ${
                            formError[field]
                              ? "border-red-500"
                              : "dark:border-gray-600"
                          } dark:bg-gray-800 bg-gray-50 px-3 py-2 dark:text-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-blue-400`}
                        />
                        {formError[field] && (
                          <p className="text-red-500 text-xs mt-1">
                            {formError[field]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          {/* footer */}
          <div className="mt-6 flex justify-end gap-3 border-t dark:border-gray-600 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 shadow-xl bg-blue-800/50 text-white rounded-md text-sm hover:bg-blue-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
