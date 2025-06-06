"use client";
import React from "react";

interface DivisionModalProps {
  show: boolean;
  divName: string;
  setDivName: (val: string) => void;
  parentDivId: string;
  setParentDivId: (val: string) => void;
  divBuId: string;
  onClose: () => void;
  onAdd: () => void;
  renderDivisionOptions: (divisions: any[], parentId?: any, level?: number, buId?: any) => React.ReactNode;
  getDivisionPath: (parentDivId: string, divisions: any[]) => string;
  divisions: any[];
}

const DivisionModal: React.FC<DivisionModalProps> = ({
  show, divName, setDivName, parentDivId, setParentDivId, divBuId,
  onClose, onAdd, renderDivisionOptions, getDivisionPath, divisions,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Division</h3>
        <input
          type="text"
          value={divName}
          onChange={(e) => setDivName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter Division Name"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Parent Division (optional)
          </label>
          <select
            value={parentDivId}
            onChange={e => setParentDivId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Top Level Division</option>
            {renderDivisionOptions(divisions, null, 0, divBuId)}
          </select>
          {parentDivId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Will be created under: {getDivisionPath(parentDivId, divisions)}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

export default DivisionModal;
