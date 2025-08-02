'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import fetchData from '@/lib/fetch';
import { SwalLoading } from '@/app/components/alert';
import {
  MdArrowBackIos,
  MdArrowForwardIos,
  MdArrowRight,
  MdCheck,
  MdEdit,
} from 'react-icons/md';
import TableDetail from './tableDetail';
import { useRouter } from 'next/navigation';

export default function Table({ level }) {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const activeOPD = searchParams.has('opd') ? searchParams.get('opd') : null;
  const router = useRouter();
  const [dataTable, setDataTable] = useState([]);
  const [dataTableDetail, setDataTableDetail] = useState(null);
  const [activeBidang, setActiveBidang] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [pengaturan, setPengaturan] = useState([]);
  const [dataOPD, setDataOPD] = useState({});

  const getData = useCallback(async () => {
    SwalLoading('Memuat data...');

    const { data: dataPengaturan } = await fetchData(
      '/api/pengaturan',
      'POST',
      { a: 'waktu' }
    );

    dataPengaturan && setPengaturan(dataPengaturan);

    const { data: opd } = await fetchData('/api/opd', 'POST', {
      a: 'cari',
      data: activeOPD,
    });

    opd && setDataOPD(opd[0]);

    const { data } = await fetchData('/api/realisasi', 'POST', {
      a: 'getBidang',
      data: { tahap: id, kode_opd: activeOPD },
    });
    data && setDataTable(data);
    Swal.close();
  }, [id, activeOPD]);

  const getDataDetail = useCallback(
    async (tahap, bidang) => {
      SwalLoading('Memuat data...');
      const { data } = await fetchData('/api/realisasi', 'POST', {
        a: 'getByTahap',
        data: { tahap, bidang, kode_opd: activeOPD },
      });

      data && setDataTableDetail(data);
      Swal.close();
    },
    [activeOPD]
  );

  const isBuka =
    pengaturan.length > 0
      ? [
          pengaturan[0].isTahap1_buka,
          pengaturan[0].isTahap2_buka,
          pengaturan[0].isTahap3_buka,
        ]
      : [];

  const updatePenyaluran = useCallback(
    async (tahap, kode_bidang, kode_opd, penyaluran) => {
      SwalLoading('Memuat data...');
      await fetchData('/api/realisasi', 'POST', {
        a: 'ubahpenyaluran',
        data: {
          tahap,
          kode_opd,
          kode_bidang,
          penyaluran,
        },
      });
      setEditingRow(null);
      getData();
      Swal.close();
    },
    [getData]
  );

  useEffect(() => {
    getData();
  }, [getData, dataTableDetail]);

  return (
    <>
      {!dataTableDetail && (
        <div className="rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th className="w-0">No</th>
                <th>Bidang</th>
                {/* <th className="text-right">Penyaluran Tahap ini</th> */}
                <th className="text-right">Anggaran</th>
                <th className="text-right">Realisasi</th>
                <th className="text-right">Persentase</th>
                <th className="text-right">
                  <button onClick={() => router.back()} className="btn btn-sm">
                    <MdArrowBackIos /> Kembali
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="font-bold">
                  {dataOPD.opd}
                </td>
              </tr>
              {dataTable.map((item, key) => (
                <tr
                  key={key}
                  // onDoubleClick={() => setEditingRow(item.kode_bidang)}
                  // className={`cursor-pointer ${item?.penyaluran ? '' : 'text-error'}`}
                >
                  <td>{key + 1}</td>
                  <td>{item?.bidang || 'N/A'}</td>
                  {/* <td className="text-right">
                    {editingRow === item.kode_bidang ? (
                      <input
                        className="input input-sm max-w-50"
                        defaultValue={item?.penyaluran || null}
                        onBlur={(e) =>
                          e.currentTarget.value &&
                          updatePenyaluran(
                            id,
                            item.kode_bidang,
                            item.kode_opd,
                            e.currentTarget.value
                          )
                        }
                      />
                    ) : (
                      item?.penyaluran.toLocaleString('id-ID') || '-'
                    )}
                  </td> */}
                  <td className="text-right">
                    {item?.rencana_anggaran.toLocaleString('id-ID') || '-'}
                  </td>
                  <td className="text-right">
                    {item?.realisasi.toLocaleString('id-ID') || '-'}
                  </td>
                  <td className="text-right">
                    {(
                      (item?.realisasi / item?.rencana_anggaran) *
                      100
                    ).toLocaleString('id-ID', { maximumFractionDigits: 2 }) ||
                      '-'}
                  </td>
                  <td className="text-right">
                    <div className="join">
                      {/* {editingRow === item.kode_bidang ? (
                        <button
                          className="btn join-item btn-square btn-ghost"
                          onClick={() => setEditingRow(null)}
                        >
                          <MdCheck />
                        </button>
                      ) : (
                        <button
                          className="btn join-item btn-square btn-ghost"
                          onClick={() => setEditingRow(item.kode_bidang)}
                        >
                          <MdEdit />
                        </button>
                      )} */}
                      <button
                        className="btn join-item btn-sm"
                        onClick={() => {
                          setActiveBidang({
                            kode: item?.kode_bidang,
                            bidang: item?.bidang,
                          });
                          getDataDetail(id, item?.kode_bidang);
                        }}
                      >
                        <span>Detail</span>
                        <MdArrowForwardIos />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {dataTableDetail && (
        <TableDetail
          row={dataTableDetail}
          setRow={setDataTableDetail}
          bidang={activeBidang}
          getData={getDataDetail}
          isBuka={isBuka[id - 1]}
          dataOPD={dataOPD}
          level={level}
        />
      )}
    </>
  );
}
