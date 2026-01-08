/**
 * Authentifizierungs-Context für die Anwendung.
 *
 * Verwaltet den Login-Zustand des Benutzers und stellt
 * Funktionen zum Ein- und Ausloggen bereit.
 * Der Auth-Status wird über ein Token-Cookie persistiert.
 */

import { createContext, useContext, useState, type ReactNode } from 'react';
import Cookies from 'js-cookie';

/**
 * Typdefinition für den AuthContext.
 */
interface AuthContextType {
  /** Gibt an, ob der Benutzer aktuell eingeloggt ist. */
  loggedIn: boolean;

  /**
   * Loggt den Benutzer ein und speichert das Token im Cookie.
   *
   * @param token JWT-Access-Token
   */
  login: (token: string) => void;

  /**
   * Loggt den Benutzer aus und entfernt das Token-Cookie.
   */
  logout: () => void;
}

/**
 * React Context für Authentifizierungsdaten.
 * Ist `undefined`, wenn er außerhalb des AuthProviders verwendet wird.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider-Komponente für den AuthContext.
 *
 * Initialisiert den Login-Zustand anhand des vorhandenen Token-Cookies
 * und stellt Login- und Logout-Funktionen bereit.
 *
 * @param children Untergeordnete React-Komponenten
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('token'));

  /**
   * Speichert das Authentifizierungs-Token im Cookie
   * und setzt den Login-Status auf `true`.
   *
   * @param token JWT-Access-Token
   */
  const login = (token: string) => {
    Cookies.set('token', token, { expires: 1 });
    setLoggedIn(true);
  };

  /**
   * Entfernt das Authentifizierungs-Token aus dem Cookie
   * und setzt den Login-Status auf `false`.
   */
  const logout = () => {
    Cookies.remove('token');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>{children}</AuthContext.Provider>
  );
};

/**
 * Custom Hook zum Zugriff auf den AuthContext.
 *
 * @returns AuthContext mit Login-Status und Auth-Funktionen
 * @throws Error wenn der Hook außerhalb des AuthProviders verwendet wird
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
