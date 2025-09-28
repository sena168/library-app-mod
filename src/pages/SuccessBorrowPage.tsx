import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export const SuccessBorrowPage: React.FC = () => {
  const navigate = useNavigate();

  // Get return date from localStorage or use default
  const getReturnDate = () => {
    // You can pass this via state or localStorage from checkout page
    const today = new Date();
    today.setDate(today.getDate() + 3); // Default 3 days
    const day = today.getDate();
    const month = today.toLocaleString('en-US', { month: 'long' });
    const year = today.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleGoToLoans = () => {
    navigate('/profile?tab=borrowed');
  };

  return (
    <>
      <div className='min-h-screen bg-gray-50 flex flex-col p-4 md:p-8'>
        {/* Main Content */}
        <div className='flex-1 flex items-center justify-center'>
          {/* Success Container - Frame 1618873980 */}
          <motion.div
            className='flex flex-col items-center p-0 gap-6 md:gap-8 w-full max-w-[345px] md:max-w-[638px] h-auto md:h-[332.38px]'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Success Icon - Frame 1618873979 */}
            <div className='relative flex flex-row items-center justify-center p-[6.34px] gap-[6.34px] w-[142.38px] h-[142.38px] border border-[#E9EAEB] rounded-[79.26px]'>
              {/* Enhanced Ripple Effects */}
              {/* First Ripple Wave */}
              <motion.div
                className='absolute w-[142.38px] h-[142.38px] border-2 border-[#1C65DA] rounded-full'
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: [0.6, 1.4],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.5,
                }}
              />

              {/* Second Ripple Wave */}
              <motion.div
                className='absolute w-[142.38px] h-[142.38px] border-2 border-[#1C65DA] rounded-full'
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: [0.6, 1.6],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 1,
                }}
              />

              {/* Third Ripple Wave */}
              <motion.div
                className='absolute w-[142.38px] h-[142.38px] border border-[#1C65DA] rounded-full'
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: [0.6, 1.8],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 1.5,
                }}
              />

              {/* Subtle Background Pulse */}
              <motion.div
                className='absolute w-[160px] h-[160px] bg-[#1C65DA] rounded-full opacity-5'
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.2,
                }}
              />

              {/* Inner Circle - Frame 1618873978 */}
              <motion.div
                className='flex flex-row items-center justify-center p-[6.34px] gap-[6.34px] w-[129.69px] h-[129.69px] border border-[#E9EAEB] rounded-[792.62px]'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              >
                {/* Check Container - Frame 1618873977 */}
                <motion.div
                  className='flex flex-row items-center justify-center p-0 gap-[6.34px] w-[117.01px] h-[117.01px] border border-[#E9EAEB] rounded-[79.26px]'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                >
                  {/* Check Icon with Blue Background */}
                  <motion.div
                    className='w-[80.64px] h-[80.64px] bg-[#1C65DA] rounded-full flex items-center justify-center'
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                  >
                    <motion.svg
                      className='w-7 h-7 text-white'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={3}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <motion.path
                        d='M4 12L9 17L20 6'
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.8,
                          delay: 1.2,
                          ease: 'easeInOut',
                        }}
                      />
                    </motion.svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Success Message - Frame 129 */}
            <div className='flex flex-col items-center justify-center p-0 gap-2 w-full max-w-[345px] md:max-w-[638px] h-auto md:min-h-[78px]'>
              {/* Title */}
              <motion.h1
                className='w-full h-[34px] md:h-auto font-bold text-xl md:text-[28px] leading-[34px] md:leading-[38px] text-center tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
              >
                Borrowing Successful!
              </motion.h1>

              {/* Description */}
              <motion.p
                className='w-full h-[64px] md:h-auto font-semibold text-base leading-[32px] text-center tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4, ease: 'easeOut' }}
              >
                Your book has been successfully borrowed. Please return it by{' '}
                <motion.span
                  className='text-red-600 font-bold'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.8, ease: 'easeOut' }}
                >
                  {getReturnDate()}
                </motion.span>
              </motion.p>
            </div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2, ease: 'easeOut' }}
            >
              <Button
                variant='figma-primary'
                size='figma'
                onClick={handleGoToLoans}
                className='w-[286px] h-12 !rounded-full font-bold text-base leading-[30px] tracking-[-0.02em]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                <span className='font-bold text-base leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'>
                  See Borrowed List
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
