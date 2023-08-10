import dummyData from '@/data/chartData';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CandlestickChart = () => {
  const data = dummyData

  const series = [{
    data: data.map(item => ({
      x: new Date(item.date).getTime(),
      y: [item.open, item.high, item.low, item.close],
    })),
  }];

  const options = {
    chart: {
      type: 'candlestick',
    },
    xaxis: {
      type: 'datetime',
    },
  };

  return (
    <Chart options={options} series={series} type="candlestick" height={400} />
  );
}

export default CandlestickChart