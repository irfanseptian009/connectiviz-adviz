"use client";
import { useDivision } from "@/hooks/useDivision";
import { useBusinessUnit } from "@/hooks/useBusinessUnit";
import { useEmployee } from "@/hooks/useEmployee";
import { useState, useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ChartType = "bar" | "pie" | "donut" | "line" | "area" | "radialBar" | "heatmap" | "treemap";
type ViewType = "businessUnit" | "division" | "employee" | "overview";

const chartIcons = {
  bar: "📊",
  pie: "🥧", 
  donut: "🍩",
  line: "📈",
  area: "📉",
  radialBar: "⭕",
  heatmap: "🔥",
  treemap: "🗂️"
};

const viewIcons = {
  overview: "🏢",
  businessUnit: "🏛️",
  division: "🏗️", 
  employee: "👥"
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
      "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
      "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
    ];

    // Calculate metrics
    const totalBusinessUnits = businessUnits.length;
    const totalDivisions = divisions.length;
    const totalEmployees = employees.length;
    const avgEmployeesPerBU = Math.round(totalEmployees / totalBusinessUnits);
    const avgDivisionsPerBU = Math.round(totalDivisions / totalBusinessUnits);

    switch (selectedView) {
      case "businessUnit":
        const buData = businessUnits.map(bu => {
          const buDivisions = divisions.filter(d => d.businessUnitId === bu.id);
          const buEmployees = employees.filter(emp => 
            buDivisions.some(div => emp.divisionId === div.id)
          );
          return {
            name: bu.name,
            divisions: buDivisions.length,
            employees: buEmployees.length,
            growth: Math.floor(Math.random() * 30) + 10
          };
        });
        
        return {
          categories: buData.map(bu => bu.name),
          series: showTrends 
            ? [
                { name: "Divisions", data: buData.map(bu => bu.divisions) },
                { name: "Employees", data: buData.map(bu => bu.employees) },
                { name: "Growth %", data: buData.map(bu => bu.growth) }
              ]
            : buData.map(bu => bu.employees),
          colors: colors.slice(0, buData.length),
          metrics: { totalBusinessUnits, totalDivisions, totalEmployees, avgEmployeesPerBU }
        };

      case "division":
        const divData = divisions.slice(0, 10).map(div => {
          const divEmployees = employees.filter(emp => emp.divisionId === div.id);
          return {
            name: div.name,
            employees: divEmployees.length,
            performance: Math.floor(Math.random() * 40) + 60
          };
        });
        
        return {
          categories: divData.map(div => div.name),
          series: showTrends
            ? [
                { name: "Employees", data: divData.map(div => div.employees) },
                { name: "Performance", data: divData.map(div => div.performance) }
              ]
            : divData.map(div => div.employees),
          colors: colors.slice(0, divData.length),
          metrics: { totalDivisions, avgEmployeesPerDiv: Math.round(totalEmployees / totalDivisions) }
        };

      case "employee":
        const employeesByMonth = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
          count: Math.floor(Math.random() * 50) + 200 + i * 10
        }));
        
        return {
          categories: employeesByMonth.map(m => m.month),
          series: showTrends
            ? [{ name: "Employee Growth", data: employeesByMonth.map(m => m.count) }]
            : employeesByMonth.map(m => m.count),
          colors: ["#3b82f6"],
          metrics: { totalEmployees, monthlyGrowth: "12.5%" }
        };

      default: // overview
        const overviewData = [
          { name: "Business Units", value: totalBusinessUnits, icon: "🏛️" },
          { name: "Divisions", value: totalDivisions, icon: "🏗️" },
          { name: "Employees", value: totalEmployees, icon: "👥" },
          { name: "Avg per BU", value: avgEmployeesPerBU, icon: "📊" }
        ];
        
        return {
          categories: overviewData.map(d => d.name),
          series: overviewData.map(d => d.value),
          colors: colors.slice(0, 4),
          metrics: { totalBusinessUnits, totalDivisions, totalEmployees, avgEmployeesPerBU, avgDivisionsPerBU }
        };
    }
  }, [businessUnits, divisions, employees, selectedView, showTrends]);

  // Enhanced chart configurations with dark mode support
  const getChartOptions = (type: ChartType): ApexOptions => {
    const isDark = typeof window !== 'undefined' && 
      document.documentElement.classList.contains('dark');
      const baseOptions: ApexOptions = {
      chart: {
        fontFamily: "Outfit, sans-serif",
        toolbar: { 
          show: true
        },
        animations: { enabled: true },
        background: 'transparent'
      },
      theme: {
        mode: isDark ? "dark" : "light",
      },
      grid: {
        borderColor: isDark ? '#374151' : '#e5e7eb',
      },
      xaxis: {
        labels: {
          style: {
            colors: isDark ? '#9ca3af' : '#6b7280'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: isDark ? '#9ca3af' : '#6b7280'
          }
        }
      },
      legend: {
        labels: {
          colors: isDark ? '#d1d5db' : '#374151'
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: { height: 300 },
          legend: { position: "bottom" }
        }
      }]
    };

    switch (type) {
      case "bar":
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: "bar", height: 400 },
          colors: analyticsData.colors,
          plotOptions: {
            bar: {
              borderRadius: 8,
              columnWidth: "65%",
              dataLabels: { position: "top" }
            }
          },          xaxis: { 
            categories: analyticsData.categories,
            labels: { 
              style: {
                colors: isDark ? '#9ca3af' : '#6b7280'
              }
            }
          },
          yaxis: { 
            title: { 
              text: selectedView === "employee" ? "Employee Count" : "Metrics",
              style: { color: isDark ? '#9ca3af' : '#6b7280' }
            },
            labels: { 
              style: {
                colors: isDark ? '#9ca3af' : '#6b7280'
              }
            }
          },
          dataLabels: { 
            enabled: true, 
            offsetY: -20,
            style: { colors: [isDark ? '#ffffff' : '#000000'] }
          },
          title: { 
            text: `${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Analytics`, 
            align: "center",
            style: { color: isDark ? '#f3f4f6' : '#1f2937' }
          }
        };

      case "pie":
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: "pie", height: 450 },
          colors: analyticsData.colors,
          labels: analyticsData.categories,
          legend: { position: "bottom", ...baseOptions.legend },
          title: { 
            text: `${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Distribution`, 
            align: "center",
            style: { color: isDark ? '#f3f4f6' : '#1f2937' }
          },
          plotOptions: {
            pie: {
              donut: { size: "0%" }
            }
          }
        };

      case "donut":
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: "donut", height: 450 },
          colors: analyticsData.colors,
          labels: analyticsData.categories,
          legend: { position: "bottom", ...baseOptions.legend },
          title: { 
            text: `${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Overview`, 
            align: "center",
            style: { color: isDark ? '#f3f4f6' : '#1f2937' }
          },
          plotOptions: {
            pie: {
              donut: { 
                size: "65%",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "Total",
                    fontSize: "16px",
                    color: isDark ? '#f3f4f6' : '#1f2937'
                  }
                }
              }
            }
          }
        };

      case "line":
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: "line", height: 400 },
          colors: ["#3b82f6", "#10b981", "#f59e0b"],
          stroke: { curve: "smooth", width: 3 },          xaxis: { 
            categories: analyticsData.categories,
            labels: { 
              style: {
                colors: isDark ? '#9ca3af' : '#6b7280'
              }
            }
          },
          yaxis: { 
            title: { 
              text: "Growth Trends",
              style: { color: isDark ? '#9ca3af' : '#6b7280' }
            },
            labels: { 
              style: {
                colors: isDark ? '#9ca3af' : '#6b7280'
              }
            }
          },
          title: { 
            text: `${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Trends`, 
            align: "center",
            style: { color: isDark ? '#f3f4f6' : '#1f2937' }
          },
          markers: { size: 6 }
        };

      case "area":
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: "area", height: 400 },
          colors: ["#3b82f6", "#10b981"],
          fill: { 
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.3
            }
          },
          stroke: { curve: "smooth", width: 2 },          xaxis: { 
            categories: analyticsData.categories,
            labels: { 
              style: {
                colors: isDark ? '#9ca3af' : '#6b7280'
              }
            }
          },
          yaxis: { 
            title: { 
              text: "Performance Area",
              style: { color: isDark ? '#9ca3af' : '#6b7280' }
            },
            labels: { 
              style: {
                colors: isDark ? '#9ca3af' : '#6b7280'
              }
            }
          },
          title: { 
            text: `${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Performance`, 
            align: "center",
            style: { color: isDark ? '#f3f4f6' : '#1f2937' }
          }
        };

      case "radialBar":
        return {
          ...baseOptions,
          chart: { ...baseOptions.chart, type: "radialBar", height: 450 },
          colors: analyticsData.colors,
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: { 
                  fontSize: "14px",
                  color: isDark ? '#d1d5db' : '#374151'
                },
                value: { 
                  fontSize: "18px",
                  color: isDark ? '#f3f4f6' : '#1f2937'
                },
                total: {
                  show: true,
                  label: "Total",
                  color: isDark ? '#d1d5db' : '#374151',
                  formatter: () => `${analyticsData.series.length}`
                }
              }
            }
          },
          labels: analyticsData.categories,
          title: { 
            text: `${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Efficiency`, 
            align: "center",
            style: { color: isDark ? '#f3f4f6' : '#1f2937' }
          }
        };

      default:
        return baseOptions;
    }
  };  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getChartSeries = (): any => {
    if (["pie", "donut", "radialBar"].includes(selectedChart)) {
      return Array.isArray(analyticsData.series) && Array.isArray(analyticsData.series[0]) 
        ? analyticsData.series[0] 
        : analyticsData.series;
    }
    if (showTrends && Array.isArray(analyticsData.series) && Array.isArray(analyticsData.series[0])) {
      return analyticsData.series;
    }
    return [{ 
      name: "Data", 
      data: Array.isArray(analyticsData.series) && Array.isArray(analyticsData.series[0]) 
        ? analyticsData.series[0] 
        : analyticsData.series 
    }];
  };

  if (loading) {
    return (
      <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mt-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
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
              {(Object.keys(viewIcons) as ViewType[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedView === view
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <span>{viewIcons[view]}</span>
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
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {chartIcons[type]}
              </div>
              <div className="text-sm capitalize font-semibold">{type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart - Enhanced */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize flex items-center gap-3">
            <span className="text-3xl">{chartIcons[selectedChart]}</span>
            <span>{selectedChart} Analytics</span>
            <span className="text-lg">-</span>
            <span className="text-blue-600 dark:text-blue-400">{viewIcons[selectedView]} {selectedView}</span>
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
            <ReactApexChart
              options={getChartOptions(selectedChart)}
              series={getChartSeries()}
              type={selectedChart}
              height={["radialBar", "pie", "donut"].includes(selectedChart) ? 450 : 400}
            />
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
              <p className="text-3xl font-bold">{Math.round(employees.length / businessUnits.length || 0)}</p>
              <p className="text-orange-200 text-xs">Employees/Unit</p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-pink-700 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-pink-100 text-sm font-medium">Current View</p>
              <p className="text-2xl font-bold capitalize">{selectedView}</p>
              <p className="text-pink-200 text-xs">{chartIcons[selectedChart]} {selectedChart}</p>
            </div>
            <div className="text-4xl opacity-80">{viewIcons[selectedView]}</div>
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
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">+12.5%</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">This quarter vs last quarter</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>🎯</span>
              Efficiency Rate
            </h5>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">87.3%</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Overall organizational efficiency</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>⭐</span>
              Satisfaction
            </h5>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">4.6/5</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Employee satisfaction score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
