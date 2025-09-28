import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProfileCard } from '../components/shared/ProfileCard';
import { BorrowedListCard } from '../components/shared/BorrowedListCard';
import { ReviewModal } from '../components/shared/ReviewModal';
import { UserReviewsCard } from '../components/shared/UserReviewsCard';
import { useToast } from '../contexts/ToastContext';
import { Footer } from '../components/layout/Footer';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  phone?: string;
  profilePicture?: string;
}

interface UserReview {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  book: {
    id: number;
    title: string;
    coverImage?: string;
  };
}

type TabType = 'profile' | 'borrowed' | 'reviews';

export const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'BORROWED' | 'LATE' | 'RETURNED'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle tab URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');

    if (
      tabParam === 'borrowed' ||
      tabParam === 'reviews' ||
      tabParam === 'profile'
    ) {
      setActiveTab(tabParam as TabType);
    } else {
      // Default to profile if no valid tab parameter
      setActiveTab('profile');
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('auth-token');

      // Fetch profile
      const profileResponse = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const profileData = await profileResponse.json();

      // Get profile from API and add localStorage profile picture if exists
      const apiProfile = profileData.data?.profile;
      const savedProfilePicture = localStorage.getItem('userProfilePicture');

      setProfile({
        ...apiProfile,
        profilePicture:
          savedProfilePicture || apiProfile?.profilePicture || undefined,
      });

      // Fetch reviews
      const reviewsResponse = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/me/reviews',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const reviewsData = await reviewsResponse.json();
      const userReviews = reviewsData.data?.reviews || [];

      setReviews(userReviews);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGiveReview = (bookId: number, bookTitle: string) => {
    setSelectedBook({ id: bookId, title: bookTitle });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!selectedBook) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/reviews',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId: selectedBook.id,
            star: rating,
            comment: comment,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showSuccess(
          'Review Submitted',
          'Your review has been submitted successfully!'
        );
        setIsReviewModalOpen(false);
        setSelectedBook(null);
        // Trigger refresh of reviews and profile data
        setReviewsRefreshTrigger((prev) => prev + 1);
        await fetchProfileData(); // Refresh the data immediately
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const handleEditUserReview = (review: UserReview) => {
    setSelectedBook({ id: review.book.id, title: review.book.title });
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const handleUpdateUserReview = async (
    _reviewId: number,
    rating: number,
    comment: string
  ) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!selectedBook?.id) {
        throw new Error('No book selected for review update');
      }

      const requestBody = {
        bookId: selectedBook.id,
        star: rating,
        comment: comment,
      };

      const response = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/reviews',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showSuccess(
          'Review Updated',
          'Your review has been updated successfully!'
        );
        setIsReviewModalOpen(false);
        setSelectedBook(null);
        setEditingReview(null);
        // Trigger refresh of reviews
        setReviewsRefreshTrigger((prev) => prev + 1);
      } else {
        throw new Error(data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      showError(
        'Update Failed',
        error instanceof Error
          ? error.message
          : 'Failed to update review. Please try again.'
      );
      throw error;
    }
  };

  const handleDeleteUserReview = async (reviewId: number) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(
        `https://belibraryformentee-production.up.railway.app/api/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        showSuccess(
          'Review Deleted',
          'Your review has been deleted successfully!'
        );
        // Trigger refresh of reviews
        setReviewsRefreshTrigger((prev) => prev + 1);
      } else {
        const data = await response.json();
        showError('Delete Failed', data.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showError('Delete Failed', 'Failed to delete review. Please try again.');
    }
  };

  const handleUpdateProfile = async (updatedProfile: {
    name?: string;
    email?: string;
    phone?: string;
    profilePicture?: string;
  }): Promise<void> => {
    try {
      const token = localStorage.getItem('auth-token');

      // Separate API-supported fields from profile picture
      const apiPayload: Record<string, string> = {};
      let profilePictureChanged = false;

      // API-supported fields
      if (
        updatedProfile.name !== profile?.name &&
        updatedProfile.name?.trim()
      ) {
        apiPayload.name = updatedProfile.name.trim();
      }
      if (
        updatedProfile.email !== profile?.email &&
        updatedProfile.email?.trim()
      ) {
        apiPayload.email = updatedProfile.email.trim();
      }
      if (
        updatedProfile.phone !== profile?.phone &&
        updatedProfile.phone?.trim()
      ) {
        apiPayload.phone = updatedProfile.phone.trim();
      }

      // Check if profile picture changed (localStorage only)
      if (updatedProfile.profilePicture !== profile?.profilePicture) {
        profilePictureChanged = true;
      }

      // Update API-supported fields if any changed
      if (Object.keys(apiPayload).length > 0) {
        const response = await fetch(
          'https://belibraryformentee-production.up.railway.app/api/me',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(apiPayload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error('API Error Response:', data);
          throw new Error(
            data.message ||
              `Failed to update profile (Status: ${response.status})`
          );
        }
      }

      // Update local state with all changes (including profile picture)
      setProfile((prev) => ({
        ...prev!,
        ...updatedProfile,
      }));

      // Update localStorage with all changes (including profile picture)
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...updatedProfile };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Save profile picture separately in localStorage for persistence
      if (profilePictureChanged) {
        localStorage.setItem(
          'userProfilePicture',
          updatedProfile.profilePicture || ''
        );
      }

      // Trigger navbar update by dispatching a custom event
      window.dispatchEvent(
        new CustomEvent('profileUpdated', {
          detail: updatedProfile,
        })
      );

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error; // Re-throw to be handled by the ProfileCard
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-pulse space-y-8'>
          <div className='bg-gray-300 h-12 rounded w-96'></div>
          <div className='bg-gray-300 h-64 rounded w-96'></div>
        </div>
      </div>
    );
  }

  const renderProfileContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className='flex flex-col items-start p-0 gap-4 md:gap-6 w-full md:w-[557px] h-auto md:h-[360px]'>
            {/* Profile Title */}
            <h2
              className='w-full md:w-[557px] h-9 md:h-[38px] font-bold text-2xl md:text-[28px] leading-9 md:leading-[38px] tracking-[-0.03em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Profile
            </h2>

            {/* Profile Card Component */}
            <ProfileCard
              profile={{
                name: profile?.name,
                email: profile?.email,
                phone: profile?.phone || '081234567890',
                profilePicture: profile?.profilePicture,
              }}
              onSave={handleUpdateProfile}
            />
          </div>
        );
      case 'borrowed':
        return (
          <div className='flex flex-col items-start p-0 gap-4 md:gap-6 w-full max-w-[361px] md:max-w-[1000px] mx-auto md:mx-0 min-h-[1160px]'>
            {/* Borrowed List Title */}
            <h2
              className='w-full md:w-[1000px] h-9 md:h-[38px] font-bold text-2xl md:text-[28px] leading-9 md:leading-[38px] tracking-[-0.03em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Borrowed List
            </h2>

            {/* Search Bar */}
            <div className='flex flex-row items-center px-4 py-2 gap-1.5 w-full md:w-[544px] h-11 bg-white border border-[#D5D7DA] rounded-full'>
              <Search className='w-4 h-4 md:w-5 md:h-5 text-[#535862]' />
              <input
                type='text'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1 h-6 md:h-7 font-medium text-xs md:text-sm leading-6 md:leading-7 tracking-[-0.03em] text-[#535862] bg-transparent border-none outline-none'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              />
            </div>

            {/* Filter Tags */}
            <div className='flex flex-row items-center p-0 gap-2 md:gap-3 w-full md:w-[361px] h-10'>
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex flex-row justify-center items-center px-3 md:px-4 py-1.5 md:py-2 gap-2 w-[51px] h-8 md:h-10 rounded-full ${
                  statusFilter === 'all'
                    ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                    : 'border border-[#D5D7DA]'
                }`}
              >
                <span
                  className={`font-bold text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.02em] ${
                    statusFilter === 'all' ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  All
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('BORROWED')}
                className={`flex flex-row justify-center items-center px-3 md:px-4 py-1.5 md:py-2 gap-2 w-[72px] md:w-[77px] h-8 md:h-10 rounded-full ${
                  statusFilter === 'BORROWED'
                    ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                    : 'border border-[#D5D7DA]'
                }`}
              >
                <span
                  className={`font-semibold md:font-bold text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.02em] ${
                    statusFilter === 'BORROWED'
                      ? 'text-[#1C65DA]'
                      : 'text-[#0A0D12]'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Active
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('RETURNED')}
                className={`flex flex-row justify-center items-center px-3 md:px-4 py-1.5 md:py-2 gap-2 w-[88px] md:w-[96px] h-8 md:h-10 rounded-full ${
                  statusFilter === 'RETURNED'
                    ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                    : 'border border-[#D5D7DA]'
                }`}
              >
                <span
                  className={`font-semibold md:font-bold text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.02em] ${
                    statusFilter === 'RETURNED'
                      ? 'text-[#1C65DA]'
                      : 'text-[#0A0D12]'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Returned
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('LATE')}
                className={`flex flex-row justify-center items-center px-3 md:px-4 py-1.5 md:py-2 gap-2 w-[93px] md:w-[101px] h-8 md:h-10 rounded-full ${
                  statusFilter === 'LATE'
                    ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                    : 'border border-[#D5D7DA]'
                }`}
              >
                <span
                  className={`font-semibold md:font-bold text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.02em] ${
                    statusFilter === 'LATE'
                      ? 'text-[#1C65DA]'
                      : 'text-[#0A0D12]'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Overdue
                </span>
              </button>
            </div>

            {/* Borrowed Books List */}
            <div className='flex flex-col items-start p-0 gap-4 w-full md:w-[1000px]'>
              <BorrowedListCard
                layout='full'
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                onGiveReview={handleGiveReview}
                reviews={reviews.map((review) => ({
                  id: review.id,
                  userId: profile?.id || 0,
                  bookId: review.book.id,
                  star: review.star,
                  comment: review.comment,
                  createdAt: review.createdAt,
                }))}
                currentUserId={profile?.id}
                key={reviewsRefreshTrigger}
              />
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className='flex flex-col items-start p-0 gap-4 md:gap-6 w-full max-w-[361px] md:max-w-[1000px] mx-auto md:mx-0 min-h-[1251px]'>
            {/* Reviews Title */}
            <h2
              className='w-full md:w-[1000px] h-9 md:h-[38px] font-bold text-2xl md:text-[28px] leading-9 md:leading-[38px] tracking-[-0.03em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Reviews
            </h2>

            {/* Search Bar */}
            <div className='flex flex-row items-center px-4 py-2 gap-1.5 w-full md:w-[544px] h-11 bg-white border border-[#D5D7DA] rounded-full'>
              <Search className='w-4 h-4 md:w-5 md:h-5 text-[#535862]' />
              <input
                type='text'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1 h-6 md:h-7 font-medium text-xs md:text-sm leading-6 md:leading-7 tracking-[-0.03em] text-[#535862] bg-transparent border-none outline-none'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              />
            </div>

            {/* Reviews List */}
            <div className='flex flex-col items-start p-0 gap-4 w-full md:w-[1000px]'>
              <UserReviewsCard
                onEditReview={handleEditUserReview}
                onDeleteReview={handleDeleteUserReview}
                refreshTrigger={reviewsRefreshTrigger}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Main Content */}
      <div className='flex-1 pt-8 pb-16'>
        {/* Main Container - Frame 1618873981 */}
        <div
          className={`flex flex-col items-start px-4 md:p-0 gap-4 md:gap-6 ml-0 md:ml-[220px] w-full max-w-[calc(120vw-32px)] md:max-w-[1000px] mx-auto md:mx-0 ${
            activeTab === 'borrowed' ? 'md:w-[1000px]' : 'md:w-[557px]'
          }`}
        >
          {/* Tab Container */}
          <div className='flex flex-row items-center p-2 gap-2 h-14 bg-[#F5F5F5] rounded-2xl w-full md:w-[557px]'>
            {/* Profile Tab */}
            <button
              onClick={() => handleTabChange('profile')}
              className={`flex flex-row justify-center items-center px-3 py-2 gap-2 flex-1 md:w-[175px] h-10 rounded-xl ${
                activeTab === 'profile'
                  ? 'bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'
                  : ''
              }`}
            >
              <span
                className={`font-${
                  activeTab === 'profile' ? 'bold' : 'medium'
                } text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.02em] ${
                  activeTab === 'profile' ? 'text-[#0A0D12]' : 'text-[#535862]'
                }`}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Profile
              </span>
            </button>

            {/* Borrowed List Tab */}
            <button
              onClick={() => handleTabChange('borrowed')}
              className={`flex flex-row justify-center items-center px-3 py-2 gap-2 flex-1 md:w-[175px] h-10 rounded-xl ${
                activeTab === 'borrowed'
                  ? 'bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'
                  : ''
              }`}
            >
              <span
                className={`font-${
                  activeTab === 'borrowed' ? 'bold' : 'medium'
                } text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.03em] ${
                  activeTab === 'borrowed' ? 'text-[#0A0D12]' : 'text-[#535862]'
                }`}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Borrowed List
              </span>
            </button>

            {/* Reviews Tab */}
            <button
              onClick={() => handleTabChange('reviews')}
              className={`flex flex-row justify-center items-center px-3 py-2 gap-2 flex-1 md:w-[175px] h-10 rounded-xl ${
                activeTab === 'reviews'
                  ? 'bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'
                  : ''
              }`}
            >
              <span
                className={`font-${
                  activeTab === 'reviews' ? 'bold' : 'medium'
                } text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.03em] ${
                  activeTab === 'reviews' ? 'text-[#0A0D12]' : 'text-[#535862]'
                }`}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Reviews
              </span>
            </button>
          </div>

          {/* Tab Content */}
          {renderProfileContent()}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Review Modal - Rendered at root level for proper z-index */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedBook(null);
          setEditingReview(null);
        }}
        bookTitle={selectedBook?.title || ''}
        onSubmit={handleSubmitReview}
        editingReview={
          editingReview
            ? {
                id: editingReview.id,
                star: editingReview.star,
                comment: editingReview.comment,
                userId: profile?.id || 0,
                bookId: editingReview.book.id,
                createdAt: editingReview.createdAt,
                updatedAt: editingReview.createdAt,
                user: {
                  id: profile?.id || 0,
                  name: profile?.name || '',
                  email: profile?.email || '',
                },
              }
            : null
        }
        onUpdate={handleUpdateUserReview}
      />
    </div>
  );
};
