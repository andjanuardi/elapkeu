'use client';
import fetchData from '@/lib/fetch';
import { useCallback, useEffect, useState } from 'react';
import { MdAddChart } from 'react-icons/md';

export default function Indikator() {
  const [dataIndikator, setDataIndikator] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchData('/api/dashboard/indikator');
    const { data: penyalurandata } = await fetchData('/api/penyaluran');

    const dataPenyaluran = penyalurandata.reduce(
      (acc, curr) => (acc += parseFloat(curr.nilai)),
      0
    );

    const sisa = data?.rencana_anggaran - data?.realisasi || null;
    const persen_penyaluran =
      (dataPenyaluran / data?.rencana_anggaran) * 100 || null;
    const persen_realisasi =
      (data?.realisasi / data?.rencana_anggaran) * 100 || null;
    const persen_sisa = (sisa / data?.rencana_anggaran) * 100 || null;

    setDataIndikator([
      {
        title: 'TOTAL ANGGARAN',
        value: data?.rencana_anggaran,
        icon: <MdAddChart className="text-7xl text-success" />,
      },
      {
        title: 'TOTAL PENYALURAN ',
        value: dataPenyaluran,
        desc: persen_penyaluran,
        icon: <MdAddChart className="text-7xl text-primary" />,
      },
      {
        title: 'TOTAL REALISASI',
        value: data?.realisasi,
        desc: persen_realisasi,
        icon: <MdAddChart className="text-7xl text-info" />,
      },
      {
        title: 'SISA ANGGARAN',
        value: sisa,
        desc: persen_sisa,
        icon: <MdAddChart className="text-7xl text-warning" />,
      },
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      {isLoading ? (
        <>
          <div className="skeleton h-30"></div>
          <div className="skeleton h-30"></div>
          <div className="skeleton h-30"></div>
          <div className="skeleton h-30"></div>
        </>
      ) : (
        <>
          {dataIndikator.map((item, key) => (
            <div
              key={key}
              className="card bg-base-100 card-sm shadow-sm max-h-fit "
            >
              <div className="card-body place-content-center ">
                <div className=" flex  gap-2 items-center place-content-center ">
                  {item.icon}
                  <div>
                    <div className="flex ">
                      <div className="font-bold text-lg">{item.title}</div>
                      {item.desc && (
                        <>
                          <div className="divider divider-horizontal m-0 "></div>
                          <div className="text-lg font-semibold">
                            {(item.desc || 0).toLocaleString('id-ID', {
                              maximumFractionDigits: 1,
                            })}{' '}
                            %
                          </div>
                        </>
                      )}
                    </div>
                    <div className="font-bold text-lg text-black/50">
                      Rp. {(item?.value || 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
