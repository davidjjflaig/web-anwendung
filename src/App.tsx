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

function PrivateRoute({ isloggedin, children }: { isloggedin: boolean; children: JSX.Element }) {
  return isloggedin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const token = Cookies.get('token');
  const [isloggedin, setisloggedin] = useState(!!token);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage isloggedin={isloggedin} />} />
          <Route path="/buecher" element={<BooksPage />} />

          <Route
            path="/buecher/neu"
            element={
              <PrivateRoute isloggedin={isloggedin}>
                <NewBookPage />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<LoginPage onLogin={() => setisloggedin(true)} />} />

          <Route path="/buecher/:id" element={<BookDetails />} />

          <Route
            path="/buecher/update/:id"
            element={
              <PrivateRoute isloggedin={isloggedin}>
                <EditBookPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/buecher/select"
            element={
              <PrivateRoute isloggedin={isloggedin}>
                <SelectBookPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
