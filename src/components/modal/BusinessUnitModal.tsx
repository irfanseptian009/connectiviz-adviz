
"use client";
import React from "react";

interface BusinessUnitModalProps {
  show: boolean;
  buName: string;
  setBuName: (val: string) => void;
  onClose: () => void;
  onAdd: () => void;
}

const BusinessUnitModal: React.FC<BusinessUnitModalProps> = ({
  show, buName, setBuName, onClose, onAdd,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Business Unit</h3>
        <input
          type="text"
          value={buName}
          onChange={(e) => setBuName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter Business Unit Name"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessUnitModal;
