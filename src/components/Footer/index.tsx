// src/components/Footer/index.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname() || '/'; // Default to '/' if pathname is null
  const [activePath, setActivePath] = useState<string>(pathname);

  const handleClick = (path: string) => {
    setActivePath(path);
  };

  return (
    <footer className="bg-white custom-shadow text-white py-4">
      <div className="container mx-auto flex justify-center space-x-4">
        <Link
          href="/"
          onClick={() => handleClick('/')}
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-md transition-transform transform ${
            activePath === '/' ? 'bg-blue-500 scale-105' : 'bg-gray-700 scale-100'
          }`}
        >
          <i className="fas fa-map-marker-alt text-2xl mb-1"></i>
          <span className="text-sm">نقشه</span>
        </Link>
        <Link
          href="/favorite"
          onClick={() => handleClick('/favorite')}
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-md transition ease-in-out duration-300 ${
            activePath === '/favorite' ? 'bg-blue-500 scale-up button-active' : 'bg-gray-700 scale-down button-inactive'
          }`}
        >
          <i className="fas fa-star text-2xl mb-1"></i>
          <span className="text-sm">علاقه‌مندی‌ها</span>
        </Link>
        <Link
          href="/reserve"
          onClick={() => handleClick('/reserve')}
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-md transition-transform transform ${
            activePath === '/reserve' ? 'bg-blue-500 scale-105' : 'bg-gray-700 scale-100'
          }`}
        >
          <i className="fas fa-calendar-check text-2xl mb-1"></i>
          <span className="text-sm">رزرو</span>
        </Link>
        <Link
          href="/profile"
          onClick={() => handleClick('/profile')}
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-md transition-transform transform ${
            activePath === '/profile' ? 'bg-blue-500 scale-105' : 'bg-gray-700 scale-100'
          }`}
        >
          <i className="fas fa-user text-2xl mb-1"></i>
          <span className="text-sm">پروفایل</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
