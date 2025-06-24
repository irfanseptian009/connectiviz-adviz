import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexBarChartProps {
  data: Array<{ category: string; value?: number; [key: string]: string | number | undefined }>;
  height?: number;
  colors?: string[];
  horizontal?: boolean;
  title?: string;
}

export function ApexBarChart({
  data,
  height = 400,
  colors = ['#3b82f6'],
  horizontal = false,
  title = '',
}: ApexBarChartProps) {
  // Extract series data
  const seriesData = Object.keys(data[0] || {}).filter(key => key !== 'category');
    const series = seriesData.length > 1 && seriesData.some(key => key !== 'value') 
    ? seriesData.filter(key => key !== 'category').map((key, index) => ({
        name: key,
        data: data.map(item => Number(item[key]) || 0),
        color: colors[index % colors.length]
      }))
    : [{
        name: 'Value',
        data: data.map(item => Number(item.value) || 0),
        color: colors[0]
      }];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height,
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal,
        columnWidth: '60%',
        dataLabels: { position: 'top' },
      },
    },
    colors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: data.map(item => item.category),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: title },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString(),
      },
    },
    legend: {
      show: series.length > 1,
      position: 'top',
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5,
    },
    theme: {
      mode: 'light',
    },
  };

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={height}
      />
    </div>
  );
}
