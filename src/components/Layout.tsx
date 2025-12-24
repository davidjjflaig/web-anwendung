import { BookOpenIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('token'));

  const handleLogout = () => {
    Cookies.remove('token');
    setLoggedIn(false);
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'active font-bold' : '';

  return (
    <div className="flex flex-col min-h-screen bg-base-200 font-sans">
      <header className="sticky top-0 z-50 w-full navbar bg-base-100/90 backdrop-blur shadow-sm border-b border-base-200">
        <div className="container mx-auto flex justify-between">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-4xl font-black text-primary gap-3">
              <BookOpenIcon className="h-12 w-12" />
              <span>BuchApp</span>
            </Link>
          </div>

          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 gap-2 items-center">
              <li>
                <NavLink to="/buecher" className={getLinkClass}>
                  Bücherliste
                </NavLink>
              </li>
              <li>
                <NavLink to="/buecher/neu" className={getLinkClass}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Neu
                </NavLink>
              </li>
              <li>
                {loggedIn ? (
                  <button onClick={handleLogout} className="btn btn-sm btn-outline">
                    Logout
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `btn btn-sm btn-outline ${isActive ? 'btn-active' : ''}`
                    }
                  >
                    Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 fade-in">{children}</main>

      <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded-t-2xl">
        <aside>
          <BookOpenIcon className="h-10 w-10 text-primary" />
          <p className="font-bold text-lg">
            By Mika Stolz, Kenan Seckanovic, Muhammed Güner & David Flaig
            <br />
            <span className="font-normal opacity-70">Erstellt mit React, Vite & daisyUI</span>
          </p>
          <p className="text-xs opacity-50">
            Copyright © {new Date().getFullYear()} - Alle Rechte vorbehalten
          </p>
        </aside>
      </footer>
    </div>
  );
}
