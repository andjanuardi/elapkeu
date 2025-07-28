'use client';
import { SwalError, SwalLoading, SwalSuccess } from '@/app/components/alert';
import { ListPicker } from '@/app/components/listPicker';
import fetchData from '@/lib/fetch';
import { levelLabel, PangkatGol } from '@/models/staticData';
import md5 from 'md5';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdSave } from 'react-icons/io';
import { PatternFormat } from 'react-number-format';
import Swal from 'sweetalert2';

export default function Ubah({ session = [] }) {
  const { id } = useParams();
  const router = useRouter();
  const [OPD, setOPD] = useState({});
  const [initLevel, setInitLevel] = useState();
  const [isGantiPassword, setGantiPassword] = useState(false);
  const [initData, setInitData] = useState([]);

  const getData = useCallback(async () => {
    SwalLoading('Memuat data...');
    const { data } = await fetchData(
      '/api/pengguna',
      'POST',
      {
        a: 'cari',
        data: id,
      },
      () => router.push('/pengaturan/pengguna')
    );

    data.map((item) => {
      setInitData(item);
      setInitLevel(item.level);
      setOPD({ kode: item.kode_opd, opd: item.opd });
    });
    Swal.close();
  }, [id, router]);

  async function submit(e) {
    SwalLoading('Menyimpan...');
    e.preventDefault();

    const formData = new FormData(e.target);
    const nama = formData.get('nama');
    const nip = formData.get('nip');
    const jabatan = formData.get('jabatan');
    const pass = formData.get('pass') ? md5(formData.get('pass')) : null;
    const email = formData.get('email');
    const level = formData.get('level');

    try {
      const response = await fetchData('/api/pengguna', 'POST', {
        a: 'ubah',
        data: [nama, nip, jabatan, OPD.kode, email, level, pass, id],
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

  const levelList = [
    levelLabel,
    levelLabel.filter((item, index) => index >= 2),
    levelLabel.filter((item, index) => index === 2),
    levelLabel.filter((item, index) => index === 3),
    levelLabel.filter((item, index) => index === 4),
    levelLabel.filter((item, index) => index === 5),
  ];

  return (
    <>
      {initData && (
        <form className="flex flex-col " onSubmit={(e) => submit(e)}>
          <h1 className="font-bold">Ubah Penguna</h1>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Pilih OPD</legend>
            <ListPicker
              url={'/api/opd'}
              labelIndex={1}
              className="input validator w-full"
              placeholder="Masukkan Nama OPD"
              onItemSelected={(value) => setOPD(value)}
              defaultValue={initData.opd}
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
              placeholder="Masukkan Nama Pengguna"
              defaultValue={initData.nama}
              required
            />
            <p className="label italic">Nama Pengguna</p>
            <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">NIP</legend>
            <PatternFormat
              format="##################"
              className="input validator w-full join-item"
              placeholder="Masukkan Nomor Induk Pegawai (NIP)"
              name="nip"
              mask={'_'}
              pattern="\d{18}"
              value={initData.nip}
              required
            />
            <p className="label italic">Nomor Induk Pegawai (NIP) Pengguna</p>
            <div className="validator-hint m-0 hidden">
              Tidak boleh kosong / Belum Lengkap
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Jabatan</legend>
            <input
              name="jabatan"
              type="text"
              className="input validator w-full"
              placeholder="Masukkan Jabatan"
              defaultValue={initData.jabatan}
              required
            />
            <p className="label italic">Jabatan dalam instansi</p>
            <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              name="email"
              type="email"
              className="input validator w-full"
              placeholder="Masukkan email"
              defaultValue={initData.email}
              required
            />
            <p className="label italic">Masukkan Email</p>
            <div className="validator-hint mt-0 hidden">
              Tidak boleh kosong/ format tidak sesuai
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Level</legend>
            <select
              className="select validator w-full"
              name="level"
              value={initLevel}
              onChange={(e) => setInitLevel(e.currentTarget.value)}
            >
              {levelList[session.level].map((item, key) => (
                <option key={key} value={key}>
                  {item}
                </option>
              ))}
            </select>
            <p className="label italic">Pilih Level Pengguna</p>
            <div className="validator-hint mt-0 hidden">Tidak boleh kosong</div>
          </fieldset>

          <fieldset className="fieldset p-2  ">
            <label className="label">
              <input
                type="checkbox"
                className="toggle"
                checked={isGantiPassword}
                onChange={(e) => setGantiPassword(!isGantiPassword)}
              />
              Ganti password ?
            </label>
          </fieldset>
          {isGantiPassword && (
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Kata Sandi</legend>
              <input
                name="pass"
                type="password"
                className="input validator w-full"
                placeholder="Masukkan Kata Sandi"
                required
              />
              <p className="label italic">Masukkan Kata Sandi</p>
              <div className="validator-hint mt-0 hidden">
                Tidak boleh kosong/ format tidak sesuai
              </div>
            </fieldset>
          )}

          <div className="join justify-end">
            <button type="submit" className="btn join-item btn-primary">
              <IoMdSave /> Ubah
            </button>
            <Link href="." type="button" className="btn join-item btn-error">
              Kembali
            </Link>
          </div>
        </form>
      )}
    </>
  );
}
