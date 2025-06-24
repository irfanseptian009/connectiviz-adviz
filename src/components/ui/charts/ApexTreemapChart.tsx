import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexTreemapChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
  colors?: string[];
  title?: string;
}

export function ApexTreemapChart({
  data,
  height = 400,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  title = '',
}: ApexTreemapChartProps) {
  const series = [{
    data: data.map((item, index) => ({
      x: item.name,
      y: item.value,
      fillColor: colors[index % colors.length],
    })),
  }];

  const options: ApexOptions = {
    chart: {
      type: 'treemap',
      height,
      toolbar: { show: false },
      background: 'transparent',
    },
    colors,
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff'],
      },      formatter: (text: string, op: { value: number }) => {
        return [text, op.value.toString()];
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString(),
      },
    },
    legend: {
      show: false,
    },
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
        type="treemap"
        height={height}
      />
    </div>
  );
}
