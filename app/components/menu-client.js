"use client";
import { signOut } from "next-auth/react";
import { FcDownLeft } from "react-icons/fc";

export function LogoutMenu() {
  return (
    <li onClick={() => signOut()}>
      <span className="text-lg font-bold">
        <FcDownLeft /> Keluar
      </span>
    </li>
  );
}
