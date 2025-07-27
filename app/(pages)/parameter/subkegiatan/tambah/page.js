"use client";
import { SwalError, SwalLoading, SwalSuccess } from "@/app/components/alert";
import { ListPicker } from "@/app/components/listPicker";
import fetchData from "@/lib/fetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdSave } from "react-icons/io";
import { PatternFormat } from "react-number-format";

export default function Tambah() {
  const router = useRouter();
  const [kodekegiatan, setKodeKegiatan] = useState(null);

  async function submit(e) {
    SwalLoading("Menyimpan...");
    e.preventDefault();

    const formData = new FormData(e.target);
    const kode = formData.get("kode");
    const subkegiatan = formData.get("subkegiatan");

    try {
      const response = await fetchData("/api/subkegiatan", "POST", {
        a: "tambah",
        data: [kode, subkegiatan],
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
      <h1 className="font-bold">Tambah Sub Kegiatan</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Cari Kegiatan</legend>
        <ListPicker
          url={"/api/kegiatan"}
          labelIndex={2}
          placeholder="Cari kegiatan.."
          onItemSelected={(value) => setKodeKegiatan(`${value.kode}`)}
        />
        <p className="label italic">
          Pilih kegiatan untuk Sub Kegiatan yang akan di tambah
        </p>
      </fieldset>
      {kodekegiatan !== null && (
        <>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Kode Sub Kegiatan</legend>
            <div className="join">
              <PatternFormat
                format={`${kodekegiatan}.####`}
                mask={"_"}
                value={`${kodekegiatan}.0___`}
                pattern="\d\.\d{2}\.\d{2}\.\d\.\d{2}\.\d{4}"
                className="input validator w-full join-item"
                placeholder="Masukkan Kode Sub Kegiatan"
                readOnly={kodekegiatan === null}
                name="kode"
                required
              />
            </div>

            <p className="label italic">
              Kode harus sama dengan Kode Sub Kegiatan pada Aplikasi SIPD
            </p>
            <div className="validator-hint m-0 hidden">Tidak boleh kosong</div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Nama Sub Kegiatan</legend>
            <input
              name="subkegiatan"
              type="text"
              className="input validator w-full"
              placeholder="Masukkan Nama Sub Kegiatan"
              required
            />
            <p className="label italic">
              Sub Kegiatan harus sama dengan Nama Sub Kegiatan pada Aplikasi
              SIPD
            </p>
            <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
          </fieldset>
        </>
      )}
      <div className="join justify-end">
        <button type="submit" className="btn join-item btn-primary">
          <IoMdSave /> Simpan
        </button>
        <Link href="." type="button" className="btn join-item btn-error">
          Kembali
        </Link>
      </div>
    </form>
  );
}
