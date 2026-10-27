import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileNavigation from '../components/MobileNavigation';
import Toast from '../components/Toast';

export default function DriverLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08071E] text-white selection:bg-[#D4FF00] selection:text-[#08071E] overflow-x-clip">
      {/* Background Dot Pattern */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex w-full relative z-10">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Global Toast */}
      <Toast />
    </div>
  );
}
