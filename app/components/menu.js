import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  FcBullish,
  FcBusinessman,
  FcDepartment,
  FcDisplay,
  FcDocument,
  FcDownLeft,
  FcHome,
  FcMindMap,
  FcOvertime,
  FcPortraitMode,
  FcPrint,
  FcRatings,
  FcSettings,
  FcStatistics,
  FcTimeline,
} from 'react-icons/fc';
import { LogoutMenu } from './menu-client';
import { getSession } from './auth';

export const menu = [
  {
    label: 'Beranda',
    link: '/',
    logo: <FcHome />,
  },
  {
    label: 'Parameter',
    logo: <FcMindMap />,
    child: [
      { logo: <FcDepartment />, label: 'Daftar OPD', link: '/parameter/opd' },
      {
        logo: <FcBusinessman />,
        label: 'Daftar Pejabat',
        link: '/parameter/pejabat',
      },
      {
        logo: <FcTimeline />,
        label: 'Daftar Bidang',
        link: '/parameter/bidang',
      },
      {
        logo: <FcTimeline />,
        label: 'Daftar Progam',
        link: '/parameter/program',
      },
      {
        logo: <FcTimeline />,
        label: 'Daftar Kegiatan',
        link: '/parameter/kegiatan',
      },
      {
        logo: <FcTimeline />,
        label: 'Daftar Sub Kegiatan',
        link: '/parameter/subkegiatan',
      },
      {
        logo: <FcDisplay />,
        label: 'Daftar Satuan',
        link: '/parameter/satuan',
      },
    ],
    open: false,
  },
  {
    label: 'Data Transaksi',
    logo: <FcStatistics />,
    child: [
      {
        logo: <FcBullish />,
        label: 'Data Realisasi',
        link: '/transaksi/realisasi',
      },
    ],
    open: true,
  },
  {
    logo: <FcPrint />,
    label: 'Laporan',
    child: [
      {
        logo: <FcRatings />,
        label: 'Laporan Rincian',
        link: '/laporan/rincian',
      },
      {
        logo: <FcDocument />,
        label: 'Laporan Per Tahap',
        link: '/laporan/tahap',
      },
    ],
    open: true,
  },
  {
    logo: <FcSettings />,
    label: 'Pengaturan',
    child: [
      {
        logo: <FcPortraitMode />,
        label: 'Pengaturan Pengguna',
        link: '/pengaturan/pengguna',
      },
      {
        logo: <FcOvertime />,
        label: 'Pengaturan Batas Waktu',
        link: '/pengaturan/waktu',
      },
      // {
      //   logo: <FcSettings />,
      //   label: 'Pengaturan Lainnya',
      //   link: '/pengaturan-lain',
      // },
    ],
    open: true,
  },
];

const menuSuperAdmin = [menu[0], menu[3], menu[4]];

const menuAdministrator = [menu[0], menu[1], menu[2], menu[3], menu[4]];

const menuAdminOPD = [
  menu[0],
  {
    ...menu[1],
    child: [menu[1].child[1]],
  },
  ,
  menu[2],
  menu[3],
  menu[4],
];

const menuOperatorOPD = [
  menu[0],
  {
    ...menu[1],
    child: [menu[1].child[1]],
  },
  ,
  menu[2],
  menu[3],
];

const menuVerifikator = [menu[0], menu[3]];

export const menuByLevel = [
  menuSuperAdmin,
  menuAdministrator,
  menuAdminOPD,
  menuOperatorOPD,
  menuVerifikator,
];

export default async function Menu() {
  const { level } = await getSession();
  return (
    <div className=" bg-base-200 inset-shadow-sm h-full flex flex-col ">
      <input id="menu-drawer" className="hidden" type="checkbox" />
      <ul className="menu  text-base-content  w-full flex-1 py-4  ">
        {menuByLevel[level].map((item, key) => (
          <li key={key}>
            {item.child && (
              <details open={item.open}>
                <summary className="text-lg font-bold">
                  {item.logo} {item.label}
                </summary>

                <ul>
                  {item.child.map((childItem, childKey) => (
                    <li key={childKey}>
                      <Link href={childItem.link}>
                        {childItem.logo}
                        {childItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {!item.child && (
              <Link href={item.link} className="text-lg font-bold">
                {item.logo} {item.label}
              </Link>
            )}
          </li>
        ))}
        <LogoutMenu />
      </ul>
      <div className="bg-base-300 p-4 text-center">
        Pemerintah Kab. Simeulue
      </div>
    </div>
  );
}
