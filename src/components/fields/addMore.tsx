"use client";
import React from "react";

interface Props {
  value?: string[];
  onChange: (val: string[]) => void;
  label: string;
  placeholder?: string;
}

const AddMore: React.FC<Props> = ({ value = [], onChange, label, placeholder }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"> {label}</label>
      <div className="space-y-2">
        {(value || []).map((val, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={val}
              onChange={e => {
                const arr = [...value];
                arr[idx] = e.target.value;
                onChange(arr);
              }}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder={placeholder || `${label} ${idx + 1}`}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 font-medium"
          onClick={() => onChange([...value, ''])}
        >
          + Add Child
        </button>
      </div>
    </div>
  );
};

export default AddMore;
