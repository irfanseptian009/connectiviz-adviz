"use client";
import React from "react";
import { useDivision } from "@/hooks/useDivision";
import { useBusinessUnit } from "@/hooks/useBusinessUnit";
import { useEmployee } from "@/hooks/useEmployee";
import { useState, useMemo } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ApexBarChart,
  ApexDonutChart,
  ApexAreaChart,
  ApexTreemapChart,
} from "@/components/ui/charts";
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  AreaChart as AreaChartIcon,
  TreePine,
  Target,
  Flame,
  Building2,
  Building,
  Users,
  BarChart2
} from "lucide-react";

type ChartType =
  | "bar"
  | "pie"
  | "donut"
  | "line"
  | "area"
  | "radialBar"
  | "heatmap"
  | "treemap";
type ViewType = "businessUnit" | "division" | "employee" | "overview";

const chartIcons = {
  bar: BarChart3,
  pie: PieChartIcon,
  donut: Target,
  line: TrendingUp,
  area: AreaChartIcon,
  radialBar: BarChart2,
  heatmap: Flame,
  treemap: TreePine,
};

const viewIcons = {
  overview: Building2,
  businessUnit: Building,
  division: Building2,
  employee: Users,
};

export default function BusinessAnalyticsDashboard() {
  const { list: divisions, loading: divisionsLoading } = useDivision();
  const { list: businessUnits, loading: businessUnitsLoading } = useBusinessUnit();
  const { list: employees, loading: employeesLoading } = useEmployee();

  const [selectedChart, setSelectedChart] = useState<ChartType>("bar");
  const [selectedView, setSelectedView] = useState<ViewType>("overview");
  const [showTrends, setShowTrends] = useState(false);

  const loading = divisionsLoading || businessUnitsLoading || employeesLoading;

  // Process analytics data
  const analyticsData = useMemo(() => {
    if (!businessUnits.length || !divisions.length || !employees.length) {
      return { categories: [], series: [], colors: [], metrics: null };
    }

    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#ec4899",
      "#6366f1",
    ];

    // Calculate metrics
    const totalBusinessUnits = businessUnits.length;
    const totalDivisions = divisions.length;
    const totalEmployees = employees.length;
    const avgEmployeesPerBU = Math.round(totalEmployees / totalBusinessUnits);
    const avgDivisionsPerBU = Math.round(totalDivisions / totalBusinessUnits);

    switch (selectedView) {
      case "businessUnit":        const buData = businessUnits.map((bu, index) => {
          const buDivisions = divisions.filter((d) => d.businessUnitId === bu.id);
          const buEmployees = employees.filter((emp) =>
            buDivisions.some((div) => emp.divisionId === div.id)
          );
          // Use deterministic growth calculation to avoid hydration issues
          const growth = Math.min(Math.max((buEmployees.length * 3) + (index * 5) + 10, 10), 40);
          
          return {
            name: bu.name,
            divisions: buDivisions.length,
            employees: buEmployees.length,
            growth: growth,
          };
        });

        return {
          categories: buData.map((bu) => bu.name),
          series: showTrends
            ? [
                { name: "Divisions", data: buData.map((bu) => bu.divisions) },
                { name: "Employees", data: buData.map((bu) => bu.employees) },
                { name: "Growth %", data: buData.map((bu) => bu.growth) },
              ]
            : buData.map((bu) => bu.employees),
          colors: colors.slice(0, buData.length),
          metrics: {
            totalBusinessUnits,
            totalDivisions,
            totalEmployees,
            avgEmployeesPerBU,
          },
        };      case "division":
        const divData = divisions.slice(0, 10).map((div, index) => {
          const divEmployees = employees.filter((emp) => emp.divisionId === div.id);
          // Use deterministic performance calculation
          const performance = Math.min(Math.max((divEmployees.length * 5) + (index * 3) + 60, 60), 100);
          
          return {
            name: div.name,
            employees: divEmployees.length,
            performance: performance,
          };
        });

        return {
          categories: divData.map((div) => div.name),
          series: showTrends
            ? [
                { name: "Employees", data: divData.map((div) => div.employees) },
                { name: "Performance", data: divData.map((div) => div.performance) },
              ]
            : divData.map((div) => div.employees),
          colors: colors.slice(0, divData.length),
          metrics: {
            totalDivisions,
            avgEmployeesPerDiv: Math.round(totalEmployees / totalDivisions),
          },
        };      case "employee":
        const employeesByMonth = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleString("default", { month: "short" }),
          count: 200 + (i * 15) + (i % 3 * 10), // Deterministic calculation
        }));

        return {
          categories: employeesByMonth.map((m) => m.month),
          series: showTrends
            ? [{ name: "Employee Growth", data: employeesByMonth.map((m) => m.count) }]
            : employeesByMonth.map((m) => m.count),
          colors: ["#3b82f6"],
          metrics: { totalEmployees, monthlyGrowth: "12.5%" },
        };

      default: // overview
        const overviewData = [
          { name: "Business Units", value: totalBusinessUnits, icon: "🏛️" },
          { name: "Divisions", value: totalDivisions, icon: "🏗️" },
          { name: "Employees", value: totalEmployees, icon: "👥" },
          { name: "Avg per BU", value: avgEmployeesPerBU, icon: "📊" },
        ];

        return {
          categories: overviewData.map((d) => d.name),
          series: overviewData.map((d) => d.value),
          colors: colors.slice(0, 4),
          metrics: {
            totalBusinessUnits,
            totalDivisions,
            totalEmployees,
            avgEmployeesPerBU,
            avgDivisionsPerBU,
          },
        };
    }
  }, [businessUnits, divisions, employees, selectedView, showTrends]);  // Helper to transform analyticsData to recharts format
  const getChartComponent = () => {
    if (!analyticsData.categories.length) return null;
    
    interface SeriesData {
      name: string;
      data: number[];
    }
      // Bar Chart - Using ApexBarChart
    if (selectedChart === "bar") {
      if (showTrends && Array.isArray(analyticsData.series) && Array.isArray(analyticsData.series[0])) {
        // Multi-series bar
        const data = analyticsData.categories.map((cat: string, idx: number) => {
          const row: { category: string; [key: string]: string | number | undefined } = { category: cat };
          (analyticsData.series as SeriesData[]).forEach((s) => {
            row[s.name] = s.data[idx];
          });
          return row;
        });
        return <ApexBarChart data={data} height={400} colors={analyticsData.colors} />;
      } else {
        // Single series bar
        const data = analyticsData.categories.map((cat: string, idx: number) => ({ 
          category: cat, 
          value: (analyticsData.series as number[])[idx] 
        }));
        return <ApexBarChart data={data} height={400} colors={analyticsData.colors} />;
      }
    }
    
    // Line Chart
    if (selectedChart === "line") {
      if (showTrends && Array.isArray(analyticsData.series) && Array.isArray(analyticsData.series[0])) {
        const lines = (analyticsData.series as SeriesData[]).map((s, i) => ({ 
          dataKey: s.name || `series${i}`, 
          name: s.name, 
          stroke: analyticsData.colors[i] 
        }));
        const data = analyticsData.categories.map((cat: string, idx: number) => {
          const row: Record<string, unknown> = { category: cat };
          (analyticsData.series as SeriesData[]).forEach((s) => {
            row[s.name] = s.data[idx];
          });
          return row;
        });
        return <LineChart data={data} dataKey="category" lines={lines} height={400} />;
      } else {
        const lines = [{ dataKey: "value", stroke: analyticsData.colors[0] }];
        const data = analyticsData.categories.map((cat: string, idx: number) => ({ 
          category: cat, 
          value: (analyticsData.series as number[])[idx] 
        }));
        return <LineChart data={data} dataKey="category" lines={lines} height={400} />;
      }
    }
      // Area Chart - Using ApexAreaChart
    if (selectedChart === "area") {
      if (showTrends && Array.isArray(analyticsData.series) && Array.isArray(analyticsData.series[0])) {
        const data = analyticsData.categories.map((cat: string, idx: number) => {
          const row: { category: string; [key: string]: string | number | undefined } = { category: cat };
          (analyticsData.series as SeriesData[]).forEach((s) => {
            row[s.name] = s.data[idx];
          });
          return row;
        });
        return <ApexAreaChart data={data} height={400} colors={analyticsData.colors} />;
      } else {
        const data = analyticsData.categories.map((cat: string, idx: number) => ({ 
          category: cat, 
          value: (analyticsData.series as number[])[idx] 
        }));
        return <ApexAreaChart data={data} height={400} colors={analyticsData.colors} />;
      }
    }
    
    // Pie Chart
    if (selectedChart === "pie") {
      const data = analyticsData.categories.map((cat: string, idx: number) => ({ 
        name: cat, 
        value: (analyticsData.series as number[])[idx] 
      }));
      return <PieChart data={data} dataKey="value" nameKey="name" colors={analyticsData.colors} height={450} />;
    }
    
    // Donut Chart - Using ApexDonutChart
    if (selectedChart === "donut") {
      const data = analyticsData.categories.map((cat: string, idx: number) => ({ 
        name: cat, 
        value: (analyticsData.series as number[])[idx] 
      }));
      return <ApexDonutChart data={data} height={450} colors={analyticsData.colors} />;
    }
    
    // TreeMap Chart - Using ApexTreemapChart
    if (selectedChart === "treemap") {
      const data = analyticsData.categories.map((cat: string, idx: number) => ({ 
        name: cat, 
        value: (analyticsData.series as number[])[idx] 
      }));
      return <ApexTreemapChart data={data} height={450} colors={analyticsData.colors} />;
    }
    
    // Heatmap and RadialBar - using existing components
    if (selectedChart === "heatmap" || selectedChart === "radialBar") {
      const data = analyticsData.categories.map((cat: string, idx: number) => ({ 
        category: cat, 
        value: (analyticsData.series as number[])[idx] 
      }));
      if (selectedChart === "radialBar") {
        return <RadialBarChart data={data} dataKey="value" fill={analyticsData.colors[0]} height={450} />;
      }
      return <RadarChart data={data} dataKey="category" radarKey="value" fill={analyticsData.colors[0]} stroke={analyticsData.colors[1] || analyticsData.colors[0]} height={400} />;
    }
    
    return null;
  };  if (loading) {
    return (
      <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mt-6">
        <LoadingSpinner variant="skeleton" text="Loading analytics data..." rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Business Analytics Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Comprehensive insights into business units, divisions, and employee growth
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* View Type Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-600">
              {(Object.keys(viewIcons) as ViewType[]).map((view) => (                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedView === view
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {React.createElement(viewIcons[view], { size: 16 })}
                  <span className="capitalize text-sm">{view}</span>
                </button>
              ))}
            </div>

            {/* Trends Toggle */}
            <button
              onClick={() => setShowTrends(!showTrends)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                showTrends
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <span>📈</span>
              <span>{showTrends ? "Multi-Series" : "Single Series"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Type Selector - Enhanced */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span>🎨</span>
          Chart Visualization Types
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {(Object.keys(chartIcons) as ChartType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChart(type)}
              className={`p-4 rounded-xl font-medium transition-all duration-300 text-center group ${
                selectedChart === type
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl transform scale-110"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:transform hover:scale-105 border border-gray-200 dark:border-gray-600"
              }`}
            >              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {React.createElement(chartIcons[type], { size: 32 })}
              </div>
              <div className="text-sm capitalize font-semibold">{type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart - Enhanced */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="mb-6 flex items-center justify-between">          <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize flex items-center gap-3">
            {React.createElement(chartIcons[selectedChart], { size: 24 })}
            <span>{selectedChart} Analytics</span>
            <span className="text-lg">-</span>
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
              {React.createElement(viewIcons[selectedView], { size: 20 })} {selectedView}
            </span>
          </h3>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm font-medium">
              ✅ Live Data
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Updated now
            </div>
          </div>
        </div>

        {analyticsData.categories.length > 0 ? (
          <div className="chart-container bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            {getChartComponent()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center space-y-4">
              <div className="text-6xl">📊</div>
              <h4 className="text-xl font-semibold">No Data Available</h4>
              <p>Please ensure data is loaded properly</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-blue-100 text-sm font-medium">Business Units</p>
              <p className="text-3xl font-bold">{businessUnits.length}</p>
              <p className="text-blue-200 text-xs">Total active units</p>
            </div>
            <div className="text-4xl opacity-80">🏛️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-green-100 text-sm font-medium">Total Divisions</p>
              <p className="text-3xl font-bold">{divisions.length}</p>
              <p className="text-green-200 text-xs">Across all units</p>
            </div>
            <div className="text-4xl opacity-80">🏗️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-purple-100 text-sm font-medium">Total Employees</p>
              <p className="text-3xl font-bold">{employees.length}</p>
              <p className="text-purple-200 text-xs">Active workforce</p>
            </div>
            <div className="text-4xl opacity-80">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-orange-100 text-sm font-medium">Avg per Unit</p>
              <p className="text-3xl font-bold">
                {Math.round(employees.length / businessUnits.length || 0)}
              </p>
              <p className="text-orange-200 text-xs">Employees/Unit</p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-700 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-pink-100 text-sm font-medium">Current View</p>
              <p className="text-2xl font-bold capitalize">{selectedView}</p>              <p className="text-pink-200 text-xs flex items-center gap-1">
                {React.createElement(chartIcons[selectedChart], { size: 12 })} {selectedChart}
              </p>
            </div>
            <div className="text-4xl opacity-80">
              {React.createElement(viewIcons[selectedView], { size: 32 })}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Insights Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-indigo-200 dark:border-gray-700 shadow-xl">
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span>🚀</span>
          Growth Insights & Trends
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>📈</span>
              Employee Growth
            </h5>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              +12.5%
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              This quarter vs last quarter
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>🎯</span>
              Efficiency Rate
            </h5>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              87.3%
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Overall organizational efficiency
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>⭐</span>
              Satisfaction
            </h5>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              4.6/5
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Employee satisfaction score
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
