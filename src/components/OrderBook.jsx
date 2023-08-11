import OrderTable from './OrderTable';

const OrderBook = (props) => {
  const { asks, bids } = props

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
