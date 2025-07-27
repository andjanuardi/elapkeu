"use client";
import { useState } from "react";

export default function Test() {
  const [tableData, setTableData] = useState([]);

  return (
    <div>
      <table className="">
        <thead>
          <tr>
            <th>Kode OPD</th>
            <th>Kode Sub Kegiatan</th>
            <th>Nama</th>
            <th>Anggaran</th>
            <th>Realisasi</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, key) => (
            <tr key={key}>
              <td>{item.kode_opd}</td>
              <td>{item.kode_subkegiatan}</td>
              <td>{item.subkegiatan}</td>
              <td>{item.anggaran}</td>
              <td>{item.realisasi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
