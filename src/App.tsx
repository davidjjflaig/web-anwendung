import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import BooksPage from './pages/BooksPage';
import NewBookPage from './pages/NewBookPage';
import LoginPage from './pages/LoginPage';
import BookDetails from './pages/BookDetails';
import { EditBookPage } from './pages/BookUpdate';
import { SelectBookPage } from './pages/UpdateNavigator';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buecher" element={<BooksPage />} />
          <Route path="/buecher/neu" element={<NewBookPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/buecher/:id" element={<BookDetails />} />
          <Route path="/buecher/update/:id" element={<EditBookPage />} />
          <Route path="/buecher/select" element={<SelectBookPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
