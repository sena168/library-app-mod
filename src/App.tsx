import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CategoryPage } from './pages/CategoryPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { AuthorPage } from './pages/AuthorPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessBorrowPage } from './pages/SuccessBorrowPage';
import { AdminPage } from './pages/AdminPage';
import AdminPreviewBookPage from './pages/AdminPreviewBookPage';
import AdminAddBookPage from './pages/AdminAddBookPage';
import AdminEditBookPage from './pages/AdminEditBookPage';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { ProtectedAdminRoute } from './components/shared/ProtectedAdminRoute';
import { Layout } from './components/layout/Layout';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          {/* Public homepage - accessible to all users */}
          <Route
            path='/'
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          {/* Protected routes with Layout */}
          <Route
            path='/category'
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/books/:id'
            element={
              <ProtectedRoute>
                <Layout>
                  <BookDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/author/:id'
            element={
              <ProtectedRoute>
                <Layout>
                  <AuthorPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/cart'
            element={
              <ProtectedRoute>
                <Layout>
                  <CartPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <Layout>
                  <CheckoutPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/success-borrow'
            element={
              <ProtectedRoute>
                <Layout>
                  <SuccessBorrowPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path='/admin'
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/preview/:bookId'
            element={
              <ProtectedAdminRoute>
                <AdminPreviewBookPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/add-book'
            element={
              <ProtectedAdminRoute>
                <AdminAddBookPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/edit-book/:bookId'
            element={
              <ProtectedAdminRoute>
                <AdminEditBookPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Catch all */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
