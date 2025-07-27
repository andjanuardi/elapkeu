import { getSession } from '@/app/components/auth';
import Breadcrumbs from '@/app/components/breadcrumbs';
import { ListPicker } from '@/app/components/listPicker';
import { FcPrint } from 'react-icons/fc';
import { RiFileExcel2Fill } from 'react-icons/ri';
import Link from 'next/link';

export default async function Layout({ children }) {
  const session = await getSession();
  return (
    <div className="flex flex-col gap-2 h-full">
      <Breadcrumbs parentId={3} childId={0} />

      <div className="rounded bg-base-200 inset-shadow-sm  flex-1 overflow-auto print:overflow-visible">
        {children}
      </div>
    </div>
  );
}
