import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import GlobalStats from './GlobalStats';
import { Outlet, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCookie } from '../../utils/getCookie';
import LogoutButton from '../../features/auth/components/LogoutButton';
import { isLoggedIn } from '../../utils/isLoggedIn';


export default function MainLayoutMobile() {
  const userId = getCookie('user_id');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    Cookies.remove('user_id');
    window.location.reload();
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative">
      {/* top right login */}
      {!sidebarOpen && (
        <div className="absolute top-8 right-10 z-50 mb-10">
          {isLoggedIn() ? (
            <LogoutButton userId={userId} onLogout={handleLogout} />
          ) : (
            <Link to="/login" className="text-base font-medium text-gray-700 hover:underline">Login/SignUp</Link>
          )}
        </div>
      )}

      {/* hamburger toggle button */}
      {!sidebarOpen && (
        <div className="sm:hidden absolute top-5 left-5 z-50">
          <button onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}

      {/* background overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* layout content */}
      <div className="flex w-full bg-gray-100 min-h-screen">
        <div
          className={`
            fixed z-50 top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 min-h-screen bg-gray-100 px-2 py-4 mt-16 max-w-[95%] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}