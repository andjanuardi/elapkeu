"use client";
import { SwalError, SwalLoading, SwalSuccess } from "@/app/components/alert";
import fetchData from "@/lib/fetch";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { IoMdSave } from "react-icons/io";
import Swal from "sweetalert2";

export default function Ubah() {
  const { id } = useParams();
  const router = useRouter();
  const inputKode = useRef();
  const inputNama = useRef();

  const getData = useCallback(async () => {
    SwalLoading("Memuat data...");
    const { data } = await fetchData(
      "/api/opd",
      "POST",
      {
        a: "cari",
        data: id,
      },
      () => router.push("/parameter/opd")
    );

    data.map((value) => {
      inputKode.current.defaultValue = value.kode;
      inputNama.current.defaultValue = value.opd;
    });
    Swal.close();
  }, [id, router]);

  async function submit(e) {
    SwalLoading("Menyimpan...");
    e.preventDefault();

    const formData = new FormData(e.target);
    const kode = formData.get("kode");
    const nama = formData.get("nama");

    try {
      const response = await fetchData("/api/opd", "POST", {
        a: "ubah",
        data: [kode, nama, id],
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
      <h1 className="font-bold">Ubah OPD</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kode OPD</legend>
        <input
          name="kode"
          ref={inputKode}
          type="text"
          className="input validator w-full"
          placeholder="Masukkan kode OPD"
          required
        />
        <p className="label italic">
          Kode harus sama dengan Kode OPD pada Aplikasi SIPD
        </p>
        <div className="validator-hint m-0 hidden">Tidak boleh kosong</div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nama OPD</legend>
        <input
          name="nama"
          ref={inputNama}
          type="text"
          className="input validator w-full"
          placeholder="Masukkan Nama OPD"
          required
        />
        <p className="label italic">
          Nama harus sama dengan Nama OPD pada Aplikasi SIPD
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
