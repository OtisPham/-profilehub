import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import Footer from './Footer';

export default function MainLayout() {
  const location = useLocation();
  const isCvBuilder = location.pathname === '/cv-builder';

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#090d16] flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. HeaderBar kính mờ toàn cục */}
      <HeaderBar />

      {/* 2. Khu vực nội dung chính toàn màn hình */}
      <main 
        className={`flex-1 w-full flex flex-col ${
          isCvBuilder 
            ? 'overflow-hidden h-[calc(100vh-4rem)]' 
            : 'min-h-[calc(100vh-4rem)]'
        }`}
      >
        <Outlet />
      </main>

      {/* 3. Chân trang tối giản (ẩn trên studio viết CV để tối ưu không gian) */}
      {!isCvBuilder && <Footer />}
    </div>
  );
}
