import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='pt-16 lg:pt-20'>{children}</main>
    </div>
  );
};
