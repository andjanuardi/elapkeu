"use client";
import { SwalError, SwalLoading, SwalSuccess } from "@/app/components/alert";
import { ListPicker } from "@/app/components/listPicker";
import fetchData from "@/lib/fetch";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoMdSave } from "react-icons/io";
import { PatternFormat } from "react-number-format";
import Swal from "sweetalert2";

export default function Ubah() {
  const { id } = useParams();
  const router = useRouter();
  const [initData, setInitData] = useState([]);
  const [selectedKegiatan, setSelectedKegiatan] = useState([]);

  const getData = useCallback(async () => {
    SwalLoading("Memuat data...");
    await fetchData(
      "/api/subkegiatan",
      "POST",
      {
        a: "cari",
        data: id,
      },
      () => router.push("/parameter/subkegiatan")
    ).then(({ data }) => {
      data.map((value) => setInitData(value));
    });

    Swal.close();
  }, [id, router]);

  async function submit(e) {
    SwalLoading("Menyimpan...");
    e.preventDefault();

    const formData = new FormData(e.target);
    const kode = formData.get("kode");
    const subkegiatan = formData.get("subkegiatan");

    try {
      const response = await fetchData("/api/subkegiatan", "POST", {
        a: "ubah",
        data: [kode, subkegiatan, id],
      });

      if (response.status) {
        SwalSuccess(() => router.back(), "Data berhasil disimpan");
      }
    } catch (error) {
      SwalError(() => {}, error);
    }
  }
  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => submit(e)}>
      <div>{}</div>
      <h1 className="font-bold">Ubah Sub Kegiatan</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Cari Kegiatan</legend>
        <ListPicker
          url={"/api/kegiatan"}
          defaultValue={`${initData.kode_kegiatan} - ${initData.kegiatan}`}
          labelIndex={2}
          placeholder="Cari kegiatan.."
          onItemSelected={(value) => setSelectedKegiatan(value)}
        />
        <p className="label italic">
          Pilih kegiatan untuk Sub Kegiatan yang akan di ubah
        </p>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kode Sub Kegiatan</legend>
        <PatternFormat
          format={`${
            selectedKegiatan.kode
              ? `${selectedKegiatan.kode}.####`
              : `${initData.kode_kegiatan}.####`
          }`}
          value={initData.kode_subkegiatan}
          mask="_"
          className="input validator w-full join-item"
          placeholder="Masukkan Kode Sub Kegiatan"
          name="kode"
          required
        />
        <p className="label italic">
          Kode harus sama dengan Kode Sub Kegiatan pada Aplikasi SIPD
        </p>
        <div className="validator-hint m-0 hidden">Tidak boleh kosong</div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nama Sub Kegiatan</legend>
        <input
          defaultValue={initData.subkegiatan}
          name="subkegiatan"
          type="text"
          className="input validator w-full"
          placeholder="Masukkan Nama Sub Kegiatan"
          required
        />
        <p className="label italic">
          Sub Kegiatan harus sama dengan Nama Sub Kegiatan pada Aplikasi SIPD
        </p>
        <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
      </fieldset>

      <div className="join justify-end">
        <button type="submit" className="btn join-item btn-primary">
          <IoMdSave /> Simpan
        </button>
        <Link href=".." type="button" className="btn join-item btn-error">
          Kembali
        </Link>
      </div>
    </form>
  );
}
