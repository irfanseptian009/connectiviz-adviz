"use client";
import { useDivision } from "@/hooks/useDivision";

export default function DivisionList() {
  const { list } = useDivision();
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-6">
      <h4 className="font-bold text-lg mb-3">Divisions</h4>
      <ul className="list-disc pl-5">
        {list.map((d) => (
          <li key={d.id}>
            <strong>{d.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
