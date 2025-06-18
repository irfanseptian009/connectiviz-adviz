"use client";

import React, { useMemo, useState } from "react";
import { useEmployee } from "@/hooks/useEmployee";
import { useBusinessUnit } from "@/hooks/useBusinessUnit";
import { useDivision } from "@/hooks/useDivision";
import { 
  FiUsers, 
  FiLayers, 
  FiGrid,   
  FiHome,   
  FiTrendingUp
} from "react-icons/fi";
import ListEmployee from "@/components/employee/listEmployee";
import BusinessUnitList from "@/components/employeeMonitoring/BusinessUnitList";
import DivisionList from "@/components/employeeMonitoring/divisionList";
import EmployeeOrganization from "@/components/employeeMonitoring/EmployeeOrganization";

export default function EmployeePage() {
  const { list: employees, loading: loadingEmp } = useEmployee();
  const { list: businessUnits, loading: loadingBU } = useBusinessUnit();
  const { list: divisions, loading: loadingDiv } = useDivision();

  const [showComponent, setShowComponent] = useState<"employee" | "businessUnit" | "division" | "organization">("employee");

  const stats = useMemo(() => ({
    totalEmployee: employees.length,
    totalBusinessUnit: businessUnits.length,
    totalDivision: divisions.length,
    totalOrganization: 1,
  }), [employees, businessUnits, divisions]);

  const cardStyle =
    "shadow-xl rounded-2xl p-6 flex items-center gap-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#222F65] dark:to-[#1D2247] transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer";

  if (loadingEmp || loadingBU || loadingDiv)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-16 w-16 border-b-4 border-blue-600 rounded-full" />
      </div>
    );

  return (
    <div className="overflow-hidden shadow-2xl p-10 rounded-xl border border-gray-200 bg-cyan-100 dark:bg-[#1D2247] dark:border-white/[0.05]">
      <section className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Dashboard Monitoring Employee
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
              Monitor and analyze employee data in the company in real-time
            </p>
          </div>
        </div>

        {/* === STAT CARDS === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Employee */}
          <div
            className={cardStyle}
            onClick={() => setShowComponent("employee")}
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FiUsers size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Total Employees</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalEmployee}</h3>
              <div className="flex items-center mt-1 text-xs text-green-600 dark:text-green-400">
                <FiTrendingUp className="mr-1" />
                <span>+5% from last month</span>
              </div>
            </div>
          </div>
          {/* Total Business Unit */}
          <div
            className={cardStyle}
            onClick={() => setShowComponent("businessUnit")}
          >
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FiLayers size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Business Units</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalBusinessUnit}</h3>
            </div>
          </div>
          {/* Total Division */}
          <div
            className={cardStyle}
            onClick={() => setShowComponent("division")}
          >
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <FiGrid size={32} className="text-orange-500 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">Divisions</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalDivision}</h3>
            </div>
          </div>
          {/* Total Organization */}
          <div
            className={cardStyle}
            onClick={() => setShowComponent("organization")}
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <FiHome size={32} className="text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Organization
              </p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.totalOrganization}
              </h3>
            </div>
          </div>
        </div>

        {/* Dinamis: Tampilkan komponen berdasarkan card yang dipilih */}
        <div className="mt-8">
          {showComponent === "employee" && <ListEmployee />}
          {showComponent === "businessUnit" && <BusinessUnitList />}
          {showComponent === "division" && <DivisionList />}
          {showComponent === "organization" && <EmployeeOrganization />}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-10">
          <p>
            Last updated:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </section>
    </div>
  );
}
