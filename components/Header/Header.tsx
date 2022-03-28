import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className='flex items-center justify-between
    space-x-5 p-5 max-w-7xl mx-auto'>
      <div className='flex items-center space-x-5'>
        <div>
          <Link href='/'>
            <img
              className='w-44 object-contain cursor-pointer'
              src='https://links.papareact.com/yvf'
              alt='main_active_blog'
            />
          </Link>
        </div>
        <div className='hidden md:inline-flex items-center space-x-5'>
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className='text-white bg-green-600 px-4 py-1 rounded-full'>Follow</h3>
        </div>
      </div>
      <div className='flex items-center text-green-600 py-1 space-x-5'>
        <h3>Sign in</h3>
        <h3 className='border px-4 border-green-600 rounded-full'>Get started</h3>
      </div>
    </header>
  );
};

export default Header;
