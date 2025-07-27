import { menu } from '@/app/components/menu';
import Link from 'next/link';

export default function Breadcrumbs({ parentId, childId }) {
  const activemenu = menu[parentId];
  const activechild = activemenu.child[childId];
  return (
    <div className="flex print:hidden">
      <span className="flex-1 flex items-center gap-2 font-bold text-lg ">
        {activechild.logo} {activechild.label}
      </span>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <span>
              {activemenu.logo}
              {activemenu.label}
            </span>
          </li>
          <li>
            <Link href={activechild.link}>
              {activechild.logo}
              {activechild.label}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
