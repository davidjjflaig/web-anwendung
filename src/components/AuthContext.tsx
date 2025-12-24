import { createContext, useContext, useState, type ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  loggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('token'));

  const login = (token: string) => {
    Cookies.set('token', token, { expires: 1 });
    setLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
