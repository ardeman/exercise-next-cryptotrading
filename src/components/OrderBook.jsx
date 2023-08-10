import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import OrderTable from './OrderTable';

const OrderBook = () => {
  const channel = "market:order-book-btcidr";
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);

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
            channel: channel,
          },
          id: 4,
        };
        ws.send(JSON.stringify(orderBookRequest));
      }

      if (data.result.channel === channel) {
        const { ask, bid } = data.result.data.data;
        setAsks(ask);
        setBids(bid);
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
    <div className='grid w-full gap-2'>
      <div className='grid grid-cols-2 gap-2'>
        <div>
          <h2 className='text-sm'>Ask</h2>
          <OrderTable orders={asks} />
        </div>
        <div>
          <h2 className='text-sm'>Bid</h2>
          <OrderTable orders={bids} />
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
