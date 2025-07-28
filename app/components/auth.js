'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { menuByLevel } from './menu';
import { harusLogin } from '@/lib/func';
import { headers } from 'next/headers';

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session.user || {};
}
