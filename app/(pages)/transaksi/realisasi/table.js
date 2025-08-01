'use client';
import { tahap } from '@/models/staticData';

import { SwalLoading, SwalSuccess } from '@/app/components/alert';
import { SkeletonTable } from '@/app/components/skeleton';
import fetchData from '@/lib/fetch';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiUploadCloud2Fill,
} from 'react-icons/ri';
import {
  FcEmptyTrash,
  FcFullTrash,
  FcPrint,
  FcSynchronize,
} from 'react-icons/fc';
import Swal from 'sweetalert2';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MdArrowForward, MdArrowForwardIos, MdModeEdit } from 'react-icons/md';
import { getTanggalJam } from '@/lib/func';

export default function TableTahap({ session }) {
  const isAdmin = session.level <= 1;
  const [row, setRow] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [pengaturan, setPengaturan] = useState([]);

  const getData = useCallback(async () => {
    setLoading(true);
    const { data: dataPengaturan } = await fetchData(
      '/api/pengaturan',
      'POST',
      { a: 'waktu' }
    );

    dataPengaturan && setPengaturan(dataPengaturan);

    const { data } = await fetchData('/api/realisasi', 'POST', {
      a: 'getTahap',
    });
    setRow(data);
    setLoading(false);
  }, []);

  async function refresh() {
    getData();
  }

  async function hapus(data) {
    SwalLoading('Menghapus data...');

    await fetchData('/api/realisasi', 'POST', {
      a: 'hapustahap',
      data: [data.kode_opd, data.tahap, data.tahun],
    }).then(() => {
      SwalSuccess(() => getData(), 'Data berhasil di hapus');
    });
  }

  useEffect(() => {
    loading && SwalLoading('Memuat data...');
    !loading && Swal.close();
  }, [loading]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Tahap</th>
                <th>Anggaran</th>
                <th>Realisasi Tahap Ini</th>
                <th>Realisasi Total</th>
                <th className="w-0 text-center">Persentase</th>
                {!isAdmin && <th className="w-0 text-center">Status</th>}
                <th className="text-center">Batas Upload</th>
                <th className="w-0 text-right">
                  <div className="join">
                    <button className="join-item btn" onClick={() => refresh()}>
                      <FcSynchronize />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tahap.map((t, key) => {
                const data = row?.find((r) => r.tahap === t);
                ``;

                const realisasi = data
                  ? row
                      ?.filter((r) => r.tahap <= t)
                      .reduce((total, r) => total + (r.realisasi ?? 0), 0)
                  : '-';

                const persen = data
                  ? (parseFloat(realisasi) / parseFloat(data?.anggaran)) * 100
                  : '-';

                const isBuka =
                  pengaturan.length > 0
                    ? [
                        pengaturan[0].isTahap1_buka,
                        pengaturan[0].isTahap2_buka,
                        pengaturan[0].isTahap3_buka,
                      ]
                    : [];

                return (
                  <tr key={key}>
                    <td>Tahap {t}</td>
                    <td>{data?.anggaran?.toLocaleString('id-ID') || '-'}</td>
                    <td>{data?.realisasi?.toLocaleString('id-ID') || '-'}</td>
                    <td>{realisasi?.toLocaleString('id-ID') || '-'}</td>
                    <td>
                      {persen?.toLocaleString('id-ID') || 0} {data && '%'}
                    </td>
                    {!isAdmin && (
                      <td className="w-0 whitespace-nowrap text-center">
                        <Status stat={data ? data?.status : -1} />
                      </td>
                    )}
                    <td className="text-center">
                      {t === 1 &&
                        getTanggalJam(
                          new Date(pengaturan.map((item) => item.batas_tahap1))
                        )}
                      {t === 2 &&
                        getTanggalJam(
                          new Date(pengaturan.map((item) => item.batas_tahap2))
                        )}
                      {t === 3 &&
                        getTanggalJam(
                          new Date(pengaturan.map((item) => item.batas_tahap3))
                        )}
                    </td>

                    <td className="text-right">
                      <div className="join">
                        {!isAdmin && isBuka[t - 1] === 1 && (
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Upload"
                          >
                            <Link
                              href={`${pathname}/tahap/${t}`}
                              className="join-item btn btn-sm"
                            >
                              <RiUploadCloud2Fill /> {!data && 'Upload'}
                            </Link>
                          </div>
                        )}
                        {data && (
                          <div className="tooltip tooltip-left" data-tip="Ubah">
                            <Link
                              href={`${pathname}/detail/${t}`}
                              className="btn btn-sm"
                            >
                              Detail <MdArrowForwardIos />
                            </Link>
                          </div>
                        )}
                        {data && isBuka[t - 1] === 1 && (
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Hapus"
                          >
                            <button
                              className="btn btn-sm"
                              onClick={() =>
                                Swal.fire({
                                  title: 'Hapus',
                                  html: `Apakah anda yakin menghapus <br/>
                                                          <strong>Tahap ${data.tahap}</strong> ? <br/> <br/>
                                                          <small style=color:red> <i>* Data yang telah di hapus tidak dapat di kembalikan lagi.</i> <small>`,
                                  icon: 'question',
                                  showCancelButton: true,
                                  confirmButtonText: 'Ya, Hapus !',
                                  confirmButtonColor: 'red',
                                  cancelButtonText: 'Tidak, Batalkan !',
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    hapus(data);
                                  }
                                })
                              }
                            >
                              <FcEmptyTrash />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Status({ stat }) {
  return (
    <>
      {stat === 2 && (
        <div className="badge badge-success text-white">
          <RiCheckboxCircleFill /> Selesai
        </div>
      )}
      {stat === 1 && (
        <div className="badge badge-success text-white">
          <RiCheckboxCircleFill /> Selesai
        </div>
      )}
      {stat === -1 && 'Belum Upload'}
      {stat === 0 && (
        <div className="badge badge-warning text-white">
          <RiCloseCircleFill /> Perlu Perbaikan
        </div>
      )}
    </>
  );
}
