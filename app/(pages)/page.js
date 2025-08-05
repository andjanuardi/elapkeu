import { MdAddChart, MdInsertChart } from 'react-icons/md';
import { ChartBidang, ChartRealisasi } from './chart';
import Indikator from './indikator';
import Table from './table';

export default function Home() {
  const grafik = [
    {
      title: 'REALISASI PER TAHAP',
      value: <ChartRealisasi />,
    },
    {
      title: 'REALISASI PER BIDANG',
      value: <ChartBidang />,
    },
  ];

  return (
    // <div className="grid grid-cols-1  lg:grid-cols-4  p-4 gap-4 bg-base-200 rounded-2xl  lg:w-full   ">
    <div className="grid grid-cols-1 lg:grid-cols-4   p-4 gap-4 bg-base-200 rounded-2xl  lg:w-full   ">
      {/* ROW 1 */}
      <Indikator />
      {/* ROW 2 */}
      {grafik.map((item, key) => (
        <div
          key={key}
          className="card lg:col-span-2 bg-base-100 card-sm shadow-sm  h-fit "
        >
          <div className="card-body ">
            <h2 className="card-title place-content-center text-xl mb-2">
              {item.title}
            </h2>
            <div className="h-100  flex place-content-center">{item.value}</div>
          </div>
        </div>
      ))}
      {/* ROW 3 */}
      <Table />
    </div>
  );
}
