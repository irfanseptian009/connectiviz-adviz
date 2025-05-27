"use client";

import React, { useMemo, useState } from "react";
import { useKaryawan } from "@/hooks/useEmployee";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { 
  FiUsers, 
  FiUserCheck, 
  FiFileText, 
  FiUser,
  FiTrendingUp,
  FiClock
} from "react-icons/fi";

export default function EmployeeMonitoring() {
  const { list, loading } = useKaryawan();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = useMemo(() => {
    const byStatus: { [key: string]: number } = {};
    const byRole: { [key: string]: number } = {};
    const byDepartment: { [key: string]: number } = {};
    
    list.forEach((k) => {
      const st = (k.statusKerja ?? "UNKNOWN") as string;
      const rl = (k.role ?? "OTHER") as string;
      const dept = (k.department ?? "GENERAL") as string;
      
      byStatus[st] = (byStatus[st] || 0) + 1;
      byRole[rl] = (byRole[rl] || 0) + 1;
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    });
    
    return { 
      byStatus, 
      byRole, 
      byDepartment,
      total: list.length,
      tetap: byStatus["Tetap"] ?? 0,
      kontrak: byStatus["Kontrak"] ?? 0,
      outsourcing: byStatus["Outsourcing"] ?? 0
    };
  }, [list]);

  // Data untuk pie chart
  const statusPieData = useMemo(() => {
    return Object.entries(stats.byStatus).map(([name, value]) => ({
      name,
      value,
    }));
  }, [stats.byStatus]);

  // Warna untuk charts
  const COLORS = ['#4C6FFF', '#FF7D05', '#05CE91', '#9747FF', '#FF4B91', '#FFBD0A'];
  
  // Custom tooltip untuk charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string; }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600 dark:text-blue-400">{`Total: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const cardStyle = "shadow-xl rounded-2xl p-6 flex items-center gap-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#222F65] dark:to-[#1D2247] transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer";

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-16 w-16 border-b-4 border-blue-600 rounded-full" />
      </div>
    );

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Monitoring Karyawan</h2>
          <p className="text-gray-500 dark:text-gray-300 mt-1">Pantau dan analisis data karyawan perusahaan secara real-time</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-md p-1 flex">
          <button 
            onClick={() => setActiveTab("overview")} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "overview" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("details")} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "details" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            Detail
          </button>
        </div>
      </div>

      {/* === STAT CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* total */}
        <div className={cardStyle}>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <FiUsers size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">Total Karyawan</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</h3>
            <div className="flex items-center mt-1 text-xs text-green-600 dark:text-green-400">
              <FiTrendingUp className="mr-1" />
              <span>+5% dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Tetap */}
        <div className={cardStyle}>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <FiUserCheck size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">Karyawan Tetap</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.tetap}
            </h3>
            <div className="flex items-center mt-1 text-xs text-green-600 dark:text-green-400">
              <FiTrendingUp className="mr-1" />
              <span>{Math.round((stats.tetap / stats.total) * 100)}% dari total</span>
            </div>
          </div>
        </div>

        {/* Kontrak */}
        <div className={cardStyle}>
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
            <FiFileText size={32} className="text-orange-500 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">Karyawan Kontrak</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.kontrak}
            </h3>
            <div className="flex items-center mt-1 text-xs text-orange-500 dark:text-orange-400">
              <FiClock className="mr-1" />
              <span>Rata-rata 1.5 tahun</span>
            </div>
          </div>
        </div>

        {/* Outsourcing */}
        <div className={cardStyle}>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <FiUser size={32} className="text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Outsourcing
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.outsourcing}
            </h3>
            <div className="flex items-center mt-1 text-xs text-purple-500 dark:text-purple-400">
              <FiClock className="mr-1" />
              <span>3 vendor partner</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* === PIE CHART === */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#222F65] shadow-xl border border-gray-100 dark:border-blue-900/20 transition-all duration-300 hover:shadow-2xl">
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Persentase Status Kerja
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* === BAR CHART (ROLE) === */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#222F65] shadow-xl border border-gray-100 dark:border-blue-900/20 transition-all duration-300 hover:shadow-2xl">
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Distribusi Role
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(stats.byRole).map(([k, v]) => ({
                  name: k.replaceAll("_", " "),
                  value: v,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {Object.entries(stats.byRole).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <>
          {/* === BAR CHART (STATUS) === */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#222F65] shadow-xl border border-gray-100 dark:border-blue-900/20 transition-all duration-300 hover:shadow-2xl">
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Detail Status Kerja
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(stats.byStatus).map(([k, v]) => ({
                  name: k,
                  value: v,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#4C6FFF" radius={[4, 4, 0, 0]}>
                  {Object.entries(stats.byStatus).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* === DEPARTMENT DISTRIBUTION === */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#222F65] shadow-xl border border-gray-100 dark:border-blue-900/20 transition-all duration-300 hover:shadow-2xl">
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Distribusi Departemen
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(stats.byDepartment).map(([k, v]) => ({
                  name: k,
                  value: v,
                }))}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {Object.entries(stats.byDepartment).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Footer dengan informasi update */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-10">
        <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </section>
  );
}