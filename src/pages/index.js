import { Inter } from "next/font/google";
import OrderBook from "@/components/OrderBook";
import CandlestickChart from "@/components/CandlestickChart";
import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const symbol = "btcidr";
  const marketChannel = `market:order-book-${symbol}`
  const chartChannel = `chart:tick-${symbol}`
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Establish a WebSocket connection
    const ws = new W3CWebSocket("wss://ws3.indodax.com/ws/");

    // Handle connection opened
    ws.onopen = () => {
      console.log("wss://ws3.indodax.com/ws/ connection opened");

      // Authenticate after connection
      const authRequest = {
        params: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5NDY2MTg0MTV9.UR1lBM6Eqh0yWz-PVirw1uPCxe60FdchR8eNVdsskeo",
        },
        id: 1,
      };
      ws.send(JSON.stringify(authRequest));
    };

    // Handle incoming messages
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      // If authenticated, request orderbook data
      if (data.result.client) {
        const orderBookRequest = {
          method: 1,
          params: {
            channel: marketChannel,
          },
          id: 4,
        };
        ws.send(JSON.stringify(orderBookRequest));

        const chartRequest = {
          method: 1,
          params: {
            channel: chartChannel,
            recover: true,
            offset: 820574
          },
          id: 2
        };
        ws.send(JSON.stringify(chartRequest));
      }

      if (data.result.channel === marketChannel) {
        const { ask, bid } = data.result.data.data;
        setAsks(ask);
        setBids(bid);
      }

      if (data.result.recoverable) {
        const newChartData = data.result.publications;
        setChartData(newChartData)
      }

      if (data.result.channel === chartChannel) {
        const newChartData = data.result.data;
        setChartData(prevChartData => [...prevChartData, newChartData])
      }
    };

    // Handle connection closed
    ws.onclose = () => {
      console.log("wss://ws3.indodax.com/ws/ connection closed");
    };

    // Clean up WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <CandlestickChart chartData={chartData} />
      <OrderBook asks={asks} bids={bids} />
    </main>
  );
}
