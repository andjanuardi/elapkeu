'use client';

import { SwalLoading, SwalSuccess } from '@/app/components/alert';
import InputNumber from '@/app/components/inputNumber';
import { SkeletonTable } from '@/app/components/skeleton';
import Table from '@/app/components/table';
import fetchData from '@/lib/fetch';
import { parseID } from '@/lib/func';
import { tahap } from '@/models/staticData';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdTrash } from 'react-icons/io';
import { MdArrowForwardIos, MdCheck, MdClose, MdEdit } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';

export default function TableData() {
  const [row, setRow] = useState([]);
  const [bidang, setBidang] = useState([]);
  const [tambahMode, setTambahMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const selectTahap = useRef();
  // const [selectTahap, setSelectTahap] = useState(1);
  const [inputNilai, setInputNilai] = useState(0);

  const [selectEditTahap, setSelectEditTahap] = useState(1);
  const [inputEditNilai, setInputEditNilai] = useState(0);

  const getData = useCallback(async () => {
    const { data } = await fetchData('/api/penyaluran');
    const { data: dataBidang } = await fetchData('/api/bidang');

    setRow(data);
    setBidang(dataBidang);
    setLoading(false);
  }, []);

  const tambah = useCallback(async () => {
    const tahap = selectTahap.current.value;
    setLoading(true);
    await fetchData('/api/penyaluran', 'POST', {
      a: 'tambah',
      data: [tambahMode, tahap, inputNilai],
    });
    getData();
    setTambahMode(false);
    setLoading(false);
  }, [selectTahap, inputNilai, tambahMode, getData]);

  const ubah = useCallback(async () => {
    setLoading(true);
    await fetchData('/api/penyaluran', 'POST', {
      a: 'ubah',
      data: [selectEditTahap, inputEditNilai, editMode],
    });
    getData();
    setEditMode(false);
    setLoading(false);
  }, [selectEditTahap, inputEditNilai, editMode, getData]);

  const hapus = useCallback(
    async (id) => {
      setLoading(true);
      await fetchData('/api/penyaluran', 'POST', { a: 'hapus', data: id });
      getData();
      setLoading(false);
    },
    [getData]
  );

  async function refresh() {
    getData();
  }

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (!tambahMode) {
      setInputNilai(0);
    }
  }, [tambahMode]);

  async function insert() {}

  return (
    <div>
      {loading ? (
        <SkeletonTable />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="w-full">Bidang</th>
              <th className="text-right">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {bidang.map((item_bidang, key) => (
              <React.Fragment key={key}>
                <tr className="font-bold">
                  <td>{item_bidang.bidang}</td>
                  <td className="text-right">
                    {row
                      .filter((item) => item.kode_bidang === item_bidang.kode)
                      .reduce((acc, curr) => acc + curr.nilai, 0)
                      .toLocaleString('id-ID')}
                  </td>
                  <td className="text-right">
                    {!tambahMode &&
                      row.filter(
                        (item) => item.kode_bidang === item_bidang.kode
                      ).length <= 2 && (
                        <button
                          className="btn btn-sm"
                          onClick={() => setTambahMode(item_bidang.kode)}
                        >
                          Tambah
                        </button>
                      )}
                  </td>
                </tr>

                {row
                  .filter((item) => item.kode_bidang === item_bidang.kode)
                  .map((item_row, key_row) => (
                    <React.Fragment key={`${key}-${key_row}`}>
                      {editMode === item_row.kode ? (
                        <tr>
                          <td>
                            <select
                              value={selectEditTahap}
                              onChange={(e) =>
                                setSelectEditTahap(e.currentTarget.value)
                              }
                              className="select select-sm w-full"
                              placeholder="Tahap"
                            >
                              <option value={1}>Tahap 1</option>
                              <option value={2}>Tahap 2</option>
                              <option value={3}>Tahap 3</option>
                            </select>
                          </td>
                          <td>
                            <NumericFormat
                              value={inputEditNilai}
                              thousandSeparator="."
                              placeholder="Nilai"
                              decimalSeparator=","
                              className="input input-sm w-50 text-right"
                              valueIsNumericString={true}
                              onChange={(e) =>
                                setInputEditNilai(
                                  parseID(e.currentTarget.value)
                                )
                              }
                            />
                          </td>
                          <td className="text-right ">
                            <div className="join">
                              <button
                                onClick={() => ubah(item_row.kode)}
                                className="btn btn-sm btn-square join-item"
                              >
                                <MdCheck />
                              </button>
                              <button
                                className="btn btn-sm btn-square join-item"
                                onClick={() => setEditMode(false)}
                              >
                                <MdClose />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td>Tahap {item_row.tahap}</td>
                          <td className="text-right">
                            {item_row.nilai.toLocaleString('id-ID')}
                          </td>
                          <td className="text-right ">
                            <div className="join">
                              <button
                                className="btn btn-sm btn-square join-item"
                                onClick={() => {
                                  setEditMode(item_row.kode);
                                  setInputEditNilai(item_row.nilai);
                                  setSelectEditTahap(item_row.tahap);
                                }}
                              >
                                <MdEdit />
                              </button>
                              <button
                                className="btn btn-sm btn-square join-item"
                                onClick={() => hapus(item_row.kode)}
                              >
                                <IoMdTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                {tambahMode === item_bidang.kode && (
                  <tr>
                    <td>
                      <select
                        // value={parseInt(selectTahap)}
                        // onChange={(e) => setSelectTahap(e.currentTarget.value)}
                        className="select select-sm w-full"
                        placeholder="Tahap"
                        ref={selectTahap}
                      >
                        {row.filter(
                          (item) =>
                            item_bidang.kode === item.kode_bidang &&
                            item.tahap === 1
                        ).length === 0 && <option value={1}>Tahap 1 </option>}
                        {row.filter(
                          (item) =>
                            item_bidang.kode === item.kode_bidang &&
                            item.tahap === 2
                        ).length === 0 && <option value={2}>Tahap 2 </option>}
                        {row.filter(
                          (item) =>
                            item_bidang.kode === item.kode_bidang &&
                            item.tahap === 3
                        ).length === 0 && <option value={3}>Tahap 3 </option>}
                      </select>
                    </td>
                    <td>
                      <NumericFormat
                        value={inputNilai}
                        thousandSeparator="."
                        placeholder="Nilai"
                        decimalSeparator=","
                        className="input input-sm w-50 text-right"
                        valueIsNumericString={true}
                        onChange={(e) =>
                          setInputNilai(parseID(e.currentTarget.value))
                        }
                      />
                    </td>
                    <td className="text-right ">
                      <div className="join">
                        <button
                          className="btn btn-sm btn-square join-item"
                          onClick={() => tambah()}
                        >
                          <MdCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-square join-item"
                          onClick={() => setTambahMode(false)}
                        >
                          <MdClose />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            <tr>
              <th>TOTAL</th>
              <th>
                {row
                  .reduce((acc, curr) => acc + curr.nilai, 0)
                  .toLocaleString('id-ID')}
              </th>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
