import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  adminName?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminName = 'Admin',
}) => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const mobileLogoutPopupRef = useRef<HTMLDivElement>(null);
  const desktopLogoutPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isMobileClick = mobileLogoutPopupRef.current?.contains(
        event.target as Node
      );
      const isDesktopClick = desktopLogoutPopupRef.current?.contains(
        event.target as Node
      );

      // Only close if neither mobile nor desktop popup contains the click
      if (!isMobileClick && !isDesktopClick) {
        setShowLogoutPopup(false);
      }
    };

    if (showLogoutPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutPopup]);

  const handleLogout = () => {
    console.log('Logout clicked'); // Debug log
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutPopup(false); // Close popup
    navigate('/login');
  };

  return (
    <div className='w-full h-16 bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:h-20'>
      <div className='flex flex-row justify-between items-center px-4 py-0 w-[393px] h-16 mx-auto md:px-[120px] md:py-0 md:w-full md:max-w-[1440px] md:h-20'>
        {/* Logo and Title */}
        <button
          onClick={() => {
            console.log('Logo clicked, navigating to admin'); // Debug log
            navigate('/admin');
          }}
          className='flex flex-row items-center p-0 gap-[15px] w-auto h-[42px] md:gap-[15px] md:h-[42px] hover:opacity-80 transition-opacity'
        >
          {/* Logo */}
          <div className='w-[42px] h-[42px] md:w-[42px] md:h-[42px]'>
            <img
              src='/logos/main-logo.svg'
              alt='Library Logo'
              className='w-full h-full object-contain'
            />
          </div>
          {/* Title - Hidden on mobile */}
          <span
            className='font-bold text-[32px] leading-[42px] tracking-[-0.03em] text-[#0A0D12] md:block hidden'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Booky
          </span>
        </button>

        {/* Admin Info and Logout */}
        <div className='flex flex-row items-center p-0 gap-6 w-auto h-[48px] md:gap-6 md:h-[48px]'>
          {/* Profile Picture and Admin Name - Desktop */}
          <div className='hidden md:flex flex-row items-center p-0 gap-3 w-auto h-[48px]'>
            {/* Profile Picture Circle */}
            <div className='w-[48px] h-[48px] bg-gradient-to-br from-[#1C65DA] to-[#0A4BB5] rounded-full flex items-center justify-center'>
              <span
                className='font-bold text-white text-lg leading-[24px] tracking-[-0.02em]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {adminName.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Admin Name */}
            <span
              className='font-semibold text-[18px] leading-[32px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {adminName}
            </span>
          </div>

          {/* Profile Picture - Mobile (Clickable) */}
          <div className='md:hidden relative' ref={mobileLogoutPopupRef}>
            <button
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
              className='w-[48px] h-[48px] bg-gradient-to-br from-[#1C65DA] to-[#0A4BB5] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity'
            >
              <span
                className='font-bold text-white text-lg leading-[24px] tracking-[-0.02em]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {adminName.charAt(0).toUpperCase()}
              </span>
            </button>

            {/* Logout Popup - Mobile */}
            {showLogoutPopup && (
              <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-[#D5D7DA] rounded-lg shadow-lg z-50'>
                <button
                  onClick={handleLogout}
                  className='flex flex-row items-center p-3 gap-2 w-full hover:bg-gray-50 transition-colors'
                >
                  <LogOut className='w-4 h-4 text-[#EE1D52]' />
                  <span
                    className='font-medium text-sm text-[#EE1D52]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Logout Dropdown - Desktop */}
          <div className='hidden md:block relative' ref={desktopLogoutPopupRef}>
            <button
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
              className='flex flex-row items-center p-0 gap-2 w-[42px] h-[42px] hover:bg-gray-100 rounded-lg transition-colors'
            >
              <ChevronDown className='w-5 h-5 text-[#0A0D12]' />
            </button>

            {/* Logout Popup - Desktop */}
            {showLogoutPopup && (
              <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-[#D5D7DA] rounded-lg shadow-lg z-50'>
                <button
                  onClick={handleLogout}
                  className='flex flex-row items-center p-3 gap-2 w-full hover:bg-gray-50 transition-colors'
                >
                  <LogOut className='w-4 h-4 text-[#EE1D52]' />
                  <span
                    className='font-medium text-sm text-[#EE1D52]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
