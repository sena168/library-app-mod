import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { AdminUser } from '../lib/types/adminTypes';
import { mockUsers } from '../lib/mockData/adminMockData';
import { AdminBookList } from '../components/admin/AdminBookList';
import { AdminUserList } from '../components/admin/AdminUserList';
import { AdminBorrowedList } from '../components/admin/AdminBorrowedList';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminDeleteBookModal } from '../components/admin/AdminDeleteBookModal';
import { useToast } from '../contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

// Import only the API service
import { adminApi } from '../lib/api/adminService';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  // Get active tab from URL params, default to 'users' if not specified
  const tabFromUrl = searchParams.get('tab') as
    | 'borrowed'
    | 'users'
    | 'books'
    | null;
  const [activeTab, setActiveTab] = useState<'borrowed' | 'users' | 'books'>(
    tabFromUrl || 'users'
  );
  const [adminUser, setAdminUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all admin data in parallel
      const [, , borrowedBooksData] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getUsers(),
        adminApi.getBorrowedBooks(),
      ]);

      // Since the API doesn't provide comprehensive user data, let's use mock data
      // In a real application, this would come from the API
      setUsers(mockUsers);
      setBorrowedBooks(borrowedBooksData);
    } catch {
      // Set mock data for demonstration if API fails
      setUsers(mockUsers);
      setBorrowedBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is admin
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Check for admin role or specific admin email
    const isAdmin =
      user &&
      (user.role === 'admin' ||
        user.role === 'ADMIN' ||
        user.email === 'admin@library.local');

    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }

    // Store admin user data
    setAdminUser({
      name: user.name || 'Admin',
      email: user.email,
    });

    fetchAdminData();
  }, [navigate, fetchAdminData]);

  // Handle click outside to close logout popup

  const handleEditUser = (userId: number) => {
    alert(`Edit user ${userId} - This would open an edit modal`);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm(`Are you sure you want to delete user ${userId}?`)) {
      alert(`Delete user ${userId} - This would delete the user`);
    }
  };

  const handleTabChange = (tab: 'borrowed' | 'users' | 'books') => {
    setActiveTab(tab);
    // Update URL params to persist tab state
    setSearchParams({ tab });
  };

  const handleEditBook = (bookId: number) => {
    navigate(`/admin/edit-book/${bookId}`);
  };

  const handleDeleteBook = (bookId: number) => {
    // Find the book title for the modal
    const booksData = queryClient.getQueryData(['books', 'all']) as
      | { id: number; title: string }[]
      | undefined;
    const book = booksData?.find((b) => b.id === bookId);
    setBookToDelete({ id: bookId, title: book?.title || 'Unknown Book' });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);
    try {
      await adminApi.deleteBook(bookToDelete.id);

      // Invalidate all books-related queries to refresh the book list
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['books', 'recommended'] });
      queryClient.invalidateQueries({ queryKey: ['books', 'top-rated'] });

      showSuccess('Book deleted successfully');
      setDeleteModalOpen(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Failed to delete book:', error);
      showError('Failed to delete book. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setBookToDelete(null);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-gray-900 text-xl'>Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <AdminHeader adminName={adminUser?.name || 'Admin'} />

      {/* Main Content */}
      <div className='flex flex-col items-start p-0 gap-[30px] w-full max-w-[1200px] mx-auto mt-[50px] pb-8 md:max-w-[1200px] max-w-[361px] px-4 md:px-0'>
        {/* Tab Navigation */}
        <div className='flex flex-row items-center p-2 gap-2 w-[600px] h-14 bg-[#F5F5F5] rounded-2xl md:w-[600px] md:h-14 w-full h-[56px]'>
          <button
            onClick={() => handleTabChange('borrowed')}
            className={`flex flex-row justify-center items-center px-3 py-2 gap-2 h-10 rounded-xl transition-all flex-1 ${
              activeTab === 'borrowed'
                ? 'bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'
                : 'hover:bg-gray-100'
            }`}
          >
            <span
              className={`font-medium text-base leading-[30px] tracking-[-0.03em] md:text-base md:leading-[30px] text-xs leading-[16px] whitespace-nowrap ${
                activeTab === 'borrowed'
                  ? 'text-[#0A0D12] font-bold'
                  : 'text-[#535862]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Borrowed List
            </span>
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`flex flex-row justify-center items-center px-3 py-2 gap-2 h-10 rounded-xl transition-all flex-1 ${
              activeTab === 'users'
                ? 'bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'
                : 'hover:bg-gray-100'
            }`}
          >
            <span
              className={`font-medium text-base leading-[30px] tracking-[-0.03em] md:text-base md:leading-[30px] text-sm leading-[20px] ${
                activeTab === 'users'
                  ? 'text-[#0A0D12] font-bold'
                  : 'text-[#535862]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Users
            </span>
          </button>
          <button
            onClick={() => handleTabChange('books')}
            className={`flex flex-row justify-center items-center px-3 py-2 gap-2 h-10 rounded-xl transition-all flex-1 ${
              activeTab === 'books'
                ? 'bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'
                : 'hover:bg-gray-100'
            }`}
          >
            <span
              className={`font-medium text-base leading-[30px] tracking-[-0.03em] md:text-base md:leading-[30px] text-sm leading-[20px] ${
                activeTab === 'books'
                  ? 'text-[#0A0D12] font-bold'
                  : 'text-[#535862]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Book List
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className='flex flex-col items-start p-0 gap-6 w-[1200px] md:w-[1200px] w-full'>
          {/* Users Tab Content */}
          {activeTab === 'users' && (
            <AdminUserList
              users={users}
              loading={loading}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {/* Borrowed List Tab Content */}
          {activeTab === 'borrowed' && (
            <AdminBorrowedList
              borrowedBooks={borrowedBooks}
              loading={loading}
            />
          )}

          {/* Book List Tab Content */}
          {activeTab === 'books' && (
            <AdminBookList
              onEditBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
            />
          )}
        </div>
      </div>

      {/* Delete Book Modal */}
      <AdminDeleteBookModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        bookTitle={bookToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};
