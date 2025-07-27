"use client";
import { SwalError, SwalLoading, SwalSuccess } from "@/app/components/alert";
import { ListPicker } from "@/app/components/listPicker";
import fetchData from "@/lib/fetch";
import { PangkatGol } from "@/models/staticData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdSave } from "react-icons/io";
import { PatternFormat } from "react-number-format";

export default function Tambah() {
  const router = useRouter();
  const [OPD, setOPD] = useState([]);

  async function submit(e) {
    SwalLoading("Menyimpan...");
    e.preventDefault();

    const formData = new FormData(e.target);
    const nama = formData.get("nama");
    const nip = formData.get("nip");
    const golongan = PangkatGol[formData.get("panggol")].golongan;
    const pangkat = PangkatGol[formData.get("panggol")].pangkat;
    const jabatan = formData.get("jabatan");
    const aktif = formData.get("aktif");

    try {
      const response = await fetchData("/api/pejabat", "POST", {
        a: "tambah",
        data: [null, OPD.kode, nama, nip, pangkat, golongan, jabatan, aktif],
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
      <h1 className="font-bold">Tambah Pejabat</h1>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Pilih OPD</legend>
        <ListPicker
          url={"/api/opd"}
          labelIndex={1}
          className="input validator w-full"
          placeholder="Masukkan Nama OPD"
          onItemSelected={(value) => setOPD(value)}
          required={true}
        />
        <p className="label italic">Masukkan Nama OPD</p>
        <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nama</legend>
        <input
          name="nama"
          type="text"
          className="input validator w-full"
          placeholder="Masukkan Nama Pejabat"
          required
        />
        <p className="label italic">Nama Pejabat</p>
        <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">NIP</legend>
        <PatternFormat
          format="##################"
          className="input validator w-full join-item"
          placeholder="Masukkan Nomor Induk Pegawai (NIP)"
          name="nip"
          mask={"_"}
          pattern="\d{18}"
          required
        />
        <p className="label italic">Nomor Induk Pegawai (NIP) Pejabat</p>
        <div className="validator-hint m-0 hidden">
          Tidak boleh kosong / Belum Lengkap
        </div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Pangkat / Golongan</legend>
        <select
          name="panggol"
          className="select validator w-full"
          placeholder="Pilih Pangkat / Golongan"
          required
        >
          {PangkatGol.map((item, key) => (
            <option key={key} value={key}>
              {item.pangkat} ({item.golongan})
            </option>
          ))}
        </select>
        <p className="label italic">Pilih Pangkat / Golongan Pejabat</p>
        <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Jabatan</legend>
        <input
          name="jabatan"
          type="text"
          className="input validator w-full"
          placeholder="Masukkan Jabatan"
          required
        />
        <p className="label italic">Jabatan dalam instansi</p>
        <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Status ?</legend>
        <div className="flex gap-2 items-center">
          <input
            type="radio"
            name="aktif"
            className="radio radio-success "
            defaultChecked
            value={1}
          />
          Aktif
          <input
            type="radio"
            name="aktif"
            className="radio ml-2 radio-error"
            value={0}
          />
          Tidak Aktif
        </div>
        <p className="label italic">
          Pilih status jabatan masih aktif atau tidak?
        </p>
        <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
      </fieldset>
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
