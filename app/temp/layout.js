import "@/app/globals.css";
import "@/app/loading.css";
import Navbar from "@/app/components/navbar";
import Menu from "@/app/components/menu";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],

  weight: ["400", "600", "700", "900"],
});

export const metadata = {
  title: "E-LapKeu | Kab. Simeulue",
  description: "Elektroik Laporan Keuangan Pemerintah Kab. Simeulue",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en ">
      <body className={`${font.className} antialiased h-dvh`}>
        <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen">
          {/* Navbar */}
          <div className="row-start-1 col-span-2 ">
            <Navbar />
          </div>

          {/* Menu */}
          <div className="row-start-2 col-start-1 w-80">
            <Menu />
          </div>

          {/* Content */}
          <div className="row-start-2 col-start-2  p-4">{children}</div>
        </div>
      </body>
    </html>
  );
}
