import Image from 'next/image';
import FormLogin from './form';

export default async function Login() {
  return (
    <div className="flex flex-col gap-2 place-content-center h-full  ">
      <div className="flex  place-content-between place-items-center">
        <Image
          src="/assets/img/logo.png"
          alt="Logo"
          width={50}
          height={100}
          className="w-auto"
        />
        <div className="text-right flex flex-col gap-0 font-semibold ">
          <span>PEMERINTAH</span>
          <span className="text-xl font-bold">KABUPATEN SIMEULUE</span>
        </div>
      </div>
      <div className="divider m-1" />
      <div className="text-center">
        <div className="font-black text-4xl">E-LAPKEU</div>
        <div>Elektroik Laporan Keuangan</div>
      </div>
      <FormLogin />
      <div className="flex flex-col text-sm place-content-center w-full text-center mt-4">
        <span className="font-semibold">Badan Pengelolaan Keuangan Daerah</span>
        <span className="italic">Versi 1.0 @ 2025</span>
      </div>
    </div>
  );
}
