import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, X } from 'lucide-react';
import { useAppSelector } from '../../store';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Get cart items count from Redux store
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.length;

  // Load profile picture from localStorage and listen for updates
  useEffect(() => {
    // Load initial profile picture
    const savedProfilePicture = localStorage.getItem('userProfilePicture');

    if (savedProfilePicture && savedProfilePicture.trim() !== '') {
      setProfilePicture(savedProfilePicture);
    } else {
      setProfilePicture(null);
    }

    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Navbar received profile update:', event.detail);
      if (
        event.detail.profilePicture &&
        event.detail.profilePicture.trim() !== ''
      ) {
        setProfilePicture(event.detail.profilePicture);
      } else if (event.detail.profilePicture === '') {
        setProfilePicture(null);
      }
    };

    window.addEventListener(
      'profileUpdated',
      handleProfileUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        'profileUpdated',
        handleProfileUpdate as EventListener
      );
    };
  }, []);

  // Handle profile picture error
  const handleImageError = () => {
    console.error('Profile image failed to load, falling back to initials');
    setProfilePicture(null);
    // Also clear from localStorage if it's corrupted
    localStorage.removeItem('userProfilePicture');
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          // Check if we're on pages that support real-time search
          const supportsRealTimeSearch =
            location.pathname === '/' || // HomePage
            location.pathname === '/category'; // CategoryPage (with or without filters)

          if (supportsRealTimeSearch) {
            if (location.pathname === '/category') {
              // On category page - update URL with search parameter for local filtering
              // Preserve existing URL parameters (like category filter)
              const currentUrl = new URL(window.location.href);
              if (query.trim()) {
                currentUrl.searchParams.set('search', query.trim());
              } else {
                currentUrl.searchParams.delete('search');
              }
              window.history.replaceState(null, '', currentUrl.toString());
            } else {
              // On homepage - redirect to homepage with search
              if (query.trim()) {
                const newUrl = `/?search=${encodeURIComponent(query.trim())}`;
                window.history.replaceState(null, '', newUrl);
              } else {
                window.history.replaceState(null, '', '/');
              }
            }

            // Trigger a custom event to notify components of URL change
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
          // On other pages - do nothing for real-time search (only handle on Enter)
        }, 300); // 300ms delay
      };
    })(),
    [location.pathname]
  );

  // Sync search input with URL search parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearchQuery = urlParams.get('search') || '';
    setSearchQuery(urlSearchQuery);
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    // Don't redirect, just refresh to show logged out state
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we're on pages that support real-time search
    const supportsRealTimeSearch =
      location.pathname === '/' || // HomePage
      location.pathname === '/category'; // CategoryPage (with or without filters)

    if (supportsRealTimeSearch) {
      // On pages with real-time search - handle as before
      if (location.pathname === '/category') {
        // On category page - update URL with search parameter for local filtering
        // Preserve existing URL parameters (like category filter)
        const currentUrl = new URL(window.location.href);
        if (searchQuery.trim()) {
          currentUrl.searchParams.set('search', searchQuery.trim());
        } else {
          currentUrl.searchParams.delete('search');
        }
        window.history.replaceState(null, '', currentUrl.toString());
      } else {
        // On homepage - redirect to homepage with search
        if (searchQuery.trim()) {
          const newUrl = `/?search=${encodeURIComponent(searchQuery.trim())}`;
          window.history.replaceState(null, '', newUrl);
        } else {
          window.history.replaceState(null, '', '/');
        }
      }

      // Trigger a custom event to notify components of URL change
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // On other pages - navigate to category page with search on Enter
      if (searchQuery.trim()) {
        navigate(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Only trigger real-time search on supported pages
    const supportsRealTimeSearch =
      location.pathname === '/' || // HomePage
      location.pathname === '/category'; // CategoryPage (with or without filters)

    if (supportsRealTimeSearch) {
      debouncedSearch(value);
    }
    // On other pages - do nothing, only handle on Enter
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Navigate to category page with search query
        navigate(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery(''); // Clear search after navigation
        setIsMobileSearchOpen(false); // Close mobile search
      }
    }
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
    setSearchQuery(''); // Clear search when closing
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <>
      <header className='fixed top-0 left-0 right-0 h-16 lg:h-20 bg-white z-50 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'>
        <div className='flex items-center justify-between px-4 lg:px-[120px] h-full max-w-[1440px] mx-auto'>
          {/* Logo Section - Responsive */}
          <Link
            to='/'
            className='flex items-center gap-[15px] lg:w-[155px] h-[42px] md:h-[40px] flex-shrink-0'
          >
            {/* Logo - Responsive sizing */}
            <div className='w-[42px] h-[42px] md:w-[40px] md:h-[40px] flex-shrink-0'>
              <img
                src='/logos/main-logo.svg'
                alt='Logo'
                className='w-full h-full'
              />
            </div>

            {/* Booky Text - Hidden on mobile, shown on desktop */}
            <span
              className='hidden lg:block w-[98px] h-[42px] font-bold text-[32px] leading-[42px] text-[#0A0D12] flex-shrink-0'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Booky
            </span>
          </Link>

          {isAuthenticated ? (
            // Authenticated User Layout
            <>
              {/* Desktop Search Large */}
              <form
                onSubmit={handleSearch}
                className='hidden lg:flex items-center gap-[6px] px-4 py-2 w-[500px] h-[44px] bg-white border border-[#D5D7DA] rounded-full'
              >
                {/* Search Icon - Clickable */}
                <button
                  type='submit'
                  className='w-5 h-5 flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity'
                >
                  <Search size={20} color='#535862' strokeWidth={1.25} />
                </button>

                {/* Search Input */}
                <input
                  type='text'
                  placeholder='Search books, authors, categories...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                  className='flex-1 h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#535862] bg-transparent border-none outline-none placeholder-[#535862]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                />
              </form>

              {/* Mobile Authenticated Layout */}
              <div className='flex lg:hidden items-center gap-4 h-7 mr-2'>
                {/* Mobile Search - Expandable */}
                {!isMobileSearchOpen ? (
                  <button
                    onClick={() => setIsMobileSearchOpen(true)}
                    className='w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity'
                  >
                    <Search size={24} color='#0A0D12' strokeWidth={2} />
                  </button>
                ) : (
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2 w-[265px] h-10 px-3 py-2 bg-white border border-[#D5D7DA] rounded-full'>
                      <Search size={20} color='#535862' strokeWidth={1.25} />
                      <input
                        type='text'
                        placeholder='Search'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        className='flex-1 h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#535862] bg-transparent border-none outline-none placeholder-[#535862]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      />
                    </div>
                    <button
                      onClick={handleMobileSearchClose}
                      className='w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity'
                    >
                      <X size={20} color='#0A0D12' strokeWidth={2} />
                    </button>
                  </div>
                )}

                {/* Shopping Bag with Notification - Hide when search is open */}
                {!isMobileSearchOpen && (
                  <button
                    onClick={handleCartClick}
                    className='relative w-8 h-8 flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center'
                  >
                    <img
                      src='/logos/shoppingbag-logo.svg'
                      alt='Shopping Bag'
                      className='w-6 h-6'
                    />
                    {/* Notification Badge - Frame 92 - Only show if cart has items */}
                    {cartItemsCount > 0 && (
                      <div className='absolute -top-1 -right-1 w-5 h-5 bg-[#EE1D52] rounded-full flex items-center justify-center'>
                        <span
                          className='font-bold text-xs leading-[23px] tracking-[-0.02em] text-white'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          {cartItemsCount > 9 ? '9+' : cartItemsCount}
                        </span>
                      </div>
                    )}
                  </button>
                )}

                {/* Mobile User Avatar - Hide when search is open */}
                {!isMobileSearchOpen && (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center hover:opacity-70 transition-opacity overflow-hidden'
                  >
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt={user?.name}
                        className='w-full h-full object-cover'
                        onError={handleImageError}
                      />
                    ) : (
                      <span
                        className='font-semibold text-lg text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Desktop Right Section */}
              <div className='hidden lg:flex items-center gap-6 w-[240px] h-12'>
                {/* Shopping Bag with Notification */}
                <button
                  onClick={handleCartClick}
                  className='relative w-8 h-8 flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center'
                >
                  <img
                    src='/logos/shoppingbag-logo.svg'
                    alt='Shopping Bag'
                    className='w-6 h-6'
                  />
                  {/* Notification Badge - Frame 92 - Only show if cart has items */}
                  {cartItemsCount > 0 && (
                    <div className='absolute -top-1 -right-1 w-5 h-5 bg-[#EE1D52] rounded-full flex items-center justify-center'>
                      <span
                        className='font-bold text-xs leading-[23px] tracking-[-0.02em] text-white'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {cartItemsCount > 9 ? '9+' : cartItemsCount}
                      </span>
                    </div>
                  )}
                </button>

                {/* Frame 36 - User Section */}
                <div className='flex items-center gap-4 w-[184px] h-12'>
                  {/* User Avatar - Ellipse 3 */}
                  <div className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt={user?.name}
                        className='w-full h-full object-cover'
                        onError={handleImageError}
                      />
                    ) : (
                      <span
                        className='font-semibold text-lg text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || 'J'}
                      </span>
                    )}
                  </div>

                  {/* User Name */}
                  <span
                    className='w-20 h-8 font-semibold text-lg leading-8 tracking-[-0.02em] text-[#0A0D12] flex-shrink-0'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {user?.name || 'John Doe'}
                  </span>

                  {/* Chevron Down */}
                  <div className='relative'>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className='w-6 h-6 flex-shrink-0 flex items-center justify-center'
                    >
                      <ChevronDown size={24} color='#0A0D12' strokeWidth={2} />
                    </button>

                    {/* Desktop Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className='absolute top-8 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10'>
                        <Link
                          to='/profile?tab=profile'
                          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to='/profile?tab=borrowed'
                          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Borrowed List
                        </Link>
                        <Link
                          to='/profile?tab=reviews'
                          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Reviews
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Unauthenticated User Layout - Responsive
            <>
              {/* Desktop Layout - Frame 88 */}
              <div className='hidden lg:flex items-center justify-end gap-4 w-[688.5px] h-12'>
                {/* Login Button */}
                <Link to='/login'>
                  <Button
                    variant='figma-outline'
                    size='figma'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Login
                  </Button>
                </Link>

                {/* Register Button */}
                <Link to='/register'>
                  <Button
                    variant='figma-primary'
                    size='figma'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Register
                  </Button>
                </Link>
              </div>

              {/* Mobile Layout - Frame 38 */}
              <div className='flex lg:hidden items-center gap-4 h-7 mr-2'>
                {/* Mobile Search - Expandable */}
                {!isMobileSearchOpen ? (
                  <button
                    onClick={() => setIsMobileSearchOpen(true)}
                    className='w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity'
                  >
                    <Search size={24} color='#0A0D12' strokeWidth={2} />
                  </button>
                ) : (
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2 w-[265px] h-10 px-3 py-2 bg-white border border-[#D5D7DA] rounded-full'>
                      <Search size={20} color='#535862' strokeWidth={1.25} />
                      <input
                        type='text'
                        placeholder='Search'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        className='flex-1 h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#535862] bg-transparent border-none outline-none placeholder-[#535862]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      />
                    </div>
                    <button
                      onClick={handleMobileSearchClose}
                      className='w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity'
                    >
                      <X size={20} color='#0A0D12' strokeWidth={2} />
                    </button>
                  </div>
                )}

                {/* Shopping Bag with Notification - Hide when search is open */}
                {!isMobileSearchOpen && (
                  <button
                    onClick={handleCartClick}
                    className='relative w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity'
                  >
                    <img
                      src='/logos/shoppingbag-logo.svg'
                      alt='Shopping Bag'
                      className='w-6 h-6'
                    />

                    {/* Notification Badge - Frame 92 - Only show if cart has items */}
                    {cartItemsCount > 0 && (
                      <div className='absolute -top-1 -right-1 w-5 h-5 bg-[#EE1D52] rounded-full flex items-center justify-center'>
                        <span
                          className='font-bold text-xs leading-[23px] tracking-[-0.02em] text-white'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          {cartItemsCount > 9 ? '9+' : cartItemsCount}
                        </span>
                      </div>
                    )}
                  </button>
                )}

                {/* Mobile User Avatar */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center hover:opacity-70 transition-opacity overflow-hidden'
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={user?.name}
                      className='w-full h-full object-cover'
                      onError={handleImageError}
                    />
                  ) : (
                    <span
                      className='font-semibold text-lg text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile Authenticated User Dropdown - Figma Design */}
      {isAuthenticated && isDropdownOpen && (
        <div className='lg:hidden fixed top-16 left-1/2 transform -translate-x-1/2 w-[361px] h-[200px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl z-40'>
          <div className='flex flex-col items-start p-4 gap-4'>
            {/* Profile */}
            <Link
              to='/profile?tab=profile'
              className='w-[329px] h-[30px] font-semibold text-sm leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:opacity-70 transition-opacity'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
              onClick={() => setIsDropdownOpen(false)}
            >
              Profile
            </Link>

            {/* Borrowed List */}
            <Link
              to='/profile?tab=borrowed'
              className='w-[329px] h-[30px] font-semibold text-sm leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:opacity-70 transition-opacity'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
              onClick={() => setIsDropdownOpen(false)}
            >
              Borrowed List
            </Link>

            {/* Reviews */}
            <Link
              to='/profile?tab=reviews'
              className='w-[329px] h-[30px] font-semibold text-sm leading-[30px] tracking-[-0.02em] text-[#0A0D12] hover:opacity-70 transition-opacity'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
              onClick={() => setIsDropdownOpen(false)}
            >
              Reviews
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                handleLogout();
                setIsDropdownOpen(false);
              }}
              className='w-[329px] h-[30px] font-semibold text-sm leading-[30px] tracking-[-0.02em] text-[#EE1D52] text-left hover:opacity-70 transition-opacity'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Unauthenticated Dropdown */}
      {!isAuthenticated && isDropdownOpen && (
        <div className='lg:hidden fixed top-16 left-0 right-0 w-full h-[72px] bg-white border-t border-gray-100 z-40'>
          <div className='flex items-center justify-center p-4 gap-4 h-full'>
            <Link to='/login' onClick={() => setIsDropdownOpen(false)}>
              <Button
                variant='figma-outline'
                size='figma'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Login
              </Button>
            </Link>
            <Link to='/register' onClick={() => setIsDropdownOpen(false)}>
              <Button
                variant='figma-primary'
                size='figma'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
