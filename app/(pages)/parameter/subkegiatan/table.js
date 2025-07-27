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
    { label: "Kode", className: "w-0" },
    { label: "Sub Kegiatan", className: "w-full" },
  ];

  const getData = useCallback(async () => {
    const { data } = await fetchData("/api/subkegiatan");
    const rowData = data.map((item) => [item.kode, item.subkegiatan]);
    setRow(rowData);
    setLoading(false);
  }, []);

  async function hapus(id) {
    SwalLoading("Menghapus data...");
    await fetchData("/api/subkegiatan", "POST", { a: "hapus", data: id }).then(
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
        <Table coll={coll} row={row} funcHapus={hapus} funcRefresh={refresh} />
      )}
    </div>
  );
}
