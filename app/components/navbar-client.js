'use client';
import { IoMdPerson } from 'react-icons/io';
import { signOut } from 'next-auth/react';
import { BiMenu } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { levelLabel } from '@/models/staticData';
import Link from 'next/link';

export function UserButton({ session = {} }) {
  return (
    <div className="dropdown dropdown-end ">
      <div tabIndex={0} role="button" className="btn btn-ghost ">
        <div className="text-right hidden lg:flex flex-col leading-3  ">
          <div>{session.nama}</div>
          <div className="text-neutral-500 text-xs">
            {levelLabel[session?.level].label}
          </div>
        </div>
        <IoMdPerson className="text-2xl" />
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link href={`/pengaturan/pengguna/ubah/${session.kode}`}>Profil</Link>
        </li>
        <li onClick={() => signOut()}>
          <a>Keluar</a>
        </li>
      </ul>
    </div>
  );
}

export function MenuButton() {
  const [menu, setMenu] = useState(true);

  useEffect(() => {
    const element = document.getElementById('menu');
    const elementContent = document.getElementById('content');
    if (element) {
      if (menu) {
        element.classList.remove('w-0');
        element.classList.add('w-80');
        element.classList.remove('opacity-0');
        element.classList.add('opacity-100');
      } else {
        element.classList.remove('w-80');
        element.classList.add('w-0');
        element.classList.remove('opacity-100');
        element.classList.add('opacity-0');
      }
    }
    if (elementContent) {
      if (menu) {
        elementContent.classList.remove('opacity-100');
        elementContent.classList.add('opacity-0');
        elementContent.classList.add('lg:opacity-100');
      } else {
        elementContent.classList.remove('opacity-0');
        elementContent.classList.add('opacity-100');
        elementContent.classList.add('lg:opacity-100');
      }
    }
  }, [menu]);

  return (
    <label
      htmlFor="menu-drawer"
      className="btn btn-circle text-xl"
      onClick={() => setMenu(!menu)}
    >
      <BiMenu />
    </label>
  );
}
