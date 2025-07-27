import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session.user || {};
}

export async function cekLogin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
}
