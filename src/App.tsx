/**
 * Zentrale Einstiegskomponente der Anwendung.
 *
 * Definiert das Routing, bindet das Layout ein und verwaltet
 * den globalen Login-Status des Benutzers.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, type JSX } from 'react';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import BooksPage from './pages/BooksPage';
import NewBookPage from './pages/NewBookPage';
import LoginPage from './pages/LoginPage';
import BookDetails from './pages/BookDetails';
import { EditBookPage } from './pages/BookUpdate';
import { SelectBookPage } from './pages/UpdateNavigator';
import Cookies from 'js-cookie';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Schützt Routen vor unautorisiertem Zugriff.
 *
 * Rendert die übergebene Komponente nur, wenn der Benutzer
 * eingeloggt ist. Andernfalls erfolgt eine Weiterleitung
 * zur Login-Seite.
 *
 * @param isLoggedIn Aktueller Login-Status
 * @param children Geschützte Route
 * @returns Geschützte Route oder Redirect zur Login-Seite
 */
function PrivateRoute({ isLoggedIn, children }: { isLoggedIn: boolean; children: JSX.Element }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

/**
 * Hauptkomponente der Anwendung.
 *
 * Initialisiert den Login-Status anhand eines Token-Cookies
 * und definiert alle verfügbaren Routen der Anwendung.
 *
 * @returns React-Komponente für die gesamte Anwendung
 */
export default function App() {
  const token = Cookies.get('token');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  return (
    <BrowserRouter>
      <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/buecher" element={<BooksPage />} />

          <Route
            path="/buecher/neu"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <NewBookPage />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />

          <Route path="/buecher/:id" element={<BookDetails />} />

          <Route
            path="/buecher/update/:id"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <EditBookPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/buecher/select"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <SelectBookPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
