import { Poppins } from 'next/font/google';
import '@/app/globals.css';
import '@/app/loading.css';
import Head from 'next/head';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
});

export const metadata = {
  title: 'E-LapKeu | Login | Kab. Simeulue',
  description: 'Elektroik Laporan Keuangan Pemerintah Kab. Simeulue',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }

  return (
    <html lang="id">
      <Head>
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <body
        className={`${font.className} antialiased  h-dvh flex flex-col min-h-dvh `}
      >
        <div id="content" className="flex-1 flex  ">
          <div className="flex-1 inset-shadow-sm  hidden md:flex  place-content-center place-items-center  bg-video relative  overflow-hidden min-h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute h-auto w-auto min-h-full min-w-full object-cover -z-1"
            >
              <source src="/assets/video/login.mp4" type="video/mp4" />
            </video>
            <div className="relative z-1  bg-black/80 w-full h-full place-content-center text-center flex flex-col ">
              <span className="font-black text-base-100 text-6xl">
                E-LAPKEU
              </span>
              <span className="font-bold text-base-100 text-3xl">
                ELEKTRONIK PELAPORAN KEUANGAN
              </span>
            </div>
          </div>
          <div className="p-16 min-h-full  bg-white min-w-lg   ">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
