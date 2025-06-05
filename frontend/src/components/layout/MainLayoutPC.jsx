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
      <div className="fixed top-8 right-10 z-50 mb-10">
        {isLoggedIn() ? (
          <LogoutButton userId={userId} onLogout={handleLogout} />
        ) : (
          <Link to="/login" className="text-base font-medium text-gray-700 hover:underline">Login/SignUp</Link>
        )}
      </div>

      {/* white background blur layer */}
      <div className="fixed inset-0 -z-10 backdrop-blur-2xl bg-gray-200"></div>

      {/* layout content */}
      <div className="flex w-full relative min-h-screen">
        <div className="w-64 h-screen z-50 overflow-y-auto bg-white shadow-lg rounded-r-3xl flex-shrink-0 fixed top-0 left-0">
          <Sidebar />
        </div>

        <main className="w-[calc(100%-20rem-18rem)] min-h-screen px-4 py-4 ml-[17.3rem] mt-20 mb-20">
          <Outlet />
        </main>

        <div className="w-80 px-4 py-4 mt-20">
          <GlobalStats />
        </div>
      </div>
    </div>
  );
}