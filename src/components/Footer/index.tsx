'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname() || '/';
  const [activePath, setActivePath] = useState<string>(pathname);
  const [clickedButton, setClickedButton] = useState<string | null>(pathname);

  const router = useRouter();

  const handleClick = (path: string) => {
    setClickedButton(path);
    setActivePath(path);
    
    // Navigate to the path immediately
    if (path !== pathname) {
      router.push(path);
    }
  };

  return (
    <footer className="bg-white custom-shadow text-white py-4 fixed bottom-0 left-0 right-0">
      <div className="container mx-auto flex justify-center space-x-4 p-1">
        {/* Map Button */}
        <button
          onClick={() => handleClick('/')}
          className={`relative flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 rounded-md transition-all duration-300 ease-in-out ${
            activePath === '/' && clickedButton === '/'
              ? 'bg-blue-500 translate-y-[-16px] scale-110'
              : 'bg-gray-700 translate-y-0 scale-100'
          }`}
          style={{
            position: 'relative',
            top: clickedButton === '/' ? '-16px' : '0px',
            transition: 'top 0.3s ease, transform 0.3s ease',
          }}
        >
          <i className="fas fa-map-marker-alt text-2xl mb-1"></i>
          <span className="text-sm">نقشه</span>
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => handleClick('/favorite')}
          className={`relative flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 rounded-md transition-all duration-300 ease-in-out ${
            activePath === '/favorite' && clickedButton === '/favorite'
              ? 'bg-blue-500 translate-y-[-16px] scale-110'
              : 'bg-gray-700 translate-y-0 scale-100'
          }`}
          style={{
            position: 'relative',
            top: clickedButton === '/favorite' ? '-16px' : '0px',
            transition: 'top 0.3s ease, transform 0.3s ease',
          }}
        >
          <i className="fas fa-star text-2xl mb-1"></i>
          <span className="text-sm">علاقه‌مندی‌ها</span>
        </button>

        {/* Reserve Button */}
        <button
          onClick={() => handleClick('/reserve')}
          className={`relative flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 rounded-md transition-all duration-300 ease-in-out ${
            activePath === '/reserve' && clickedButton === '/reserve'
              ? 'bg-blue-500 translate-y-[-16px] scale-110'
              : 'bg-gray-700 translate-y-0 scale-100'
          }`}
          style={{
            position: 'relative',
            top: clickedButton === '/reserve' ? '-16px' : '0px',
            transition: 'top 0.3s ease, transform 0.3s ease',
          }}
        >
          <i className="fas fa-calendar-check text-2xl mb-1"></i>
          <span className="text-sm">رزرو</span>
        </button>

        {/* Profile Button */}
        <button
          onClick={() => handleClick('/profile')}
          className={`relative flex flex-col items-center justify-center w-20 h-20 md:w-20 md:h-20 rounded-md transition-all duration-300 ease-in-out ${
            activePath === '/profile' && clickedButton === '/profile'
              ? 'bg-blue-500 translate-y-[-16px] scale-110'
              : 'bg-gray-700 translate-y-0 scale-100'
          }`}
          style={{
            position: 'relative',
            top: clickedButton === '/profile' ? '-16px' : '0px',
            transition: 'top 0.3s ease, transform 0.3s ease',
          }}
        >
          <i className="fas fa-user text-2xl mb-1"></i>
          <span className="text-sm">پروفایل</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
