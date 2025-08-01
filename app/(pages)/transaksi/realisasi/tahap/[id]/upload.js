'use client';
import { SwalError, SwalLoading, SwalSuccess } from '@/app/components/alert';
import fetchData from '@/lib/fetch';
import readExcel from '@/lib/readExcelFile';
import { useParams, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { RiCheckboxCircleFill, RiFileExcel2Fill } from 'react-icons/ri';
import { IoMdCloudUpload } from 'react-icons/io';
import { ListPicker } from '@/app/components/listPicker';

export default function Tambah({ session }) {
  const [dataTable, setDataTable] = useState(null);
  const { id } = useParams();
  const btnUpload = useRef(null);
  const [activeBidang, setActiveBidang] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');
  const router = useRouter();

  async function submit() {
    SwalLoading('Menyimpan...');

    const submitData = dataTable.map((item) => ({
      ...item,
      tahap: parseFloat(id),
      tahun: parseFloat(session.tahun),
      kode_user: parseFloat(session.kode),
      kode_bidang: activeBidang?.kode,
    }));

    try {
      const response = await fetchData('/api/realisasi', 'POST', {
        a: 'tambahupload',
        data: submitData,
      });

      if (response.status) {
        SwalSuccess(() => router.back(), 'Data berhasil disimpan');
      }
    } catch (error) {
      SwalError(() => {}, error);
    }
  }

  async function handleFileSelected(input) {
    const data = await readExcel(input, session.kode_opd);
    if (data.length > 0) {
      setDataTable(data);
      setSelectedFile(btnUpload.current?.files[0]?.name);
    }
  }

  return (
    <>
      {!dataTable && (
        <div className="flex justify-center items-center w-full h-full flex-col gap-4">
          <label className="font-bold text-lg">
            Tambah Realisasi Tahap {id}
          </label>
          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-100 border p-4">
            <legend className="fieldset-legend">Pilih Bidang</legend>
            <label className="label">
              <ListPicker
                url={'/api/bidang'}
                labelIndex={1}
                placeholder="Cari bidang.."
                onItemSelected={(e) => setActiveBidang(e)}
              />
            </label>
          </fieldset>
          {activeBidang && (
            <>
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
            </>
          )}
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
                      <div className="font-black text-lg">{selectedFile}</div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        Nama File
                      </div>
                    </div>
                    <div className="divider divider-horizontal"></div>

                    <div>
                      <div className="font-black text-lg">
                        {activeBidang.bidang}
                      </div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        Tahap {id}
                      </div>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div>
                      <div className="font-black text-lg">
                        Rp.{' '}
                        {dataTable
                          .reduce((sum, item) => sum + item.rencana_anggaran, 0)
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
                  <button
                    className="btn btn-sm btn-success join-item"
                    onClick={() => submit()}
                  >
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
                    {item.rencana_anggaran.toLocaleString('id-ID')}
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
  );
}
