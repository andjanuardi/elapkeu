'use client';

import fetchData from '@/lib/fetch';
import { useCallback, useEffect, useState } from 'react';

export default function Table() {
  const [isLoading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);

  const getData = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchData('/api/dashboard/grafikTahap');
    setDataTable(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  let total_anggaran = 0;
  let total_penyaluran = 0;
  let total_realisasi = 0;
  let total_sisa = 0;

  return isLoading ? (
    <div className="skeleton h-70 col-span-4"></div>
  ) : (
    <div className="card  bg-base-100 card-sm shadow-sm col-span-4">
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Tahap</th>
              <th className="text-right">Anggaran</th>
              <th className="text-right">Penyaluran</th>
              <th className="text-right">Realisasi</th>
              <th className="text-right">Sisa</th>
              <th className="text-right">Persentase</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((value, key) => {
              const item = dataTable[key];
              const tahap = value || 0;
              const rencana_anggaran = item?.rencana_anggaran || 0;
              const penyaluran = item?.penyaluran || 0;
              const realisasi = item?.realisasi || 0;
              const sisa = rencana_anggaran - realisasi || 0;
              const persen = (realisasi / rencana_anggaran) * 100 || 0;

              total_anggaran += rencana_anggaran;
              total_penyaluran += penyaluran;
              total_realisasi += realisasi;
              total_sisa += sisa;

              return (
                <tr key={key}>
                  <td>Tahap {tahap}</td>
                  <td className="text-right">
                    {rencana_anggaran?.toLocaleString('id-ID')}
                  </td>
                  <td className="text-right">
                    {penyaluran?.toLocaleString('id-ID')}
                  </td>
                  <td className="text-right">
                    {realisasi?.toLocaleString('id-ID')}
                  </td>
                  <td className="text-right">
                    {sisa?.toLocaleString('id-ID')}
                  </td>
                  <td className="text-right">
                    {persen?.toLocaleString('id-ID', {
                      maximumFractionDigits: 2,
                    })}{' '}
                    %
                  </td>
                </tr>
              );
            })}
            <tr>
              <th>Total</th>
              <th className="text-right">
                {total_anggaran?.toLocaleString('id-ID')}
              </th>
              <th className="text-right">
                {total_penyaluran?.toLocaleString('id-ID')}
              </th>
              <th className="text-right">
                {total_realisasi?.toLocaleString('id-ID')}
              </th>
              <th className="text-right">
                {total_sisa?.toLocaleString('id-ID')}
              </th>
              <th className="text-right">
                {(
                  (total_realisasi / total_anggaran) * 100 || 0
                )?.toLocaleString('id-ID', {
                  maximumFractionDigits: 2,
                })}{' '}
                %
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
