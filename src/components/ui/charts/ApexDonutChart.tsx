import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexDonutChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
  colors?: string[];
  title?: string;
  showLabels?: boolean;
}

export function ApexDonutChart({
  data,
  height = 400,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  title = '',
  showLabels = true,
}: ApexDonutChartProps) {
  const series = data.map(item => item.value);
  const labels = data.map(item => item.name);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      height,
      background: 'transparent',
    },
    colors,
    labels,
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: showLabels,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: '14px',
              color: '#64748b',
              formatter: (val: string) => val,
            },
            total: {
              show: true,
              showAlways: false,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 600,
              color: '#374151',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      markers: {
        size: 12,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString(),
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">
          {title}
        </h3>
      )}
      <Chart
        options={options}
        series={series}
        type="donut"
        height={height}
      />
    </div>
  );
}
