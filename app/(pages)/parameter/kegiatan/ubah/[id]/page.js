'use client';
import { SwalError, SwalLoading, SwalSuccess } from '@/app/components/alert';
import fetchData from '@/lib/fetch';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { IoMdSave } from 'react-icons/io';
import { PatternFormat } from 'react-number-format';
import Swal from 'sweetalert2';

export default function Ubah() {
  const { id } = useParams();
  const router = useRouter();
  const inputKode = useRef();
  const inputKegiatan = useRef();

  const getData = useCallback(async () => {
    SwalLoading('Memuat data...');
    const { data } = await fetchData(
      '/api/kegiatan',
      'POST',
      {
        a: 'cari',
        data: id,
      },
      () => router.push('/parameter/kegiatan')
    );

    data.map((value) => {
      inputKode.current.defaultValue = value.kode;
      inputKegiatan.current.defaultValue = value.kegiatan;
    });
    Swal.close();
  }, [id, router]);

  async function submit(e) {
    SwalLoading('Menyimpan...');
    e.preventDefault();

    const formData = new FormData(e.target);
    const kode = formData.get('kode');
    const kegiatan = formData.get('kegiatan');

    try {
      const response = await fetchData('/api/kegiatan', 'POST', {
        a: 'ubah',
        data: [kode, kegiatan, id],
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
      <h1 className="font-bold">Ubah Kegiatan</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kode Kegiatan</legend>
        <PatternFormat
          format="#.##.##.#.##"
          pattern="\d\.\d{2}\.\d{2}\.\d\.\d{2}"
          mask={'_'}
          className="input validator w-full join-item"
          placeholder="Masukkan Kode Kegiatan"
          name="kode"
          getInputRef={inputKode}
          required
        />
        {/* <input
          name="kode"
          ref={inputKode}
          type="text"
          className="input validator w-full"
          placeholder="Masukkan kode Kegiatan"
          required
        /> */}
        <p className="label italic">
          Kode harus sama dengan Kode Kegiatan pada Aplikasi SIPD
        </p>
        <div className="validator-hint m-0 hidden">Tidak boleh kosong</div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nama Kegiatan</legend>
        <input
          name="kegiatan"
          ref={inputKegiatan}
          type="text"
          className="input validator w-full"
          placeholder="Masukkan Nama Kegiatan"
          required
        />
        <p className="label italic">
          Kegiatan harus sama dengan Nama Kegiatan pada Aplikasi SIPD
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
