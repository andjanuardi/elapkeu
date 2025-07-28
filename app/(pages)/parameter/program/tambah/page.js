'use client';
import { SwalError, SwalLoading, SwalSuccess } from '@/app/components/alert';
import fetchData from '@/lib/fetch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoMdSave } from 'react-icons/io';
import { PatternFormat } from 'react-number-format';

export default function Tambah() {
  const router = useRouter();

  async function submit(e) {
    SwalLoading('Menyimpan...');
    e.preventDefault();

    const formData = new FormData(e.target);
    const program = formData.get('program');
    const kode = formData.get('kode');

    try {
      const response = await fetchData('/api/program', 'POST', {
        a: 'tambah',
        data: [kode, program],
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
      <h1 className="font-bold">Tambah Program</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kode Program</legend>
        <PatternFormat
          format="#.##.##"
          pattern="\d\.\d{2}\.\d{2}"
          mask={'_'}
          className="input validator w-full join-item"
          placeholder="Masukkan Kode Program"
          name="kode"
          required
        />
        <p className="label italic">
          Kode harus sama dengan Kode Program pada Aplikasi SIPD
        </p>
        <div className="validator-hint m-0 hidden">Tidak boleh kosong</div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nama Program</legend>
        <input
          name="program"
          type="text"
          className="input validator w-full"
          placeholder="Masukkan Nama program"
          required
        />
        <p className="label italic">
          Masukkan nama program yang ingin di tambahkan
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
