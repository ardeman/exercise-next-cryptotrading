import { currencyFormatter } from "@/utils/formatter"

const fiatFormatterOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}
const cryptoFormatterOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 8,
}

const OrderTable = (props) => {
  const { orders } = props

  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg h-96 overflow-y-auto">
      <table className="w-full text-sm text-left text-gray-500 table-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-2 py-3">Price</th>
            <th scope="col" className="px-2 py-3">BTC</th>
            <th scope="col" className="px-2 py-3">IDR</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => (
            <tr className="bg-white border-b text-xs" key={item.price}>
              <td scope="row" className="px-2 py-1.5">
                {currencyFormatter(
                  Number(item.price),
                  fiatFormatterOptions
                )}</td>
              <td className="px-2 py-1">{currencyFormatter(
                Number(item.btc_volume),
                cryptoFormatterOptions
              )}</td>
              <td className="px-2 py-1">{currencyFormatter(
                Number(item.idr_volume),
                cryptoFormatterOptions
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable