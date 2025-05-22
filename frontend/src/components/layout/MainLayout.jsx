import React from 'react';
import Sidebar from './Sidebar';
import GlobalStats from './GlobalStats';
import { Outlet, Link } from 'react-router-dom';


export default function MainLayout() {
  return (
    <div className="relative">
      {/* top right login */}
      <div className="absolute top-8 right-10 z-50 mb-10">
        <Link to="/login" className="text-base font-medium text-gray-700 hover:underline">Login/SignUp</Link>
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