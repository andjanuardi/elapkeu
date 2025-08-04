'use client';
import { SwalLoading } from '@/app/components/alert';
import { InputDate } from '@/app/components/date';
import { ListPicker } from '@/app/components/listPicker';
import fetchData from '@/lib/fetch';
import { getTanggal } from '@/lib/func';
import { tahap } from '@/models/staticData';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FcPrint } from 'react-icons/fc';
import { MdReport, MdSearch } from 'react-icons/md';
import { RiFileExcel2Fill } from 'react-icons/ri';
import Swal from 'sweetalert2';

export default function ControlLaporan({ session }) {
  const [opd, setOpd] = useState(null);
  const [tahap, setTahap] = useState(1);
  const [bidang, setBidang] = useState(null);
  const [pejabat, setPejabat] = useState(null);
  const [tanggal, setTanggal] = useState(getTanggal());
  const [dataTable, setDataTable] = useState(null);
  const [showPenyaluran, setShowPenyaluran] = useState(true);
  const [dataPenyaluran, setDataPenyaluran] = useState(null);

  const getData = useCallback(async () => {
    SwalLoading('Memuat Data...');

    const { data: penyalurandata } = await fetchData('/api/penyaluran');
    penyalurandata && setDataPenyaluran(penyalurandata);

    const { data } = await fetchData('/api/laporan/rincian', 'POST', {
      kode_opd:
        session.level <= 1 || session.level >= 4
          ? opd?.kode || opd.value
          : session.kode_opd,
      kode_bidang: bidang?.kode || bidang.value,
    });
    data && setDataTable(data);
    Swal.close();
  }, [opd, bidang, session]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getData();
  };
  return (
    <div className="flex flex-col  h-full  ">
      {!dataTable && (
        <form onSubmit={handleSubmit} className="p-4 print:hidden">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Tahap</legend>

            <select
              className="select w-full validator"
              required
              onChange={(e) => setTahap(e.currentTarget.value)}
              value={tahap}
            >
              <option value={1}>Tahap I</option>
              <option value={2}>Tahap II</option>
              <option value={3}>Tahap III</option>
            </select>
            <p className="label italic">Pilih Tahap</p>
            <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Pilih Bidang</legend>
            <ListPicker
              semua={true}
              url={'/api/bidang'}
              className="input w-full validator"
              labelIndex={1}
              placeholder="Cari Bidang..."
              required
              defaultValue=""
              onItemSelected={(e) => setBidang(e)}
            />
            <p className="label italic">Masukkan Nama Bidang</p>
            <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
          </fieldset>
          {(session.level <= 1 || session.level >= 4) && (
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Pilih OPD</legend>
              <ListPicker
                semua={true}
                url={'/api/opd'}
                className="input w-full validator"
                labelIndex={1}
                placeholder="Cari OPD..."
                required
                defaultValue=""
                onItemSelected={(e) => setOpd(e)}
              />
              <p className="label italic">Masukkan nama OPD</p>
              <div className="validator-hint mt-0 hidden">
                Tidak boleh kosong
              </div>
            </fieldset>
          )}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Pilih Penandatangan</legend>
            <ListPicker
              url={'/api/pejabat'}
              labelIndex={2}
              placeholder="Cari Pejabat..."
              className="input w-full validator"
              required
              defaultValue=""
              onItemSelected={(e) => setPejabat(e)}
            />
            <p className="label italic">Masukkan nama Pejabat</p>
            <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Pilih Tanggal</legend>

            <InputDate required={true} onChange={(e) => setTanggal(e)} />
            <p className="label italic">Masukkan tanggal cetak</p>
            <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
          </fieldset>
          <div className="join mt-4 w-full place-content-end ">
            <button type="submit" className="btn btn-primary join-item ">
              <MdSearch /> Lihat Laporan
            </button>
          </div>
        </form>
      )}
      {dataTable && (
        <div className="w-full flex place-content-end items-center bg-white px-2 print:hidden">
          <div className="join  p-4">
            <button
              type="button"
              className="btn  join-item"
              onClick={() => setDataTable(null)}
            >
              Kembali
            </button>
            <button
              type="button"
              className="btn join-item"
              onClick={() => window.print()}
            >
              <FcPrint /> Cetak
            </button>
            {/* <button type="button" className="btn join-item">
              <RiFileExcel2Fill className="text-success" /> Download
            </button> */}
          </div>
        </div>
      )}
      <div className="overflow-auto h-20 flex-1 print:overflow-visible ">
        {dataTable && (
          <Table
            data={dataTable}
            activeOpd={session.level <= 1 ? opd.opd : session.opd}
            pejabat={pejabat}
            showPenyaluran={showPenyaluran}
            tahun={session.tahun}
            activeBidang={bidang.bidang}
            tanggal={tanggal}
            activeTahap={tahap}
            dataPenyaluran={dataPenyaluran}
          />
        )}
      </div>
    </div>
  );
}

export function Table({
  isPrint = false,
  data = [],
  activeOpd,
  pejabat,
  activeBidang,
  activeTahap,
  tanggal,
  tahun,
  dataPenyaluran,
}) {
  const fields = [
    'rencana_anggaran',
    'realisasi_1',
    'realisasi_2',
    'realisasi_3',
    'jumlah_nilai',
    'sisa_nilai',
  ];

  const bidang = Object.entries(
    data.reduce((acc, item) => {
      const key = item.bidang;
      if (!acc[key]) {
        acc[key] = {
          kode_bidang: item.kode_bidang,
          kode_program: item.kode_program,
          penyaluran_1: dataPenyaluran
            .filter(
              (item) =>
                item.kode_bidang === item.kode_bidang && item.tahap === 1
            )
            .map((item) => parseFloat(item.nilai)),
          penyaluran_2: dataPenyaluran
            .filter(
              (item) =>
                item.kode_bidang === item.kode_bidang && item.tahap === 2
            )
            .map((item) => parseFloat(item.nilai)),
          penyaluran_3: dataPenyaluran
            .filter(
              (item) =>
                item.kode_bidang === item.kode_bidang && item.tahap === 3
            )
            .map((item) => parseFloat(item.nilai)),
          ...Object.fromEntries(fields.map((f) => [f, 0])),
        };
      }
      fields.forEach((f) => {
        acc[key][f] += item[f];
      });
      return acc;
    }, {})
  ).map(([bidang, values]) => ({ bidang, ...values }));

  const kegiatan = Object.entries(
    data.reduce((acc, item) => {
      const key = item.kegiatan;
      if (!acc[key]) {
        acc[key] = {
          kode_bidang: item.kode_bidang,
          kode_opd: item.kode_opd,
          kode_kegiatan: item.kode_kegiatan,
          penerimaan: item.penerimaan,
          ...Object.fromEntries(fields.map((f) => [f, 0])),
        };
      }
      fields.forEach((f) => {
        acc[key][f] += item[f];
      });
      return acc;
    }, {})
  ).map(([kegiatan, values]) => ({ kegiatan, ...values }));

  const total = {
    rencana_anggaran: 0,
    penyaluran_1: 0,
    penyaluran_2: 0,
    penyaluran_3: 0,
    realisasi_1: 0,
    realisasi_2: 0,
    realisasi_3: 0,
    jumlah_nilai: 0,
    sisa_nilai: 0,
  };

  bidang.forEach((item) => {
    total.rencana_anggaran += item.rencana_anggaran || 0;
    total.penyaluran_1 += parseFloat(item.penyaluran_1) || 0;
    total.penyaluran_2 += parseFloat(item.penyaluran_2) || 0;
    total.penyaluran_3 += parseFloat(item.penyaluran_3) || 0;
    total.realisasi_1 += item.realisasi_1 || 0;
    total.realisasi_2 += item.realisasi_2 || 0;
    total.realisasi_3 += item.realisasi_3 || 0;
    total.jumlah_nilai += item.jumlah_nilai || 0;
    total.sisa_nilai += item.sisa_nilai || 0;
  });

  const labelTahap = ['Tahap I', 'Tahap II', 'Tahap III'];

  const jumlahTahapIni = [
    total.realisasi_1 || 0,
    total.realisasi_2 || 0,
    total.realisasi_3 || 0,
  ];

  const jumlahPenyaluran = [
    total.penyaluran_1 || 0,
    total.penyaluran_1 + total.penyaluran_2 || 0,
    total.penyaluran_1 + total.penyaluran_2 + total.penyaluran_3 || 0,
  ];

  const jumlahKomulatif = [
    total.realisasi_1 || 0,
    total.realisasi_1 + total.realisasi_2 || 0,
    total.realisasi_1 + total.realisasi_2 + total.realisasi_3 || 0,
  ];

  const sisa =
    jumlahPenyaluran[activeTahap - 1] - jumlahKomulatif[activeTahap - 1] || 0;
  const persen =
    (jumlahKomulatif[activeTahap - 1] / jumlahPenyaluran[activeTahap - 1]) *
      100 || 0;

  let nomor = 0;
  let total_rencana = 0;
  let total_realisasi_1 = 0;
  let total_realisasi_2 = 0;
  let total_realisasi_3 = 0;
  let total_sisa = 0;

  return (
    data && (
      <div className="bg-white p-4 m-4 rounded-2xl w-fit shadow-xl print:m-0 print:p-0 print:shadow-none text-sm">
        <div className=" mb-4 ">
          <div className="font-bold mb-4 text-center w-full flex flex-col">
            <span>
              LAPORAN REALISASI DAU YANG DITENTUKAN PENGGUNAANNYA UNTUK DAU
            </span>
            <span>{activeBidang}</span>
            <span>{activeOpd || 'KABUPATEN SIMEULUE'}</span>
            <span>TAHUN {tahun}</span>
          </div>
          <div className="mb-4 w-full">
            Yang bertanda tangan di bawah ini:
            <table className="ml-4">
              <tbody>
                <tr>
                  <td className="w-20">Nama</td>
                  <td>: {pejabat.nama}</td>
                </tr>
                <tr>
                  <td>Jabatan</td>
                  <td>: {pejabat.jabatan}</td>
                </tr>
              </tbody>
            </table>
            menyatakan bahwa saya bertanggung jawab penuh atas kebenaran Laporan
            Realisasi Penyerapan DAU {activeBidang}{' '}
            {labelTahap[activeTahap - 1]} Tahun Anggaran {tahun} sebagai berikut
            :
          </div>
          <div className="mb-4 w-full">
            Penerimaan dari Rekening Kas Umum Negara:
            <table className="ml-4">
              <tbody>
                <tr>
                  <td className="w-20">Tahap I</td>
                  <td className="w-10">: Rp.</td>
                  <td className="text-right">
                    {activeTahap >= 1
                      ? (total.penyaluran_1 || 0)?.toLocaleString('id-ID')
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td>Tahap II</td>
                  <td>: Rp.</td>
                  <td className="text-right">
                    {activeTahap >= 2
                      ? (total.penyaluran_2 || 0)?.toLocaleString('id-ID')
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td>Tahap III</td>
                  <td>: Rp.</td>
                  <td className="text-right">
                    {activeTahap >= 3
                      ? (total.penyaluran_3 || 0)?.toLocaleString('id-ID')
                      : 0}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <div className="divider m-0"></div>
                  </td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>: Rp. </td>
                  <td className="text-right">
                    {jumlahPenyaluran[activeTahap - 1]?.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-4 w-full">
            Realisasi Penggunaan DAU {activeBidang} melalui SP2D Daerah:
            <table className="ml-4 ">
              <tbody>
                <tr>
                  <td className="w-50">Tahap ini</td>
                  <td className="w-10">: Rp.</td>
                  <td className="text-right">
                    {jumlahTahapIni[activeTahap - 1]?.toLocaleString('id-ID')}
                  </td>
                </tr>

                <tr>
                  <td>Kumulatif s.d. Tahap ini</td>
                  <td>: Rp.</td>
                  <td className="text-right">
                    {jumlahKomulatif[activeTahap - 1]?.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-full">
                  Sisa Dana Alokasi Umum di Rekening Kas Umum Daerah sejumlah
                </td>
                <td className="whitespace-nowrap min-w-20">: Rp.</td>
                <td className="text-right ">{sisa?.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td>Persentase Penyerapan Dana Alokasi Umum</td>
                <td className="w-10">:</td>
                <td className=" text-right">
                  {persen?.toLocaleString('id-ID', {
                    maximumFractionDigits: 2,
                  })}{' '}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <table className="tabel-laporan ">
          <thead className="text-xs ">
            <tr>
              <th rowSpan={2}>NO.</th>
              <th rowSpan={2}>URAIAN KEGIATAN / SUB KEGIATAN</th>
              <th rowSpan={2}>ANGGARAN</th>
              <th colSpan={3}>REALISASI PENYERAPAN</th>
              <th rowSpan={2}>SISA PAGU</th>
              <th colSpan={3}>KELUARAN</th>
            </tr>
            <tr>
              <th>TAHAP I</th>
              <th>TAHAP II</th>
              <th>TAHAP III</th>
              <th>URAIAN</th>
              <th>JUMLAH</th>
              <th>SATUAN</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {kegiatan.map((item_kegiatan, key_kegiatan) => {
              nomor += 1;

              const realisasi_1 =
                activeTahap >= 1 ? item_kegiatan?.realisasi_1 : 0;
              const realisasi_2 =
                activeTahap >= 2 ? item_kegiatan?.realisasi_2 : 0;
              const realisasi_3 =
                activeTahap >= 3 ? item_kegiatan?.realisasi_3 : 0;
              const sisa =
                item_kegiatan?.rencana_anggaran -
                realisasi_1 +
                realisasi_3 +
                realisasi_3;

              total_rencana += item_kegiatan?.rencana_anggaran || 0;
              total_realisasi_1 += realisasi_1 || 0;
              total_realisasi_2 += realisasi_2 || 0;
              total_realisasi_3 += realisasi_3 || 0;
              total_sisa += sisa || 0;
              return (
                <React.Fragment key={key_kegiatan}>
                  <tr className="font-bold">
                    <td>{nomor}</td>
                    <td>{item_kegiatan?.kegiatan}</td>
                    <td className="text-right">
                      {(item_kegiatan?.rencana_anggaran || 0).toLocaleString(
                        'id-ID'
                      )}
                    </td>
                    <td className="text-right">
                      {realisasi_1.toLocaleString('id-ID')}
                    </td>
                    <td className="text-right">
                      {realisasi_2.toLocaleString('id-ID')}
                    </td>
                    <td className="text-right">
                      {realisasi_3.toLocaleString('id-ID')}
                    </td>
                    <td className="text-right">
                      {(sisa || 0).toLocaleString('id-ID')}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  {data
                    .filter(
                      (item) =>
                        item.kode_kegiatan === item_kegiatan.kode_kegiatan
                    )
                    .map((item, key) => {
                      nomor += 1;
                      const realisasi_1 =
                        activeTahap >= 1 ? item?.realisasi_1 : 0;
                      const realisasi_2 =
                        activeTahap >= 2 ? item?.realisasi_2 : 0;
                      const realisasi_3 =
                        activeTahap >= 3 ? item?.realisasi_3 : 0;
                      const sisa =
                        item?.rencana_anggaran -
                        realisasi_1 +
                        realisasi_3 +
                        realisasi_3;

                      const jumlah_output = [
                        item?.output_1,
                        item?.output_1 + item?.output_2,
                        item?.output_1 + item?.output_2 + item?.output_3,
                      ];
                      return (
                        <tr key={key}>
                          <td>{nomor}</td>
                          <td>{item.subkegiatan}</td>
                          <td className="text-right">
                            {(item?.rencana_anggaran || 0).toLocaleString(
                              'id-ID'
                            )}
                          </td>
                          <td className="text-right">
                            {realisasi_1.toLocaleString('id-ID')}
                          </td>
                          <td className="text-right">
                            {realisasi_2.toLocaleString('id-ID')}
                          </td>
                          <td className="text-right">
                            {realisasi_3.toLocaleString('id-ID')}
                          </td>
                          <td className="text-right">
                            {(sisa || 0).toLocaleString('id-ID')}
                          </td>
                          <td>{item.uraian_output}</td>
                          <td className="text-right">
                            {(
                              jumlah_output[activeTahap - 1] || 0
                            ).toLocaleString('id-ID')}
                          </td>
                          <td>{item.satuan}</td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
            <tr key="total" className="font-bold bg-gray-100">
              <td colSpan={2} className="text-center">
                TOTAL
              </td>
              <td className="text-right">
                {total_rencana.toLocaleString('id-ID')}
              </td>
              <td className="text-right">
                {total_realisasi_1.toLocaleString('id-ID')}
              </td>
              <td className="text-right">
                {total_realisasi_2.toLocaleString('id-ID')}
              </td>
              <td className="text-right">
                {total_realisasi_3.toLocaleString('id-ID')}
              </td>
              <td className="text-right">
                {total_sisa.toLocaleString('id-ID')}
              </td>
              <td></td>
              <td></td>

              <td></td>
            </tr>
          </tbody>
        </table>
        <p className="my-4">
          Bukti-bukti realisasi penggunaan Dana Alokasi Umum yang tercantum
          dalam laporan ini disimpan sesuai dengan ketentuan yang berlaku untuk
          kelengkapan dan keperluan pemeriksaan aparat pengawas fungsional.
          Kemudian, laporan ini sudah melalui pengawasan dari Aparat Pengawas
          Internal Pemerintah Daerah.
        </p>
        <p>Demikian laporan ini dibuat dengan sebenarnya.</p>
        <div className="w-full flex place-content-end p-4 pr-20">
          <div className="max-w-100 text-center mt-4  ">
            KAB. SIMEULUE, {tanggal} <br />
            {pejabat?.jabatan} <br />
            <div className="py-10"></div>
            <strong>{pejabat?.nama}</strong>
            <br />
            NIP. {pejabat?.nip}
          </div>
        </div>
      </div>
    )
  );
}
