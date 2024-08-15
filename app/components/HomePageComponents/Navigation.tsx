'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className="flex">
      <Link href="/home/templates" passHref className={`box-content px-6 py-4 hover:border-b hover:border-black ${pathname === '/templates' && 'border-b border-black'}`}>
        创作模版
      </Link>
      <Link href="/home/my-works" passHref className={`box-content px-6 py-4 hover:border-b hover:border-black ${pathname === '/my-works' && 'border-b border-black'}`}>
        我的作品
      </Link>
    </nav>
  );
};

export default Navigation;
