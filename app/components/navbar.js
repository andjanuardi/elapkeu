import { BiMenu } from 'react-icons/bi';
import { IoMdNotifications } from 'react-icons/io';
import { MenuButton, UserButton } from './navbar-client';
import { getSession } from './auth';
import Menu from './menu';

export default async function Navbar() {
  const env = process.env;
  const session = await getSession();

  return (
    <div className="navbar bg-base-100 shadow-sm p-0 items-center ">
      <div className="w-80 bg-base-300 p-5 text-center inset-shadow-sm hidden lg:block ">
        <span className="text-xl font-black ">{env.APP_NAME}</span>
      </div>
      <div className="flex-1 px-4 place-items-center flex gap-2">
        <MenuButton />
        <span className="font-semibold hidden lg:block ">{session.opd}</span>
      </div>
      <div className="flex-none flex place-items-center gap-3 px-4">
        {session.tahun}
        {/* NOTIF */}
        {/* <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <IoMdNotifications className="text-2xl" />
              <span className="badge badge-xs indicator-item badge-info">
                8
              </span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-1 mt-3  shadow"
          >
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Pesan 1</a>
              </li>
              <li>
                <a>Pesan 2</a>
              </li>
              <li>
                <a>Pesan 3</a>
              </li>
              <li>
                <a>Pesan 4</a>
              </li>
            </ul>
          </div>
        </div> */}
        <UserButton session={session} />
      </div>
    </div>
  );
}
