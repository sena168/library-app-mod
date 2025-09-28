import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminUser } from '../../lib/types/adminTypes';

interface AdminUserListProps {
  users: AdminUser[];
  loading: boolean;
  onEditUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
}

export const AdminUserList: React.FC<AdminUserListProps> = ({
  users,
  loading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof AdminUser>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower) ||
      false
    );
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (field: keyof AdminUser) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center w-full h-32'>
        <div className='text-gray-600'>Loading users...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start p-0 gap-[15px] w-[361px] md:w-[1200px]'>
      {/* Header Section */}
      <div className='flex flex-col items-start p-0 gap-[15px] w-[361px] md:w-[1200px]'>
        {/* Title */}
        <h2
          className='font-bold text-[24px] leading-[36px] tracking-[-0.02em] text-[#0A0D12] w-[361px] md:text-[28px] md:leading-[38px] md:w-auto'
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          Users
        </h2>

        {/* Search Bar */}
        <div className='flex flex-row items-center px-4 py-2 gap-1.5 w-[361px] h-11 bg-white border border-[#D5D7DA] rounded-full md:w-[600px] md:h-12'>
          <Search className='w-5 h-5 text-[#535862]' />
          <input
            type='text'
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='flex-1 h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#535862] bg-transparent border-none outline-none'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          />
        </div>
      </div>

      {/* Mobile: User Cards */}
      <div className='flex flex-col items-start p-0 gap-[15px] w-[361px] md:hidden'>
        {currentUsers.length > 0 ? (
          currentUsers.map((user, index) => (
            <div
              key={user.id}
              className='flex flex-col items-start p-3 gap-1 w-[361px] h-[180px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-xl'
            >
              {/* No */}
              <div className='flex flex-row justify-between items-center p-0 w-[337px] h-7'>
                <span
                  className='font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  No
                </span>
                <span
                  className='font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] text-right flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {startIndex + index + 1}
                </span>
              </div>

              {/* Name */}
              <div className='flex flex-row justify-between items-center p-0 w-[337px] h-7'>
                <span
                  className='font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Name
                </span>
                <span
                  className='font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] text-right flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {user.name}
                </span>
              </div>

              {/* Email */}
              <div className='flex flex-row justify-between items-center p-0 w-[337px] h-7'>
                <span
                  className='font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Email
                </span>
                <span
                  className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] text-right flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {user.email}
                </span>
              </div>

              {/* Phone */}
              <div className='flex flex-row justify-between items-center p-0 w-[337px] h-7'>
                <span
                  className='font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Nomor Handphone
                </span>
                <span
                  className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] text-right flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {user.phone || 'N/A'}
                </span>
              </div>

              {/* Created At */}
              <div className='flex flex-row justify-between items-center p-0 w-[337px] h-7'>
                <span
                  className='font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Created at
                </span>
                <span
                  className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] text-right flex-shrink-0'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className='flex justify-center items-center w-full h-32'>
            <p className='text-gray-600'>No users found</p>
          </div>
        )}

        {/* Mobile Pagination */}
        <div className='flex flex-row items-center p-0 gap-4 w-[347px] h-10 bg-white'>
          {/* Previous */}
          <div className='flex flex-row items-center p-0 gap-1.5 w-[91px] h-[30px]'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='flex flex-row items-center p-0 gap-1.5 w-[91px] h-[30px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <ChevronLeft className='w-6 h-6 text-[#0A0D12]' />
              <span
                className='font-medium text-base leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Previous
              </span>
            </button>
          </div>

          {/* Page Numbers */}
          <div className='flex flex-row items-center p-0 w-[160px] h-10'>
            {/* Page 1 */}
            <div className='flex flex-col justify-center items-center p-2 gap-2 w-10 h-10'>
              <button
                onClick={() => handlePageChange(1)}
                className={`w-6 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-center transition-colors ${
                  currentPage === 1 ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                }`}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                1
              </button>
            </div>

            {/* Page 2 */}
            <div className='flex flex-col justify-center items-center p-2 gap-2 w-10 h-10 border border-[#D5D7DA] rounded-[10px]'>
              <button
                onClick={() => handlePageChange(2)}
                className={`w-6 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-center transition-colors ${
                  currentPage === 2 ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                }`}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                2
              </button>
            </div>

            {/* Page 3 */}
            <div className='flex flex-col justify-center items-center p-2 gap-2 w-10 h-10'>
              <button
                onClick={() => handlePageChange(3)}
                className={`w-6 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-center transition-colors ${
                  currentPage === 3 ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                }`}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                3
              </button>
            </div>

            {/* Page 4 */}
            <div className='flex flex-col justify-center items-center p-2 gap-2 w-10 h-10'>
              <button
                onClick={() => handlePageChange(4)}
                className={`w-6 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-center transition-colors ${
                  currentPage === 4 ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                }`}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                ...
              </button>
            </div>
          </div>

          {/* Next */}
          <div className='flex flex-row items-center p-0 gap-1.5 w-[64px] h-[30px]'>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='flex flex-row items-center p-0 gap-1.5 w-[64px] h-[30px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <span
                className='font-medium text-base leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Next
              </span>
              <ChevronRight className='w-6 h-6 text-[#0A0D12]' />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Users Table */}
      <div className='hidden md:flex flex-col items-start p-4 gap-4 w-[1200px] h-[800px] bg-white border border-[#D5D7DA] shadow-[0px_0px_24px_rgba(203,202,202,0.2)] rounded-xl'>
        {/* Table Header */}
        <div className='flex flex-row items-center p-0 gap-2 w-[1168px] h-[64px]'>
          <div className='flex flex-row justify-center items-center px-4 py-2 gap-2 w-[44px] h-[64px] bg-[#FAFAFA]'>
            <button
              onClick={() => handleSort('id')}
              className='flex flex-row items-center p-0 gap-1 w-[19px] h-[28px] hover:bg-gray-100 rounded transition-colors'
            >
              <span
                className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                No
              </span>
              {sortField === 'id' && (
                <span className='text-xs'>
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
          <div className='flex flex-row items-center px-4 py-2 gap-2 w-[281px] h-[64px] bg-[#FAFAFA] flex-1'>
            <button
              onClick={() => handleSort('name')}
              className='flex flex-row items-center p-0 gap-1 w-[40px] h-[28px] hover:bg-gray-100 rounded transition-colors'
            >
              <span
                className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Name
              </span>
              {sortField === 'name' && (
                <span className='text-xs'>
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
          <div className='flex flex-row items-center px-4 py-2 gap-2 w-[281px] h-[64px] bg-[#FAFAFA] flex-1'>
            <button
              onClick={() => handleSort('phone')}
              className='flex flex-row items-center p-0 gap-1 w-[126px] h-[28px] hover:bg-gray-100 rounded transition-colors'
            >
              <span
                className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Nomor Handphone
              </span>
              {sortField === 'phone' && (
                <span className='text-xs'>
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
          <div className='flex flex-row items-center px-4 py-2 gap-2 w-[281px] h-[64px] bg-[#FAFAFA] flex-1'>
            <button
              onClick={() => handleSort('email')}
              className='flex flex-row items-center p-0 gap-1 w-[36px] h-[28px] hover:bg-gray-100 rounded transition-colors'
            >
              <span
                className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Email
              </span>
              {sortField === 'email' && (
                <span className='text-xs'>
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
          <div className='flex flex-row items-center px-4 py-2 gap-2 w-[281px] h-[64px] bg-[#FAFAFA] flex-1'>
            <button
              onClick={() => handleSort('createdAt')}
              className='flex flex-row items-center p-0 gap-1 w-[71px] h-[28px] hover:bg-gray-100 rounded transition-colors'
            >
              <span
                className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Created At
              </span>
              {sortField === 'createdAt' && (
                <span className='text-xs'>
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className='flex flex-col items-start p-0 gap-0 w-[1168px]'>
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <div
                key={user.id}
                className='flex flex-row items-center p-0 gap-2 w-[1168px] h-[64px] border-b border-[#D5D7DA] hover:bg-gray-50 transition-colors'
              >
                <div className='flex flex-row items-center px-4 py-2 gap-2 w-[44px] h-[64px]'>
                  <span
                    className='font-semibold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {startIndex + index + 1}
                  </span>
                </div>
                <div className='flex flex-row items-center px-4 py-2 gap-2 w-[281px] h-[64px] flex-1'>
                  <span
                    className='font-semibold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12] truncate'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {user.name}
                  </span>
                </div>
                <div className='flex flex-row items-center px-4 py-2 gap-2 w-[281px] h-[64px] flex-1'>
                  <span
                    className='font-semibold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12] truncate'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {user.phone || 'N/A'}
                  </span>
                </div>
                <div className='flex flex-row items-center px-4 py-2 gap-2 w-[281px] h-[64px] flex-1'>
                  <span
                    className='font-semibold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12] truncate'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {user.email}
                  </span>
                </div>
                <div className='flex flex-row items-center px-4 py-2 gap-2 w-[281px] h-[64px] flex-1'>
                  <span
                    className='font-semibold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className='flex justify-center items-center w-full h-32'>
              <p className='text-gray-600'>No users found</p>
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className='flex flex-row justify-between items-center px-6 py-0 gap-4 w-[1168px] h-[64px]'>
          {/* Entries Info */}
          <div className='flex flex-row items-center p-0 gap-4 w-[199px] h-[30px]'>
            <span
              className='font-medium text-base leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{' '}
              {filteredUsers.length} entries
            </span>
          </div>

          {/* Pagination */}
          <div className='flex flex-row items-center p-0 gap-4 w-[347px] h-[40px] bg-white'>
            {/* Frame 1618873708 - Previous */}
            <div className='flex flex-row items-center p-0 gap-1.5 w-[91px] h-[30px]'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='flex flex-row items-center p-0 gap-1.5 w-[91px] h-[30px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <ChevronLeft className='w-6 h-6 text-[#0A0D12]' />
                <span
                  className='font-medium text-base leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Previous
                </span>
              </button>
            </div>

            {/* Frame 1618873710 - Page Numbers */}
            <div className='flex flex-row items-center p-0 gap-4 w-[160px] h-[40px]'>
              {/* Frame 1618873707 - Page 1 */}
              <div className='flex flex-col justify-center items-center p-2 gap-2 w-10 h-10'>
                <button
                  onClick={() => handlePageChange(1)}
                  className={`w-6 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-center transition-colors ${
                    currentPage === 1 ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  1
                </button>
              </div>

              {/* Frame 1618873709 - Page 2 */}
              <div className='flex flex-col justify-center items-center p-2 gap-2 w-10 h-10 border border-[#D5D7DA] rounded-[10px]'>
                <button
                  onClick={() => handlePageChange(2)}
                  className={`w-6 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-center transition-colors ${
                    currentPage === 2 ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  2
                </button>
              </div>

              {/* Frame 1618873711 - Page 3 */}
              <div className='flex flex-col justify-center items-center p-2 gap-2 w-10 h-10'>
                <button
                  onClick={() => handlePageChange(3)}
                  className={`w-6 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-center transition-colors ${
                    currentPage === 3 ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  3
                </button>
              </div>

              {/* Frame 1618873710 - Page 4 */}
              <div className='flex flex-col justify-center items-center p-2 gap-2 w-10 h-10'>
                <button
                  onClick={() => handlePageChange(4)}
                  className={`w-6 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-center transition-colors ${
                    currentPage === 4 ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  ...
                </button>
              </div>
            </div>

            {/* Frame 1618873711 - Next */}
            <div className='flex flex-row items-center p-0 gap-1.5 w-[64px] h-[30px]'>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='flex flex-row items-center p-0 gap-1.5 w-[64px] h-[30px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <span
                  className='font-medium text-base leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Next
                </span>
                <ChevronRight className='w-6 h-6 text-[#0A0D12]' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
