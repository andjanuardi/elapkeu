"use client";

import { usePathname } from "next/navigation";
import { MdModeEdit } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FcEmptyTrash, FcPrint, FcSearch, FcSynchronize } from "react-icons/fc";
import Swal from "sweetalert2";

export default function Table({
  coll,
  row,
  funcHapus,
  funcRefresh,
  showPrint = false,
  labelIndexHapus = 1,
}) {
  const [selectedDataPerPage, setSelectedDataPerPage] = useState(10);
  const [startPage, setStartPage] = useState(0);
  const [activeRow, setActiveRow] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredRow, setFilteredRow] = useState(row);
  const pathname = usePathname();

  // Filter data berdasarkan searchText

  useEffect(() => {
    setFilteredRow(
      row.filter((item) =>
        item.some((cell) =>
          cell.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
  }, [searchText, row]);

  // Update data yang ditampilkan berdasarkan pagination dan searchText
  useEffect(() => {
    setActiveRow(
      filteredRow.slice(
        startPage * selectedDataPerPage,
        startPage * selectedDataPerPage + selectedDataPerPage
      )
    );
  }, [startPage, selectedDataPerPage, filteredRow]);

  // Hitung ulang jumlah halaman saat data berubah
  useEffect(() => {
    const totalPage = Math.ceil(filteredRow.length / selectedDataPerPage);
    const tempPagination = Array.from({ length: totalPage }, (_, i) => i + 1);
    setPagination(tempPagination);
    setStartPage(0);
  }, [selectedDataPerPage, filteredRow]);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 ">
        <table className="table">
          <thead>
            <tr className="bg-base-300 text-black">
              <th>No.</th>
              {coll.map(
                (item, key) =>
                  !item.hidden && (
                    <th key={key} className={item.className}>
                      {item.label}
                    </th>
                  )
              )}
              <th className="text-right">
                <div className="join join-vertical lg:join-horizontal">
                  <Link
                    href={`${pathname}/tambah`}
                    className="btn join-item btn-sm"
                  >
                    Tambah
                  </Link>
                  {showPrint && (
                    <div className="tooltip tooltip-left" data-tip="Cetak">
                      <button className="btn join-item btn-sm text-lg">
                        <FcPrint />
                      </button>
                    </div>
                  )}
                  <div
                    className="tooltip tooltip-left "
                    data-tip="Refresh data"
                  >
                    <button
                      className="btn join-item btn-sm text-lg"
                      onClick={() => funcRefresh()}
                    >
                      <FcSynchronize />
                    </button>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={coll.length + 2}>
                <label className="input w-full">
                  <FcSearch />
                  <input
                    type="search"
                    className="grow"
                    placeholder="cari.."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </label>
              </td>
            </tr>
            {activeRow.map((items, keys) => (
              <tr key={keys} className={`hover:bg-base-300 `}>
                <td>{startPage * selectedDataPerPage + keys + 1}</td>
                {coll.map(
                  (item, key) =>
                    !item.hidden && (
                      <td key={key} className={item.className}>
                        {items[key]}
                      </td>
                    )
                )}
                <td className="text-right">
                  <div className="join join-vertical lg:join-horizontal">
                    <div className="tooltip tooltip-left" data-tip="Ubah">
                      <Link
                        href={`${pathname}/ubah/${items[0]}`}
                        className="btn join-item btn-sm text-lg"
                      >
                        <MdModeEdit />
                      </Link>
                    </div>
                    <div className="tooltip tooltip-left" data-tip="Hapus">
                      <button
                        className="btn join-item btn-sm text-lg"
                        onClick={() =>
                          Swal.fire({
                            title: "Hapus",
                            html: `Apakah anda yakin menghapus <br/> 
                            <strong>${items[labelIndexHapus]}</strong> ? <br/> <br/> 
                            <small style=color:red> <i>* Data yang telah di hapus tidak dapat di kembalikan lagi.</i> <small>`,
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Ya, Hapus !",
                            confirmButtonColor: "red",
                            cancelButtonText: "Tidak, Batalkan !",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              funcHapus(items[0]);
                            }
                          })
                        }
                      >
                        <FcEmptyTrash />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {activeRow.length === 0 && (
              <tr>
                <td
                  colSpan={coll.length + 2}
                  className="text-center text-gray-500"
                >
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        {/* Select Jumlah Data Per Halaman */}
        <div className="join">
          <select
            className="select join-item"
            value={selectedDataPerPage}
            onChange={(e) =>
              setSelectedDataPerPage(Number(e.currentTarget.value))
            }
          >
            {[10, 20, 50, 100, 500, 1000].map((value) =>
              value <= 100 || value < row.length ? (
                <option key={value} value={value}>
                  {value}
                </option>
              ) : null
            )}
          </select>
          <span className="btn join-item">data per halaman</span>
        </div>
        <div className="flex-1 text-center">
          <span>
            {Math.min((startPage + 1) * selectedDataPerPage, row.length)} /{" "}
            {row.length}
          </span>
        </div>
        {/* Tombol Pagination */}
        {pagination.length > 1 && (
          <div className="join">
            {/* Tombol ke Halaman Awal */}
            <button
              className="join-item btn"
              onClick={() => setStartPage(0)}
              disabled={startPage === 0}
            >
              Awal
            </button>

            {/* Tombol Sebelumnya */}
            <button
              className="join-item btn"
              onClick={() => setStartPage((prev) => Math.max(prev - 1, 0))}
              disabled={startPage === 0}
            >
              &lt;
            </button>

            {/* Tiga tombol halaman di tengah */}
            {pagination
              .slice(
                Math.max(0, startPage - 1),
                Math.min(pagination.length, startPage + 2)
              )
              .map((item, key) => {
                const pageIndex = item - 1;
                return (
                  <button
                    key={key}
                    className={`join-item btn ${
                      startPage === pageIndex ? "btn-active" : ""
                    }`}
                    onClick={() => setStartPage(pageIndex)}
                  >
                    {item}
                  </button>
                );
              })}

            {/* Tombol Selanjutnya */}
            <button
              className="join-item btn"
              onClick={() =>
                setStartPage((prev) =>
                  Math.min(prev + 1, pagination.length - 1)
                )
              }
              disabled={startPage === pagination.length - 1}
            >
              &gt;
            </button>

            {/* Tombol ke Halaman Akhir */}
            <button
              className="join-item btn"
              onClick={() => setStartPage(pagination.length - 1)}
              disabled={startPage === pagination.length - 1}
            >
              Akhir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
