import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CandlestickChart = (props) => {
  const { chartData } = props
  const flattenedData = chartData?.flatMap(pub => pub.data);

  const convertArray = (inputArray) => {
    const outputArray = inputArray?.map(item => ({
      epoch: item[0],
      sequence: item[1],
      price: item[2],
      volume: parseFloat(item[3])
    }));

    return outputArray;
  }

  const calculateOHLC = (data, intervalInSeconds = 60) => {
    const ohlcData = [];
    let currentEpoch = null;
    let open = null;
    let high = null;
    let low = null;
    let close = null;

    data?.forEach(item => {
      const { epoch, price } = item;

      if (currentEpoch === null) {
        currentEpoch = epoch;
        open = price;
        high = price;
        low = price;
        close = price;
      } else if (epoch - currentEpoch >= intervalInSeconds) {
        ohlcData.push({
          epoch: currentEpoch,
          open,
          high,
          low,
          close
        });

        currentEpoch = epoch;
        open = price;
        high = price;
        low = price;
        close = price;
      } else {
        high = Math.max(high, price);
        low = Math.min(low, price);
        close = price;
      }
    });

    // Push the last interval
    if (currentEpoch !== null) {
      ohlcData.push({
        epoch: currentEpoch,
        open,
        high,
        low,
        close
      });
    }

    return ohlcData;
  }
  const interval = 15 * 60
  const newChartData = calculateOHLC(convertArray(flattenedData, interval))

  const series = [{
    data: newChartData.map((item, index) => ({
      x: new Date(item.epoch * 1000).getTime(),
      y: [parseFloat(index > 0 ? newChartData[index-1].close : item.open), parseFloat(item.high), parseFloat(item.low), parseFloat(item.close)],
    })),
  }];

  const options = {
    chart: {
      type: 'candlestick',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    }
  };

  return (
    <Chart options={options} series={series} type="candlestick" height={400} width={1000} />
  );
}

export default CandlestickChart