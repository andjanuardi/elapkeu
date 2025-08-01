import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import fetchData from '@/lib/fetch';
import { SwalLoading, SwalSuccess } from '@/app/components/alert';
import { FcEmptyTrash, FcSearch } from 'react-icons/fc';
import { MdArrowBackIos, MdClose } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { parseID } from '@/lib/func';

export default function TableDetail({
  row = [],
  setRow,
  bidang = {},
  getData = () => {},
  isBuka,
}) {
  const { id } = useParams();

  const [filtered, setFiltered] = useState([]);
  const [active, setActive] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(10);
  const [page, setPage] = useState(0);
  const [editingRow, setEditingRow] = useState(null);

  const hapus = async (item) => {
    SwalLoading('Menghapus data...');
    await fetchData('/api/realisasi', 'POST', { a: 'hapus', data: item });
    SwalSuccess(
      () => getData(id, parseInt(bidang.kode)),
      'Data berhasil dihapus'
    );
  };

  const hapusInvalid = () => {
    Swal.fire({
      title: 'Hapus',
      html: `Yakin ingin meghapus <br/> <b>Semua Data yang tidak valid</b>?<br/><small class=\"text-red-500\">Data tidak bisa dikembalikan</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then(async (res) => {
      if (res.isConfirmed) {
        SwalLoading('Menghapus data...');
        await fetchData('/api/realisasi', 'POST', {
          a: 'hapusInvalid',
          data: { tahap: id, kode_bidang: parseInt(bidang.kode) },
        });
        SwalSuccess(
          () => getData(id, parseInt(bidang.kode)),
          'Data berhasil dihapus'
        );
      }
    });
  };

  const updateOutput = async ({ id: kode, c, val }) => {
    const { data } = await fetchData('/api/realisasi', 'POST', {
      a: 'ubahitem',
      data: { id: kode, c, val, tahap: id },
    });
    if (!data?.[0]) return;
    setRow((prev) =>
      prev.map((item) => (item?.kode === kode ? data[0] : item))
    );
  };

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      row.filter((item) => JSON.stringify(item).toLowerCase().includes(q))
    );
  }, [search, row]);

  useEffect(() => {
    const from = page * selected;
    setActive(filtered.slice(from, from + selected));
    const totalPages = Math.ceil(filtered.length / selected);
    setPagination(Array.from({ length: totalPages }, (_, i) => i + 1));
  }, [filtered, selected, page]);

  const jumlahInvalid = row.filter((item) => item.status_data === 0).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center place-content-between">
        <strong>{bidang.bidang || 'N/A'}</strong>
        <button
          className="btn  btn-sm"
          onClick={() => {
            setRow(null);
          }}
        >
          <MdArrowBackIos /> Kembali
        </button>
      </div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-300 text-black">
              <th rowSpan={2}>No.</th>
              <th rowSpan={2}>Kode</th>
              <th rowSpan={2}>Sub Kegiatan</th>
              <th rowSpan={2}>Uraian Keluaran</th>
              <th colSpan={2}>Anggaran</th>
              <th colSpan={2}>Realisasi</th>
              <th rowSpan={2}>Satuan</th>
              <th rowSpan={2} className="text-right">
                {jumlahInvalid > 0 && (
                  <button
                    className="btn  btn-sm btn-error"
                    onClick={() => hapusInvalid()}
                  >
                    Hapus ({jumlahInvalid})
                  </button>
                )}
              </th>
            </tr>
            <tr className="bg-base-300 text-black">
              <th>Nilai</th>
              <th>Output</th>
              <th>Nilai</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={11}>
                <label className="input w-full">
                  <FcSearch />
                  <input
                    type="search"
                    className="grow"
                    placeholder="cari..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              </td>
            </tr>
            {active.map((item, i) => {
              const kode = item?.kode;
              const realisasi = item?.realisasi;
              const output = item?.output;

              return (
                <tr
                  key={i}
                  className={`hover:bg-base-300 ${
                    item?.status_data < 1 ? 'text-error' : ''
                  }`}
                  onDoubleClick={() => setEditingRow(kode)}
                >
                  <td>{page * selected + i + 1}</td>
                  <td>{item.kode_subkegiatan}</td>
                  <td>{item.subkegiatan || 'N/A'}</td>
                  <td>{item.uraian_output || 'N/A'}</td>

                  {/* Rencana Anggaran */}
                  <td className="text-right">
                    {editingRow === kode ? (
                      <NumericFormat
                        thousandSeparator="."
                        decimalSeparator=","
                        className="input input-sm"
                        defaultValue={item.rencana_anggaran}
                        onBlur={(e) =>
                          updateOutput({
                            id: kode,
                            c: 'rencana_anggaran',
                            val: parseID(e.target.value),
                          })
                        }
                      />
                    ) : (
                      item.rencana_anggaran?.toLocaleString('id-ID') || null
                    )}
                  </td>

                  {/* Rencana Output */}
                  <td className="text-right">
                    {editingRow === kode ? (
                      <NumericFormat
                        thousandSeparator="."
                        decimalSeparator=","
                        className="input input-sm"
                        defaultValue={item.rencana_output || null}
                        onBlur={(e) =>
                          updateOutput({
                            id: kode,
                            c: 'rencana_output',
                            val: parseID(e.target.value),
                          })
                        }
                      />
                    ) : (
                      item.rencana_output || null
                    )}
                  </td>

                  {/* Realisasi */}
                  <td className="text-right">
                    {editingRow === kode ? (
                      <NumericFormat
                        thousandSeparator="."
                        decimalSeparator=","
                        className="input input-sm"
                        defaultValue={realisasi}
                        onBlur={(e) =>
                          updateOutput({
                            id: kode,
                            c: 'realisasi',
                            val: parseID(e.target.value),
                          })
                        }
                      />
                    ) : (
                      realisasi?.toLocaleString('id-ID') || null
                    )}
                  </td>

                  {/* Output */}
                  <td className="text-right">
                    {editingRow === kode ? (
                      <NumericFormat
                        thousandSeparator="."
                        decimalSeparator=","
                        className="input input-sm"
                        defaultValue={output || null}
                        onBlur={(e) => {
                          e.currentTarget.value &&
                            updateOutput({
                              id: kode,
                              c: 'output',
                              val: parseID(e.target.value),
                            });
                          e.currentTarget.value &&
                            updateOutput({
                              id: kode,
                              c: 'rencana_output',
                              val: item.rencana_output || null,
                            });
                        }}
                      />
                    ) : (
                      output || null
                    )}
                  </td>

                  <td>{item.satuan}</td>
                  <td className="text-right">
                    {Boolean(isBuka) && (
                      <div className="join">
                        {editingRow === kode ? (
                          <button
                            className="btn btn-sm join-item"
                            onClick={() => setEditingRow(null)}
                          >
                            Selesai
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm join-item"
                            onClick={() => setEditingRow(kode)}
                          >
                            Ubah
                          </button>
                        )}
                        <button
                          className="btn btn-sm join-item"
                          onClick={() =>
                            Swal.fire({
                              title: 'Hapus',
                              html: `Yakin hapus <b>${item.subkegiatan}</b>?<br/><small class=\"text-red-500\">Data tidak bisa dikembalikan</small>`,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: 'red',
                              confirmButtonText: 'Ya, Hapus',
                              cancelButtonText: 'Batal',
                            }).then(
                              (res) => res.isConfirmed && hapus(item.kode)
                            )
                          }
                        >
                          <FcEmptyTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {!active.length && (
              <tr>
                <td colSpan={11} className="text-center text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <div className="join">
          <select
            className="select join-item"
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            {[10, 20, 50, 100, 500, 1000]
              .filter((v) => v <= 100 || v < row.length)
              .map((v) => (
                <option key={v}>{v}</option>
              ))}
          </select>
          <span className="btn join-item">per halaman</span>
        </div>
        <div className="flex-1 text-center">
          {Math.min((page + 1) * selected, row.length)} / {row.length}
        </div>
        {pagination.length > 1 && (
          <div className="join">
            <button
              className="btn join-item"
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              Awal
            </button>
            <button
              className="btn join-item"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              &lt;
            </button>
            {pagination
              .slice(
                Math.max(0, page - 1),
                Math.min(pagination.length, page + 2)
              )
              .map((p) => (
                <button
                  key={p}
                  className={`btn join-item ${
                    page === p - 1 ? 'btn-active' : ''
                  }`}
                  onClick={() => setPage(p - 1)}
                >
                  {p}
                </button>
              ))}
            <button
              className="btn join-item"
              onClick={() => setPage(Math.min(page + 1, pagination.length - 1))}
              disabled={page === pagination.length - 1}
            >
              &gt;
            </button>
            <button
              className="btn join-item"
              onClick={() => setPage(pagination.length - 1)}
              disabled={page === pagination.length - 1}
            >
              Akhir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
