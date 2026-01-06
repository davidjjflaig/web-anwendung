import { BookOpenIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

type LayoutProps = {
  children: ReactNode;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

export default function Layout({ children, isLoggedIn, setIsLoggedIn }: LayoutProps) {

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-bold text-primary' : '';

  return (
    <div className="flex flex-col min-h-screen bg-base-200 font-sans">
      <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-200">
        <div className="navbar container mx-auto">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-2xl md:text-4xl font-black gap-2 md:gap-3">
              <BookOpenIcon className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              <span>BuchApp</span>
            </Link>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex flex-none">
            <ul className="menu menu-horizontal gap-2 items-center">
              <li>
                <NavLink to="/buecher" className={linkClass}>
                  Bücherliste
                </NavLink>
              </li>
              <li>
                <NavLink to="/buecher/neu" className={linkClass}>
                  Neu
                </NavLink>
              </li>
              <li>
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="btn btn-sm btn-outline">
                    Logout
                  </button>
                ) : (
                  <NavLink to="/login" className="btn btn-sm btn-outline">
                    Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>

          {/* MOBILE */}
          <div className="md:hidden dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost text-xl">
              ☰
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <NavLink to="/buecher">Bücherliste</NavLink>
              </li>
              <li>
                <NavLink to="/buecher/neu">Neues Buch</NavLink>
              </li>
              <li>
                {isLoggedIn ? (
                  <button onClick={handleLogout}>Logout</button>
                ) : (
                  <NavLink to="/login">Login</NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 fade-in">{children}</main>

      <footer className="footer footer-center p-8 md:p-10 bg-base-300 text-base-content rounded-t-2xl">
        <aside className="text-center">
          <BookOpenIcon className="h-10 w-10 text-primary mx-auto mb-2" />
          <p className="font-bold md:text-lg">
            BuchApp
            <br />
            <span className="font-normal opacity-70">React · Tailwind · daisyUI</span>
          </p>
          <p className="text-xs opacity-50 mt-2">
            © {new Date().getFullYear()} – Alle Rechte vorbehalten
          </p>
        </aside>
      </footer>
    </div>
  );
}
