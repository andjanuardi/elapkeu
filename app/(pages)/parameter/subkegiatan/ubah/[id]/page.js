'use client';
import { SwalError, SwalLoading, SwalSuccess } from '@/app/components/alert';
import { ListPicker } from '@/app/components/listPicker';
import fetchData from '@/lib/fetch';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { IoMdSave } from 'react-icons/io';
import { PatternFormat } from 'react-number-format';
import Swal from 'sweetalert2';

export default function Ubah() {
  const { id } = useParams();
  const router = useRouter();
  const [initData, setInitData] = useState([]);
  const [satuan, setSatuan] = useState();

  const getData = useCallback(async () => {
    SwalLoading('Memuat data...');
    await fetchData(
      '/api/subkegiatan',
      'POST',
      {
        a: 'cari',
        data: id,
      },
      () => router.push('/parameter/subkegiatan')
    ).then(({ data }) => {
      data.map((value) => setInitData(value));
    });

    Swal.close();
  }, [id, router]);

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
        a: 'ubah',
        data: [kode, subkegiatan, kinerja, indikator, satuan, id],
      });

      if (response.status) {
        SwalSuccess(() => router.back(), 'Data berhasil disimpan');
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
        <legend className="fieldset-legend">Kode Sub Kegiatan</legend>
        <PatternFormat
          format={`#.##.##.#.##.####`}
          mask={'_'}
          pattern="\d\.\d{2}\.\d{2}\.\d\.\d{2}\.\d{4}"
          value={initData.kode}
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
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kinerja Sub Kegiatan</legend>
        <textarea
          name="kinerja"
          type="text"
          className="textarea validator w-full"
          placeholder="Masukkan Indikator Kinerja Sub Kegiatan"
          required
          defaultValue={initData.kinerja}
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
          defaultValue={initData.indikator}
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
          defaultValue={initData.satuan}
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
        <Link href=".." type="button" className="btn join-item btn-error">
          Kembali
        </Link>
      </div>
    </form>
  );
}
