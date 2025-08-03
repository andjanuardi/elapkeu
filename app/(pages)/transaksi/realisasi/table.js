'use client';
import { tahap } from '@/models/staticData';

import { SwalLoading, SwalSuccess } from '@/app/components/alert';
import { SkeletonTable } from '@/app/components/skeleton';
import fetchData from '@/lib/fetch';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RiArrowUpBoxFill,
  RiArrowUpCircleFill,
  RiCheckboxCircleFill,
  RiCheckFill,
  RiCloseCircleFill,
  RiFlagFill,
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
import { ListPicker } from '@/app/components/listPicker';

export default function TableTahap({ session }) {
  const isAdmin = session.level <= 1;
  const [row, setRow] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [pengaturan, setPengaturan] = useState([]);
  const [activeOpd, setOPD] = useState('Semua');

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

  const getDataOPD = useCallback(async (kode_opd = null) => {
    setLoading(true);

    const { data } = await fetchData('/api/realisasi', 'POST', {
      a: 'getTahap',
      data: kode_opd,
    });
    setRow(data);
    setLoading(false);
  }, []);

  const handleAjukan = useCallback(
    async (tahap) => {
      setLoading(true);
      await fetchData('/api/realisasi', 'POST', {
        a: 'updatestatus',
        data: { tahap: tahap, status: 1 },
      }).then(() => {
        SwalSuccess(
          () => getData(),

          'Berhasil di ajukan'
        );
      });
      setLoading(false);
    },
    [getData]
  );

  const handleTolak = useCallback(
    async (tahap, kode_opd) => {
      setLoading(true);
      await fetchData('/api/realisasi', 'POST', {
        a: 'updatestatus',
        data: { tahap: tahap, status: 0, kode_opd: kode_opd },
      }).then(() => {
        SwalSuccess(
          () => getData(),

          'Berhasil di tolak'
        );
      });
      setLoading(false);
    },
    [getData]
  );

  const handleSetuju = useCallback(
    async (tahap, kode_opd) => {
      setLoading(true);
      await fetchData('/api/realisasi', 'POST', {
        a: 'updatestatus',
        data: { tahap: tahap, status: 2, kode_opd: kode_opd },
      }).then(() => {
        SwalSuccess(
          () => getData(),

          'Berhasil di Setujui'
        );
      });
      setLoading(false);
    },
    [getData]
  );

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
        <>
          {session.level <= 1 && (
            <fieldset className="fieldset mb-4 bg-base-200">
              <legend className="fieldset-legend">Pilih OPD</legend>
              <ListPicker
                url={'/api/opd'}
                defaultValue={activeOpd}
                labelIndex={1}
                className="input validator w-full"
                placeholder="Masukkan Nama OPD"
                onItemSelected={(value) => {
                  if (value.kode) {
                    setOPD(value.opd);
                    getDataOPD(value.kode);
                  } else {
                    setOPD('');
                    getDataOPD();
                  }
                }}
                semua
              />
            </fieldset>
          )}
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>Tahap</th>
                  <th className="text-right">Anggaran</th>
                  <th className="text-right">Realisasi Tahap Ini</th>
                  <th className="text-right">Realisasi Total</th>
                  <th className="w-0 text-right">Persentase</th>
                  <th className="w-0 text-center">Status</th>
                  {!isAdmin && <th className="text-center">Batas Upload</th>}
                  <th className="w-0 text-right">
                    <div className="join">
                      <button
                        className="join-item btn"
                        onClick={() => refresh()}
                      >
                        <FcSynchronize />
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {row.length <= 0 ? (
                  <>
                    {tahap.map((t, key) => {
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
                          <td className="text-right">{'-'}</td>
                          <td className="text-right">{'-'}</td>
                          <td className="text-right">{'-'}</td>
                          <td className="text-right">{'-'}</td>
                          <td className="w-0 text-center">
                            <Status stat={-1} />
                          </td>
                          {!isAdmin && (
                            <td className="text-right">
                              {t === 1 &&
                                getTanggalJam(
                                  new Date(
                                    pengaturan.map((item) => item.batas_tahap1)
                                  )
                                )}
                              {t === 2 &&
                                getTanggalJam(
                                  new Date(
                                    pengaturan.map((item) => item.batas_tahap2)
                                  )
                                )}
                              {t === 3 &&
                                getTanggalJam(
                                  new Date(
                                    pengaturan.map((item) => item.batas_tahap3)
                                  )
                                )}
                            </td>
                          )}

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
                                    <RiUploadCloud2Fill /> {'Upload'}
                                  </Link>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {Object.entries(
                      row.reduce((acc, current) => {
                        if (!acc[current.kode_opd]) {
                          acc[current.kode_opd] = current.opd;
                        }
                        return acc;
                      }, [])
                    ).map((item_opd, key_opd) => {
                      const kode_opd = item_opd[0];
                      const nama_opd = item_opd[1];
                      const anggaran_opd = row
                        .filter((item) => item.kode_opd === kode_opd)
                        .reduce(
                          (max, curr) =>
                            curr.anggaran > max ? curr.anggaran : max,
                          0
                        );
                      const realisasi_opd = row
                        .filter((item) => item.kode_opd === kode_opd)
                        .reduce((acc, curr) => (acc += curr.realisasi), 0);
                      const persen_opd = (realisasi_opd / anggaran_opd) * 100;
                      return (
                        <React.Fragment key={key_opd}>
                          <tr className="font-bold">
                            <td>{nama_opd}</td>
                            <td className="text-right">
                              {(anggaran_opd || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="text-right"></td>
                            <td className="text-right">
                              {(realisasi_opd || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="text-right">
                              {(persen_opd || 0).toLocaleString('id-ID', {
                                maximumFractionDigits: 2,
                              })}{' '}
                              %
                            </td>
                          </tr>
                          {tahap.map((t, key) => {
                            const data = row?.find(
                              (r) => r.tahap === t && r.kode_opd === kode_opd
                            );

                            const realisasi = data
                              ? row
                                  ?.filter(
                                    (r) =>
                                      r.tahap <= t && r.kode_opd === kode_opd
                                  )
                                  .reduce(
                                    (total, r) => total + (r.realisasi ?? 0),
                                    0
                                  )
                              : '-';

                            const persen = data
                              ? (parseFloat(realisasi) /
                                  parseFloat(data?.anggaran)) *
                                100
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
                                <td className="text-right">
                                  {data?.anggaran?.toLocaleString('id-ID') ||
                                    '-'}
                                </td>
                                <td className="text-right">
                                  {data?.realisasi?.toLocaleString('id-ID') ||
                                    '-'}
                                </td>
                                <td className="text-right">
                                  {realisasi?.toLocaleString('id-ID') || '-'}
                                </td>
                                <td className="text-right">
                                  {persen?.toLocaleString('id-ID', {
                                    maximumFractionDigits: 2,
                                  }) || 0}{' '}
                                  {data && '%'}
                                </td>
                                <td className="w-0 text-center">
                                  <Status stat={data ? data?.status : -1} />
                                </td>
                                {!isAdmin && (
                                  <td className="text-right">
                                    {t === 1 &&
                                      getTanggalJam(
                                        new Date(
                                          pengaturan.map(
                                            (item) => item.batas_tahap1
                                          )
                                        )
                                      )}
                                    {t === 2 &&
                                      getTanggalJam(
                                        new Date(
                                          pengaturan.map(
                                            (item) => item.batas_tahap2
                                          )
                                        )
                                      )}
                                    {t === 3 &&
                                      getTanggalJam(
                                        new Date(
                                          pengaturan.map(
                                            (item) => item.batas_tahap3
                                          )
                                        )
                                      )}
                                  </td>
                                )}

                                <td className="text-right">
                                  <div className="join">
                                    {isAdmin && data?.status >= 2 && (
                                      <>
                                        <div
                                          className="tooltip tooltip-left "
                                          data-tip="Setujui "
                                        >
                                          {data?.status === 2 && (
                                            <button
                                              className="join-item btn btn-sm text-lg btn-success text-white"
                                              onClick={() =>
                                                Swal.fire({
                                                  title: 'Setuju',
                                                  text: `Anda yakin menyetujui laporan ini?`,
                                                  icon: 'question',
                                                  showCancelButton: true,
                                                  confirmButtonColor: 'green',
                                                  confirmButtonText:
                                                    'Ya, Setujui',
                                                  cancelButtonText: 'Batal',
                                                  allowOutsideClick: false,
                                                }).then((e) => {
                                                  if (e.isConfirmed) {
                                                    handleSetuju(t, kode_opd);
                                                  }
                                                })
                                              }
                                            >
                                              <RiCheckboxCircleFill />
                                            </button>
                                          )}
                                        </div>
                                        <div
                                          className="tooltip tooltip-left"
                                          data-tip="Tolak"
                                        >
                                          <button
                                            className="join-item btn btn-sm text-lg btn-error text-white"
                                            onClick={() =>
                                              Swal.fire({
                                                title: 'Tolak',
                                                text: `Anda yakin menolak laporan ini?`,
                                                icon: 'question',
                                                showCancelButton: true,
                                                confirmButtonColor: 'red',
                                                confirmButtonText: 'Ya, Tolak',
                                                cancelButtonText: 'Batal',
                                                allowOutsideClick: false,
                                              }).then((e) => {
                                                if (e.isConfirmed) {
                                                  handleTolak(t, kode_opd);
                                                }
                                              })
                                            }
                                          >
                                            <RiCloseCircleFill />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                    {!isAdmin && data?.status === 1 && (
                                      <div
                                        className="tooltip tooltip-left "
                                        data-tip="Ajukan"
                                      >
                                        <button
                                          className="join-item btn btn-sm text-lg btn-success text-white"
                                          onClick={() =>
                                            Swal.fire({
                                              title: 'Ajukan',
                                              text: `Anda yakin mengajukan laporan tahap ${t} ini?, data tidak dapat ubah setelah di ajaukan`,
                                              icon: 'question',
                                              showCancelButton: true,
                                              confirmButtonColor: 'green',
                                              confirmButtonText: 'Ya, Ajukan',
                                              cancelButtonText: 'Batal',
                                              allowOutsideClick: false,
                                            }).then((e) => {
                                              if (e.isConfirmed) {
                                                handleAjukan(t);
                                              }
                                            })
                                          }
                                        >
                                          <RiArrowUpCircleFill />
                                        </button>
                                      </div>
                                    )}
                                    {!isAdmin &&
                                      isBuka[t - 1] === 1 &&
                                      (!data || data?.status <= 1) && (
                                        <div
                                          className="tooltip tooltip-left"
                                          data-tip="Upload"
                                        >
                                          <Link
                                            href={`${pathname}/tahap/${t}`}
                                            className="join-item btn btn-sm"
                                          >
                                            <RiUploadCloud2Fill />{' '}
                                            {!data && 'Upload'}
                                          </Link>
                                        </div>
                                      )}

                                    {data && (
                                      <div
                                        className="tooltip tooltip-left"
                                        data-tip="Detail"
                                      >
                                        <Link
                                          // href={`${pathname}/detail/${t}`}
                                          href={`${pathname}/detail/${t}?opd=${kode_opd}`}
                                          className="btn btn-sm"
                                        >
                                          Detail <MdArrowForwardIos />
                                        </Link>
                                      </div>
                                    )}
                                    {data &&
                                      !isAdmin &&
                                      isBuka[t - 1] === 1 &&
                                      (!data || data?.status <= 1) && (
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
                                                confirmButtonText:
                                                  'Ya, Hapus !',
                                                confirmButtonColor: 'red',
                                                cancelButtonText:
                                                  'Tidak, Batalkan !',
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
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Status({ stat }) {
  return (
    <>
      {stat === 3 && (
        <div className="badge badge-success text-white  h-fit">
          <RiCheckboxCircleFill /> Selesai
        </div>
      )}
      {stat === 2 && (
        <div className="badge badge-info text-white h-fit">
          <RiCheckboxCircleFill /> Menunggu Persetujuan
        </div>
      )}
      {stat === 1 && (
        <div className="badge badge-warning text-white h-fit">
          <RiCheckboxCircleFill /> Dapat diajukan
        </div>
      )}
      {stat === -1 && 'Belum Upload'}
      {stat === 0 && (
        <div className="badge badge-error text-white h-fit">
          <RiCloseCircleFill /> Perlu Perbaikan
        </div>
      )}
    </>
  );
}
