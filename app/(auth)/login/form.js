'use client';

import { SwalError, SwalSuccess } from '@/app/components/alert';
import { getSession } from '@/app/components/auth';
import fetchData from '@/lib/fetch';
import md5 from 'md5';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MdEmail } from 'react-icons/md';

import { RiLockPasswordFill, RiLoginBoxLine, RiUserFill } from 'react-icons/ri';
import Swal from 'sweetalert2';

export default function FormLogin() {
  const ta = new Date();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const loginData = {
      user: formData.get('email'),
      pass: md5(formData.get('password')),
      tahun: formData.get('ta'),
      redirect: false,
    };

    const login = await signIn('credentials', loginData);
    if (login?.error) {
      SwalError(() => {}, 'Email atau password salah.');
    } else {
      checkBatasWaktu();

      SwalSuccess(() => router.push('/'), 'Selamat Datang');
    }
  }

  const checkBatasWaktu = useCallback(async () => {
    const { data } = await fetchData('/api/pengaturan', 'POST', { a: 'waktu' });
    if (data && data.length === 0) {
      const { data } = await fetchData('/api/pengaturan', 'POST', {
        a: 'resetWaktu',
      });
    }
  }, []);

  return (
    <form className="flex flex-col gap-2 py-2" onSubmit={handleSubmit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email pengguna</legend>
        <label className="input validator w-full">
          <MdEmail />
          <input
            type="email"
            required
            placeholder="Email"
            name="email"
            autoComplete="username"
          />
        </label>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kata Sandi</legend>
        <label className="input validator w-full">
          <RiLockPasswordFill />
          <input
            autoComplete="password"
            type="password"
            required
            placeholder="Masukkan kata sandi"
            name="password"
          />
        </label>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Tahun Anggaran</legend>
        <select
          className="select w-full"
          name="ta"
          required
          defaultValue={ta.getFullYear()}
        >
          <option value={ta.getFullYear() - 2}>{ta.getFullYear() - 2} </option>
          <option value={ta.getFullYear() - 1}>{ta.getFullYear() - 1} </option>
          <option value={ta.getFullYear()}>{ta.getFullYear()}</option>
          <option value={ta.getFullYear() + 1}>{ta.getFullYear() + 1}</option>
        </select>
      </fieldset>
      <span
        className="text-xs italic self-end link no-underline w-fit  "
        onClick={() =>
          Swal.fire(
            'Lupa Kata Sandi',
            'Untuk mendapatkan kata sandi yang baru silahkan hubungin administrator di BPKD Kab. Simeulue '
          )
        }
      >
        Lupa password ?
      </span>
      <button className="btn join-item w-full btn-primary mt-4" type="submit">
        <RiLoginBoxLine /> Masuk
      </button>
    </form>
  );
}
