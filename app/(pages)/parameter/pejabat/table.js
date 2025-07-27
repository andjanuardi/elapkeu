"use client";

import { SwalLoading, SwalSuccess } from "@/app/components/alert";
import { SkeletonTable } from "@/app/components/skeleton";
import Table from "@/app/components/table";
import fetchData from "@/lib/fetch";
import { useCallback, useEffect, useState } from "react";

export default function TableData() {
  const [row, setRow] = useState([]);
  const [loading, setLoading] = useState(true);

  const coll = [
    { label: "kode", className: "hidden" },
    { label: "Nama" },
    { label: "NIP", className: "w-0" },
    { label: "Pangkat / Golongan" },
    { label: "Jabatan" },
    { label: "OPD" },
    { label: "Aktif", className: "text-center" },
  ];

  const getData = useCallback(async () => {
    const { data } = await fetchData("/api/pejabat");
    const rowData = data.map((item) => [
      item.kode,
      item.nama,
      item.nip,
      `${item.pangkat} (${item.golongan})`,
      item.jabatan,
      item.opd,
      item.aktif === 1 ? (
        <div className="badge badge-success">Aktif</div>
      ) : (
        <div className="badge badge-error">Tidak Aktif</div>
      ),
    ]);
    setRow(rowData);
    setLoading(false);
  }, []);

  async function hapus(id) {
    SwalLoading("Menghapus data...");
    await fetchData("/api/pejabat", "POST", { a: "hapus", data: id }).then(
      () => {
        SwalSuccess(() => getData(), "Data berhasil di hapus");
      }
    );
  }

  async function refresh() {
    getData();
  }

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      {loading ? (
        <SkeletonTable />
      ) : (
        <Table
          coll={coll}
          row={row}
          funcHapus={hapus}
          funcRefresh={refresh}
          labelIndexHapus={1}
        />
      )}
    </div>
  );
}
