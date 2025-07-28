import '@/app/globals.css';
import '@/app/loading.css';
import Navbar from '@/app/components/navbar';
import Menu from '@/app/components/menu';
import { Poppins } from 'next/font/google';
import { CekLogin } from '@/lib/func';

const font = Poppins({
  subsets: ['latin'],

  weight: ['400', '600', '700', '900'],
});

export const metadata = {
  title: 'E-LapKeu | Kab. Simeulue',
  description: 'Elektroik Laporan Keuangan Pemerintah Kab. Simeulue',
};

export default async function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${font.className} antialiased h-dvh`}>
        <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen">
          {/* Navbar */}
          <div className="row-start-1 col-span-2 print:hidden ">
            <Navbar />
          </div>

          {/* Menu */}
          <div
            className="row-start-2 col-start-1 w-80 overflow-hidden print:hidden"
            id="menu"
          >
            <Menu />
          </div>

          {/* Content */}
          <div
            className="row-start-2 col-start-2 p-4 max-w-full overflow-auto print:overflow-visible"
            id="content"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
