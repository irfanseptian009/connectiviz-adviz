"use client";

import { RiDeleteBin5Line } from "react-icons/ri";
import { Modal } from "@/components/ui/modal";

type Props = {
  isOpen: boolean;
  onClose(): void;
  onConfirm(): void;
  userName: string;
};

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="mx-auto w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-blue-500 dark:shadow-md rounded-2xl overflow-hidden">
        {/* header gradient */}
        <div className="bg-gradient-to-r from-[#EBB317]/50 to-[#1D95D7]/50 p-4 m-2 rounded-t-xl text-white">
          <h3 className="text-lg font-bold flex items-center">
            <RiDeleteBin5Line className="mr-2" /> Konfirmasi Hapus
          </h3>
        </div>

        {/* body */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 shadow-lg dark:bg-red-900/30 p-3 rounded-full">
              <RiDeleteBin5Line className="text-red-500 dark:text-red-400 text-2xl" />
            </div>
          </div>

          <p className="text-center text-gray-700 dark:text-gray-200 mb-6">
            Apakah Anda yakin ingin menghapus data{" "}
            <span className="font-semibold">{userName}</span>?
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-8 py-1 bg-gray-200 shadow-lg dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-8 py-1 bg-red-600 shadow-lg dark:shadow-blue-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}