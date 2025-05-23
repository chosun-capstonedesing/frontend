import React, { useState } from 'react';
import Sidebar from './Sidebar';
import GlobalStats from './GlobalStats';
import { Outlet, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCookie } from '../../utils/getCookie';
import LogoutButton from '../../features/auth/components/LogoutButton';
import { isLoggedIn } from '../../utils/isLoggedIn';


export default function MainLayoutPC() {
  const userId = getCookie('user_id');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    Cookies.remove('user_id');
    window.location.reload();
  };

  return (
    <div className="relative">
      {/* top right login */}
      <div className="absolute top-8 right-10 z-50 mb-10">
        {isLoggedIn() ? (
          <LogoutButton userId={userId} onLogout={handleLogout} />
        ) : (
          <Link to="/login" className="text-base font-medium text-gray-700 hover:underline">Login/SignUp</Link>
        )}
      </div>

      {/* layout content */}
      <div className="flex w-full bg-gray-100 min-h-screen">
        <div className="w-64">
          <Sidebar />
        </div>

        <main className="w-[calc(100%-20rem-18rem)] min-h-screen bg-gray-100 px-4 py-4 ml-5 mt-20 mb-20">
          <Outlet />
        </main>

        <div className="w-80 px-4 py-4 mt-20">
          <GlobalStats />
        </div>
      </div>
    </div>
  );
}