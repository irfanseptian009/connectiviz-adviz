import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexAreaChartProps {
  data: Array<{ category: string; value?: number; [key: string]: string | number | undefined }>;
  height?: number;
  colors?: string[];
  title?: string;
  fill?: boolean;
}

export function ApexAreaChart({
  data,
  height = 400,
  colors = ['#3b82f6'],
  title = '',
  fill = true,
}: ApexAreaChartProps) {
  // Extract series data
  const seriesData = Object.keys(data[0] || {}).filter(key => key !== 'category');
    const series = seriesData.length > 1 && seriesData.some(key => key !== 'value') 
    ? seriesData.filter(key => key !== 'category').map((key) => ({
        name: key,
        data: data.map(item => Number(item[key]) || 0),
      }))
    : [{
        name: 'Value',
        data: data.map(item => Number(item.value) || 0),
      }];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height,
      toolbar: { show: false },
      background: 'transparent',
      zoom: { enabled: false },
    },
    colors,
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: fill ? 'gradient' : 'solid',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: data.map(item => item.category),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: title },
    },
    tooltip: {
      x: { format: 'dd/MM/yy HH:mm' },
    },
    legend: {
      show: series.length > 1,
      position: 'top',
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5,
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
        type="area"
        height={height}
      />
    </div>
  );
}
