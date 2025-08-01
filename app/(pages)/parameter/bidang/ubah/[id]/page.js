'use client';
import { SwalError, SwalLoading, SwalSuccess } from '@/app/components/alert';
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

  const getData = useCallback(async () => {
    SwalLoading('Memuat data...');
    const { data } = await fetchData(
      '/api/bidang',
      'POST',
      {
        a: 'cari',
        data: id,
      },
      () => router.push('/parameter/bidang')
    );

    data.map((value) => {
      setInitData(value);
    });
    Swal.close();
  }, [id, router]);

  async function submit(e) {
    SwalLoading('Menyimpan...');
    e.preventDefault();

    const formData = new FormData(e.target);
    const bidang = formData.get('bidang');

    try {
      const response = await fetchData('/api/bidang', 'POST', {
        a: 'ubah',
        data: [id, bidang, id],
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
      <h1 className="font-bold">Ubah bidang</h1>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nama Bidang</legend>
        <input
          name="bidang"
          defaultValue={initData.bidang}
          type="text"
          className="input validator w-full"
          placeholder="Masukkan Nama bidang"
          required
        />
        <p className="label italic">
          Masukkan nama bidang yang ingin di tambahkan
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
