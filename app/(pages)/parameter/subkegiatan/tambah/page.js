'use client';
import { SwalError, SwalLoading, SwalSuccess } from '@/app/components/alert';
import { ListPicker } from '@/app/components/listPicker';
import fetchData from '@/lib/fetch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdSave } from 'react-icons/io';
import { PatternFormat } from 'react-number-format';

export default function Tambah() {
  const router = useRouter();
  const [satuan, setSatuan] = useState();

  async function submit(e) {
    SwalLoading('Menyimpan...');
    e.preventDefault();

    const formData = new FormData(e.target);
    const kode = formData.get('kode');
    const subkegiatan = formData.get('subkegiatan');
    const kinerja = formData.get('kinerja');
    const indikator = formData.get('indikator');

    try {
      const response = await fetchData('/api/subkegiatan', 'POST', {
        a: 'tambah',
        data: [kode, subkegiatan, kinerja, indikator, satuan],
      });

      if (response.status) {
        SwalSuccess(() => router.back(), 'Data berhasil disimpan');
      }
    } catch (error) {
      SwalError(() => {}, error);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => submit(e)}>
      <h1 className="font-bold">Tambah Sub Kegiatan</h1>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kode Sub Kegiatan</legend>
        <div className="join">
          <PatternFormat
            format={`#.##.##.#.##.####`}
            mask={'_'}
            pattern="\d\.\d{2}\.\d{2}\.\d\.\d{2}\.\d{4}"
            className="input validator w-full join-item"
            placeholder="Masukkan Kode Sub Kegiatan"
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
          Sub Kegiatan harus sama dengan Nama Sub Kegiatan pada Aplikasi SIPD
        </p>
        <div className="validator-hint mt-0 hidden">Kinerja</div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kinerja Sub Kegiatan</legend>
        <textarea
          name="kinerja"
          type="text"
          className="textarea validator w-full"
          placeholder="Masukkan Indikator Kinerja Sub Kegiatan"
          required
        />
        <p className="label italic">
          Masukkan Indikator Kinerja Sub Kegiatan berdasarkan aturan yang
          berlaku
        </p>
        <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Indikator Output/Keluaran Sub Kegiatan
        </legend>
        <textarea
          name="indikator"
          type="text"
          className="textarea validator w-full"
          placeholder="Masukkan Indikator Indikator Output/Keluaran Sub Kegiatan"
          required
        />
        <p className="label italic">
          Masukkan Indikator Output/Keluaran Sub Kegiatan berdasarkan aturan
          yang berlaku
        </p>
        <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Satuan</legend>
        <ListPicker
          url={'/api/satuan'}
          className="input validator w-full"
          placeholder="Masukkan Satuan"
          required
          onItemSelected={(e) => setSatuan(e?.satuan)}
        />
        <p className="label italic">
          Masukkan Satuan berdasarkan aturan yang berlaku
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
