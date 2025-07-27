"use client";
import { SwalError, SwalLoading, SwalSuccess } from "@/app/components/alert";
import fetchData from "@/lib/fetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMdSave } from "react-icons/io";

export default function Tambah() {
  const router = useRouter();

  async function submit(e) {
    SwalLoading("Menyimpan...");
    e.preventDefault();

    const formData = new FormData(e.target);
    const kode = formData.get("kode");
    const nama = formData.get("nama");

    try {
      const response = await fetchData("/api/opd", "POST", {
        a: "tambah",
        data: [kode, nama],
      });

      if (response.status) {
        SwalSuccess(() => router.back(), "Data berhasil disimpan");
      }
    } catch (error) {
      SwalError(() => {}, error);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => submit(e)}>
      <h1 className="font-bold">Tambah OPD</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kode OPD</legend>
        <input
          name="kode"
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
