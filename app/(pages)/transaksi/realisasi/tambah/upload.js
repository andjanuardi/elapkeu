'use client';
import { SwalError, SwalLoading, SwalSuccess } from '@/app/components/alert';
import fetchData from '@/lib/fetch';
import readExcel from '@/lib/readExcelFile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { FcDatabase } from 'react-icons/fc';
import {
  RiCheckboxCircleFill,
  RiFileChartFill,
  RiFileExcel2Fill,
  RiZoomInFill,
} from 'react-icons/ri';
import {
  IoMdCloseCircle,
  IoMdCloudUpload,
  IoMdSave,
  IoMdTabletPortrait,
} from 'react-icons/io';

export default function Tambah({ session }) {
  const [dataTable, setDataTable] = useState();
  const router = useRouter();

  const btnUpload = useRef(null);

  async function submit(e) {
    SwalLoading('Menyimpan...');
    e.preventDefault();

    const formData = new FormData(e.target);
    const kode = formData.get('kode');
    const nama = formData.get('nama');

    try {
      const response = await fetchData('/api/opd', 'POST', {
        a: 'tambah',
        data: [kode, nama],
      });

      if (response.status) {
        SwalSuccess(() => router.back(), 'Data berhasil disimpan');
      }
    } catch (error) {
      SwalError(() => {}, error);
    }
  }

  async function handleFileSelected(input) {
    const data = await readExcel(input);

    if (data.length > 0) {
      setDataTable(data);
    }
  }

  return (
    <>
      {!dataTable && (
        <div className="flex justify-center items-center w-full h-full flex-col gap-4">
          <label className="font-bold text-lg">Tambah Realisasi</label>

          <button
            type="button"
            className="btn btn-primary btn-lg flex items-center gap-2"
            onClick={() => btnUpload.current?.click()}
          >
            <IoMdCloudUpload />
            Upload File
          </button>

          <label className="italic">Upload Excel LRA dari SIPD</label>

          <input
            type="file"
            className="hidden"
            ref={btnUpload}
            accept=".xlsx, .xls"
            onChange={(item) => handleFileSelected(item)}
          />
        </div>
      )}
      {dataTable && (
        <div className="">
          <div className="card w-full bg-base-100 card-md shadow-sm">
            <div className="card-body">
              <ul className="list bg-base-200 rounded-box ">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                  <div className="flex gap-4">
                    <RiCheckboxCircleFill className="text-lg" /> Validasi Data
                    Excel
                  </div>
                </li>

                <li className="list-row">
                  <div>
                    <RiFileExcel2Fill className="text-3xl" />
                  </div>
                  <div className="flex justify-around">
                    <div>
                      <div className="font-black text-lg">
                        {btnUpload.current?.files[0]?.name}
                      </div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        Nama File
                      </div>
                    </div>

                    <div className="divider divider-horizontal"></div>
                    <div>
                      <div className="font-black text-lg">
                        Rp.{' '}
                        {dataTable
                          .reduce((sum, item) => sum + item.anggaran, 0)
                          .toLocaleString('id-ID')}
                        {',-'}
                      </div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        Anggaran
                      </div>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div>
                      <div className="font-black text-lg">
                        Rp.{' '}
                        {dataTable
                          .reduce((sum, item) => sum + item.realisasi, 0)
                          .toLocaleString('id-ID')}
                        {',-'}
                      </div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        Realisasi
                      </div>
                    </div>
                    <div className="divider divider-horizontal"></div>

                    <div>
                      <div className="font-black text-lg">
                        {dataTable.length}
                      </div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        Total Data
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              <div className="justify-end card-actions flex items-center gap-4 ">
                <span className="italic ">
                  Pastikan data sudah benar silahkan cek Tabel untuk lebih
                  detail, Lanjutkan simpan ?
                </span>
                <div className="join">
                  <button className="btn btn-sm btn-success join-item">
                    <RiCheckboxCircleFill />
                    Simpan
                  </button>
                  <button
                    className="btn btn-sm btn-error join-item"
                    onClick={() => setDataTable(null)}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <table className="table w-full">
            <thead>
              <tr className="text-xs">
                <th>No.</th>
                <th>Kode OPD</th>
                <th>Kode Sub Kegiatan</th>
                <th>Nama</th>
                <th>Anggaran</th>
                <th>Realisasi</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.map((item, key) => (
                <tr key={key}>
                  <td className="text-center">{key + 1}</td>
                  <td className="text-center">{item.kode_opd}</td>
                  <td className="text-center">{item.kode_subkegiatan}</td>
                  <td>{item.subkegiatan}</td>
                  <td className="text-right">
                    {item.anggaran.toLocaleString('id-ID')}
                  </td>
                  <td className="text-right">
                    {item.realisasi.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>

    // <form className="flex flex-col gap-4" onSubmit={(e) => submit(e)}>
    //   <h1 className="font-bold">Tambah OPD</h1>
    //   <fieldset className="fieldset">
    //     <legend className="fieldset-legend">Kode OPD</legend>
    //     <input
    //       name="kode"
    //       type="text"
    //       className="input validator w-full"
    //       placeholder="Masukkan kode OPD"
    //       required
    //     />
    //     <p className="label italic">
    //       Kode harus sama dengan Kode OPD pada Aplikasi SIPD
    //     </p>
    //     <div className="validator-hint m-0 hidden">Tidak boleh kosong</div>
    //   </fieldset>
    //   <fieldset className="fieldset">
    //     <legend className="fieldset-legend">Nama OPD</legend>
    //     <input
    //       name="nama"
    //       type="text"
    //       className="input validator w-full"
    //       placeholder="Masukkan Nama OPD"
    //       required
    //     />
    //     <p className="label italic">
    //       Nama harus sama dengan Nama OPD pada Aplikasi SIPD
    //     </p>
    //     <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
    //   </fieldset>

    //   <div className="join justify-end">
    //     <button type="submit" className="btn join-item btn-primary">
    //       <IoMdSave /> Simpan
    //     </button>
    //     <Link href=".." type="button" className="btn join-item btn-error">
    //       Kembali
    //     </Link>
    //   </div>
    // </form>
  );
}
