'use client';
import { SwalLoading } from '@/app/components/alert';
import { InputDate } from '@/app/components/date';
import { ListPicker } from '@/app/components/listPicker';
import fetchData from '@/lib/fetch';
import { getTanggal } from '@/lib/func';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FcPrint } from 'react-icons/fc';
import { MdReport, MdSearch } from 'react-icons/md';
import { RiFileExcel2Fill } from 'react-icons/ri';
import Swal from 'sweetalert2';

export default function ControlLaporan({ session }) {
  const [opd, setOpd] = useState(null);
  const [bidang, setBidang] = useState(null);
  const [pejabat, setPejabat] = useState(null);
  const [tanggal, setTanggal] = useState(getTanggal());
  const [dataTable, setDataTable] = useState(null);
  const [dataPenyaluran, setDataPenyaluran] = useState(null);
  const [showPenyaluran, setShowPenyaluran] = useState(true);

  const getData = useCallback(async () => {
    SwalLoading('Memuat Data...');
    const { data: penyalurandata } = await fetchData('/api/penyaluran');
    penyalurandata && setDataPenyaluran(penyalurandata);

    const { data } = await fetchData('/api/laporan/rincian', 'POST', {
      kode_opd: session.level <= 1 ? opd?.kode || opd.value : session.kode_opd,
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
          {session.level <= 1 && (
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
        <div className="w-full flex place-content-between items-center bg-white px-2 print:hidden">
          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-2">
            <label className="label">
              <input
                type="checkbox"
                checked={showPenyaluran}
                className="toggle"
                onChange={() => setShowPenyaluran(!showPenyaluran)}
              />
              Tampilkan Penyaluran
            </label>
          </fieldset>
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
      <div className="overflow-auto h-20 flex-1 print:overflow-visible">
        {dataTable && (
          <Table
            data={dataTable}
            activeOpd={session <= 1 ? opd.opd : session.opd}
            pejabat={pejabat}
            showPenyaluran={showPenyaluran}
            tahun={session.tahun}
            activeBidang={bidang.bidang}
            tanggal={tanggal}
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
  showPenyaluran = true,
  activeBidang,
  tanggal = null,
  tahun,
  dataPenyaluran = [],
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

  const opd = Object.entries(
    data.reduce((acc, item) => {
      const key = `${item.kode_opd}-${item.kode_program}`;
      if (!acc[key]) {
        acc[key] = {
          nama_opd: item.opd,
          kode_bidang: item.kode_bidang,
          kode_opd: item.kode_opd,
          kode_program: item.kode_program,
          penyaluran_1: item.penyaluran_1,
          penyaluran_2: item.penyaluran_2,
          penyaluran_3: item.penyaluran_3,
          ...Object.fromEntries(fields.map((f) => [f, 0])),
        };
      }
      fields.forEach((f) => {
        acc[key][f] += item[f];
      });
      return acc;
    }, {})
  ).map(([opd, values]) => ({ opd, ...values }));

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

  total.persen_realisasi = (total.jumlah_nilai / total.rencana_anggaran) * 100;
  total.persen_sisa = (total.sisa_nilai / total.rencana_anggaran) * 100;

  function RowOpd({
    opd = [],
    item_bidang = [],
    kegiatan = [],
    tableData = [],
  }) {
    return (
      <>
        {opd
          .filter((item) => item.kode_program === item_bidang.kode_program)
          .map((item_opd, key_opd) => {
            const jumlah_penyaluran =
              item_opd?.penyaluran_1 +
              item_opd?.penyaluran_2 +
              item_opd?.penyaluran_3;

            const persen_penyaluran =
              (jumlah_penyaluran / item_bidang?.rencana_anggaran) * 100;

            const persen_realisasi =
              ((item_opd?.realisasi_1 +
                item_opd?.realisasi_2 +
                item_opd?.realisasi_3) /
                item_opd?.rencana_anggaran) *
              100;

            const persen_sisa =
              (item_opd?.sisa_nilai / item_opd?.rencana_anggaran) * 100;
            return (
              <React.Fragment key={key_opd}>
                <tr className="font-bold">
                  <td colSpan={4} className="text-left">
                    {item_opd?.nama_opd}
                  </td>
                  <td className="text-right">
                    {item_opd?.rencana_anggaran?.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  {showPenyaluran && (
                    <>
                      <td className="text-right">
                        {/* {item_opd?.penyaluran_1?.toLocaleString('id-ID') || '-'} */}
                      </td>
                      <td className="text-right">
                        {/* {item_opd?.penyaluran_2?.toLocaleString('id-ID') || '-'} */}
                      </td>
                      <td className="text-right">
                        {/* {item_opd?.penyaluran_3?.toLocaleString('id-ID') || '-'} */}
                      </td>
                      <td className="text-right">
                        {/* {jumlah_penyaluran?.toLocaleString('id-ID') || '-'} */}
                      </td>
                      <td className="text-right">
                        {/* {persen_penyaluran?.toLocaleString('id-ID', {
                          maximumFractionDigits: 2,
                        }) || '-'} */}
                      </td>
                    </>
                  )}
                  <td className="text-right">
                    {item_opd?.realisasi_1?.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {item_opd?.realisasi_2?.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {item_opd?.realisasi_3?.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {item_opd?.jumlah_nilai?.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {persen_realisasi?.toLocaleString('id-ID', {
                      maximumFractionDigits: 2,
                    }) || '-'}
                  </td>
                  <td className="text-right">
                    {item_opd?.sisa_nilai?.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {persen_sisa?.toLocaleString('id-ID') || '-'}
                  </td>
                </tr>
                <RowKegiatan
                  kegiatan={kegiatan}
                  item_opd={item_opd}
                  tableData={tableData}
                />
              </React.Fragment>
            );
          })}
      </>
    );
  }
  function RowKegiatan({ kegiatan = [], item_opd = [], tableData = [] }) {
    return (
      <>
        {kegiatan
          .filter(
            (item) =>
              item.kode_opd === item_opd.kode_opd &&
              item.kode_bidang === item_opd.kode_bidang
          )
          .map((item_kegiatan, key_kegiatan) => {
            const persen_realisasi =
              ((item_kegiatan?.realisasi_1 +
                item_kegiatan?.realisasi_2 +
                item_kegiatan?.realisasi_3) /
                item_kegiatan?.rencana_anggaran) *
              100;
            const persen_sisa =
              (item_kegiatan?.sisa_nilai / item_kegiatan?.rencana_anggaran) *
              100;

            return (
              <React.Fragment key={key_kegiatan}>
                <tr className="font-bold">
                  <td>{item_kegiatan.kode_kegiatan}</td>
                  <td colSpan={3} className="text-left">
                    {item_kegiatan.kegiatan}
                  </td>
                  <td className="text-right">
                    {item_kegiatan.rencana_anggaran.toLocaleString('id-ID') ||
                      '-'}
                  </td>
                  <td></td>
                  {showPenyaluran && (
                    <>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </>
                  )}
                  <td className="text-right">
                    {item_kegiatan.realisasi_1.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {item_kegiatan.realisasi_2.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {item_kegiatan.realisasi_3.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {item_kegiatan.jumlah_nilai.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {persen_realisasi?.toLocaleString('id-ID', {
                      maximumFractionDigits: 2,
                    }) || '-'}
                  </td>
                  <td className="text-right">
                    {item_kegiatan.sisa_nilai.toLocaleString('id-ID') || '-'}
                  </td>
                  <td></td>
                  <td className="text-right">
                    {persen_sisa?.toLocaleString('id-ID') || '-'}
                  </td>
                </tr>
                <RowSubKegiatan
                  tableData={tableData}
                  item_kegiatan={item_kegiatan}
                />
              </React.Fragment>
            );
          })}
      </>
    );
  }

  function RowSubKegiatan({ tableData = [], item_kegiatan = [] }) {
    return (
      <>
        {tableData
          .filter(
            (item) =>
              item?.kode_bidang === item_kegiatan?.kode_bidang &&
              item?.kode_opd === item_kegiatan?.kode_opd &&
              item?.kode_kegiatan === item_kegiatan?.kode_kegiatan
          )
          .map((item, key) => {
            return (
              <tr key={key}>
                <td>{item?.kode_subkegiatan || 'N/A'}</td>
                <td>{item?.subkegiatan || 'N/A'}</td>
                <td>{item?.uraian_output || 'N/A'}</td>
                <td>{item?.satuan || 'N/A'}</td>
                <td className="text-right">
                  {item?.rencana_anggaran?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.rencana_output?.toLocaleString('id-ID') || '-'}
                </td>
                {showPenyaluran && (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
                <td className="text-right">
                  {item?.realisasi_1?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.output_1?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.realisasi_2?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.output_2?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.realisasi_3?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.output_3?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.jumlah_nilai?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.jumlah_output?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.jumlah_persentase?.toLocaleString('id-ID', {
                    maximumFractionDigits: 2,
                  }) || '-'}
                </td>
                <td className="text-right">
                  {item?.sisa_nilai?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.sisa_output?.toLocaleString('id-ID') || '-'}
                </td>
                <td className="text-right">
                  {item?.sisa_persentase?.toLocaleString('id-ID', {
                    maximumFractionDigits: 2,
                  }) || '-'}
                </td>
              </tr>
            );
          })}
      </>
    );
  }

  function RowTotal({ total = [] }) {
    const jumlah_penyaluran =
      total?.penyaluran_1 + total?.penyaluran_2 + total?.penyaluran_3;

    const persen_penyaluran =
      (jumlah_penyaluran / total?.rencana_anggaran) * 100 || 0;
    return (
      <>
        <tr className="font-bold bg-gray-100">
          <td colSpan={4} className="text-left">
            TOTAL KESELURUHAN
          </td>
          <td className="text-right">
            {total.rencana_anggaran?.toLocaleString('id-ID')}
          </td>
          <td></td>
          {showPenyaluran && (
            <>
              <td className="text-right">
                {total.penyaluran_1?.toLocaleString('id-ID')}
              </td>
              <td className="text-right">
                {total.penyaluran_2?.toLocaleString('id-ID')}
              </td>
              <td className="text-right">
                {total.penyaluran_3?.toLocaleString('id-ID')}
              </td>
              <td className="text-right">
                {jumlah_penyaluran?.toLocaleString('id-ID') || '-'}
              </td>
              <td className="text-right">
                {persen_penyaluran?.toLocaleString('id-ID', {
                  maximumFractionDigits: 2,
                }) || '-'}
              </td>
            </>
          )}
          <td className="text-right">
            {total.realisasi_1?.toLocaleString('id-ID')}
          </td>
          <td></td>
          <td className="text-right">
            {total.realisasi_2?.toLocaleString('id-ID')}
          </td>
          <td></td>
          <td className="text-right">
            {total.realisasi_3?.toLocaleString('id-ID')}
          </td>
          <td></td>
          <td className="text-right">
            {total.jumlah_nilai?.toLocaleString('id-ID')}
          </td>
          <td></td>
          <td className="text-right">
            {(total?.persen_realisasi || 0)?.toLocaleString('id-ID', {
              maximumFractionDigits: 2,
            })}
          </td>
          <td className="text-right">
            {total.sisa_nilai?.toLocaleString('id-ID')}
          </td>
          <td></td>
          <td className="text-right">
            {(total?.persen_sisa || 0)?.toLocaleString('id-ID', {
              maximumFractionDigits: 2,
            })}
          </td>
        </tr>
      </>
    );
  }

  return (
    data && (
      <div className="bg-white p-4 m-4 rounded-2xl w-fit shadow-xl print:m-0 print:p-0 print:shadow-none">
        <div className="font-bold text-center mb-4">
          <div>TABEL LAPORAN DAU SG {activeBidang}</div>
          {activeOpd ? <div>{activeOpd}</div> : <div>KABUPATEN SIMEULUE</div>}
          <div>TAHUN ANGARAN {tahun}</div>
        </div>
        <table className="tabel-laporan ">
          <thead className="text-xs ">
            <tr>
              <th rowSpan={3}>KODE</th>
              <th rowSpan={3}>URAIAN KEGIATAN / SUB KEGIATAN</th>
              <th rowSpan={3}>URAIAN KELUARAN</th>
              <th rowSpan={3}>SATUAN</th>
              <th colSpan={2}>RENCANA PENGGUNAAN</th>
              {showPenyaluran && <th colSpan={5}>PENYALURAN</th>}
              <th colSpan={9}>REALISASI</th>
              <th colSpan={3}>SISA</th>
            </tr>
            <tr>
              <th rowSpan={2}>ANGGARAN</th>
              <th rowSpan={2}>OUTPUT</th>
              {showPenyaluran && (
                <>
                  <th rowSpan={2}>TAHAP I</th>
                  <th rowSpan={2}>TAHAP II</th>
                  <th rowSpan={2}>TAHAP III</th>
                  <th colSpan={2}>JUMLAH</th>
                </>
              )}
              <th colSpan={2}>TAHAP I</th>
              <th colSpan={2}>TAHAP II</th>
              <th colSpan={2}>TAHAP III</th>
              <th colSpan={3}>JUMLAH</th>
              <th rowSpan={2}>NILAI</th>
              <th rowSpan={2}>OUTPUT</th>
              <th rowSpan={2}>PERSENTASE</th>
            </tr>
            <tr>
              {showPenyaluran && (
                <>
                  <th>NILAI</th>
                  <th>PERSENTASE</th>
                </>
              )}
              <th>NILAI</th>
              <th>OUTPUT</th>
              <th>NILAI</th>
              <th>OUTPUT</th>
              <th>NILAI</th>
              <th>OUTPUT</th>
              <th>NILAI</th>
              <th>OUTPUT</th>
              <th>PERSENTASE</th>
            </tr>
            {/* <tr className="text-[7pt] italic ">
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>10 (7+8+9)</th>
              <th>11 (10/5)</th>
              <th>12</th>
              <th>13</th>
              <th>14</th>
              <th>15</th>
              <th>16</th>
              <th>17</th>
              <th>18 (12+14+16)</th>
              <th>19 (13+15+17)</th>
              <th>20 (18/5)</th>
              <th>21 (5-18)</th>
              <th>22 (6-19)</th>
              <th>23 (21/5)</th>
            </tr> */}
          </thead>
          <tbody className="text-xs">
            {bidang.map((item_bidang, key_bidang) => {
              const jumlah_penyaluran =
                parseFloat(item_bidang?.penyaluran_1 || 0) +
                parseFloat(item_bidang?.penyaluran_2 || 0) +
                parseFloat(item_bidang?.penyaluran_3 || 0);

              const persen_penyaluran =
                (jumlah_penyaluran / item_bidang?.rencana_anggaran) * 100;

              const persen_realisasi =
                ((item_bidang?.realisasi_1 +
                  item_bidang?.realisasi_2 +
                  item_bidang?.realisasi_3) /
                  item_bidang?.rencana_anggaran) *
                100;

              const persen_sisa =
                (item_bidang?.sisa_nilai / item_bidang?.rencana_anggaran) * 100;
              return (
                <React.Fragment key={key_bidang}>
                  <tr className="font-bold">
                    <td colSpan={4} className="text-left">
                      {item_bidang?.bidang}
                    </td>
                    <td className="text-right">
                      {item_bidang?.rencana_anggaran?.toLocaleString('id-ID') ||
                        '-'}
                    </td>
                    <td></td>
                    {showPenyaluran && (
                      <>
                        <td className="text-right">
                          {item_bidang?.penyaluran_1?.toLocaleString('id-ID') ||
                            '-'}
                        </td>
                        <td className="text-right">
                          {item_bidang?.penyaluran_2?.toLocaleString('id-ID') ||
                            '-'}
                        </td>
                        <td className="text-right">
                          {item_bidang?.penyaluran_3?.toLocaleString('id-ID') ||
                            '-'}
                        </td>
                        <td className="text-right">
                          {parseFloat(jumlah_penyaluran || 0).toLocaleString(
                            'id-ID'
                          ) || '-'}
                        </td>
                        <td className="text-right">
                          {persen_penyaluran?.toLocaleString('id-ID', {
                            maximumFractionDigits: 2,
                          }) || '-'}
                        </td>
                      </>
                    )}
                    <td className="text-right">
                      {item_bidang?.realisasi_1?.toLocaleString('id-ID') || '-'}
                    </td>
                    <td></td>
                    <td className="text-right">
                      {item_bidang?.realisasi_2?.toLocaleString('id-ID') || '-'}
                    </td>
                    <td></td>
                    <td className="text-right">
                      {item_bidang?.realisasi_3?.toLocaleString('id-ID') || '-'}
                    </td>
                    <td></td>
                    <td className="text-right">
                      {item_bidang?.jumlah_nilai?.toLocaleString('id-ID') ||
                        '-'}
                    </td>
                    <td></td>
                    <td className="text-right">
                      {persen_realisasi?.toLocaleString('id-ID', {
                        maximumFractionDigits: 2,
                      }) || '-'}
                    </td>
                    <td className="text-right">
                      {item_bidang?.sisa_nilai?.toLocaleString('id-ID') || '-'}
                    </td>
                    <td></td>
                    <td className="text-right">
                      {persen_sisa?.toLocaleString('id-ID') || '-'}
                    </td>
                  </tr>
                  <RowOpd
                    opd={opd}
                    item_bidang={item_bidang}
                    kegiatan={kegiatan}
                    tableData={data}
                  />
                </React.Fragment>
              );
            })}
            <RowTotal total={total} />
          </tbody>
        </table>
        <div className="w-full flex place-content-end p-4 pr-20 text-sm">
          <div className="max-w-100 text-center mt-4  ">
            KAB. SIMEULUE, {tanggal} <br />
            {/* KAB. SIMEULUE, {tanggal} <br /> */}
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
