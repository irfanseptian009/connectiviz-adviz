"use client";

import React from "react";
import { Tab } from "@headlessui/react";
import { Modal } from "@/components/ui/modal";
import { RiEditLine } from "react-icons/ri";

export interface Karyawan {
  id: number;
  name: string;
  email: string;
  role: string;
  password?: string;
  /* ... field lain persis seperti di halaman utama … */
  [key: string]: string | number | undefined;
}

interface Props {
  isOpen: boolean;
  onClose(): void;
  editData: Karyawan | null;
  setEditData(data: Karyawan | null): void;
  formError: Record<string, string>;
  setFormError(err: Record<string, string>): void;
  handleSave(): Promise<void>;
  selectedTab: number;
  setSelectedTab(idx: number): void;
}

const dropdownOptions: Record<string, string[]> = {
  jk: ["L", "P"],
  role: ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE"],
  statusMenikah: ["Belum Menikah", "Menikah", "Cerai"],
  statusKerja: ["Tetap", "Kontrak", "Outsourcing"],
  golDarah: ["A", "B", "AB", "O"],
  kategoriPph: ["A", "B", "C"],
  agama: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"],
  pendidikan: ["SMA/SMK", "D3", "S1", "S2", "S3"],
  swastaNegeri: ["Swasta", "Negeri"],
  statusPtkp: [
    "TK/0",
    "TK/1",
    "TK/2",
    "TK/3",
    "K/0",
    "K/1",
    "K/2",
    "K/3",
  ],
};

const tabs = [
  { label: "Akun & Role", fields: ["name", "email", "role", "password"] },
  {
    label: "Data Pribadi",
    fields: [
      "namaLengkap",
      "namaPanggilan",
      "namaPerusahaan",
      "jk",
      "employeeId",
      "tempatLahir",
      "tanggalLahir",
      "noTelp",
      "golDarah",
      "statusMenikah",
      "agama",
    ],
  },
  {
    label: "Pekerjaan & Pendidikan",
    fields: [
      "jabatan",
      "statusKerja",
      "tanggalMasuk",
      "pendidikan",
      "fakultas",
      "jurusan",
      "universitas",
      "swastaNegeri",
      "ipk",
    ],
  },
  {
    label: "Alamat & Dokumen",
    fields: ["domisili", "alamatDomisili", "alamatKtp", "noKtp", "noKk"],
  },
  {
    label: "BPJS & Pajak",
    fields: ["bpjsTk", "bpjsKes", "statusPtkp", "kategoriPph", "npwp"],
  },
  { label: "Asuransi", fields: ["kartuAsuransi", "memberNumber", "noPolis"] },
  {
    label: "Kontak & Sosial",
    fields: [
      "emailPribadi",
      "emailPerusahaan",
      "kontakDaruratNama",
      "kontakDaruratHubungan",
      "kontakDaruratHp",
      "ig",
      "linkedin",
    ],
  },
  { label: "Bank", fields: ["bank", "noRekening", "namaRekening"] },
];

const formatLabel = (field: string) =>
  field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const getFieldType = (field: string) => {
  if (field.toLowerCase().includes("tanggal")) return "date";
  if (field.toLowerCase().includes("email")) return "email";
  if (field === "password") return "password";
  if (field === "ipk" || field.toLowerCase().includes("no")) return "text";
  return "text";
};

const SelectField = ({
  label,
  name,
  options,
  required,
  value,
  onChange,
  error,
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
      onChange={(e) => onChange(e.target.value)}
      className={`rounded border ${
        error ? "border-red-500" : "dark:border-gray-600"
      } dark:bg-gray-800 dark:text-white bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400`}
    >
      <option value="">Pilih {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function EditEmployeeModal({
  isOpen,
  onClose,
  editData,
  setEditData,
  formError,
  setFormError,
  handleSave,
  selectedTab,
  setSelectedTab,
}: Props) {
  /* ----------- change handler (menghapus error field saat diedit) -------- */
  const handleInputChange = (field: string, value: string) => {
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
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 mx-auto w-full max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* === HEADER === */}
        <div className="bg-gradient-to-r from-[#EBB317]/50 to-[#1D95D7]/50 m-2 rounded-t-xl p-4">
          <h2 className="text-lg font-semibold text-white dark:text-gray-200 flex items-center">
            <RiEditLine className="mr-2" /> Edit Data Karyawan
          </h2>
        </div>

        {/* === BODY === */}
        <div className="p-5">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            {/* tab header */}
            <div className="mb-4">
              <Tab.List className="flex space-x-1 p-2 bg-blue-50 dark:bg-gray-700 rounded-md overflow-x-scroll">
                {tabs.map((tab) => (
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
                      tab.fields.some((f) => !!formError[f]) && (
                        <span className="ml-1 text-red-500 dark:text-red-300">•</span>
                      )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            {/* tab panels */}
            <Tab.Panels className="mt-4 max-h-[60vh] overflow-y-auto px-1">
              {tabs.map((tab) => (
                <Tab.Panel
                  key={tab.label}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 rounded-lg"
                >
                  {tab.fields.map((field) => {
                    const isRequired = ["name", "email", "role"].includes(field);

                    if (dropdownOptions[field]) {
                      return (
                        <SelectField
                          key={field}
                          label={formatLabel(field)}
                          name={field}
                          options={dropdownOptions[field]}
                          required={isRequired}
                          value={editData[field] as string | undefined}
                          onChange={(val) => handleInputChange(field, val)}
                          error={formError[field]}
                        />
                      );
                    }

                    if (field === "password") {
                      return (
                        <div className="flex flex-col text-sm" key={field}>
                          <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Password (Kosongkan jika tidak diubah)
                          </label>
                          <input
                            type="password"
                            name={field}
                            value={(editData[field] as string) || ""}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className="rounded border dark:text-white text-black dark:border-gray-600 dark:bg-gray-800 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      );
                    }

                    /* ---- default input ---- */
                    return (
                      <div className="flex flex-col text-sm" key={field}>
                        <label className="font-medium text-gray-400 mb-1">
                          {formatLabel(field)}{" "}
                          {isRequired && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type={getFieldType(field)}
                          name={field}
                          value={(editData[field] as string) || ""}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className={`rounded border ${
                            formError[field] ? "border-red-500" : "dark:border-gray-600"
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
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 shadow-xl bg-blue-800/50 text-white rounded-md text-sm hover:bg-blue-800 transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
