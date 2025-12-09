import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Buch-Webanwendung
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink to="/buecher">Bücher</NavLink>
            </li>
            <li>
              <NavLink to="/buecher/neu">Neu anlegen</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Seiteninhalt */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
