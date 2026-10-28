import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileNavigation from '../components/MobileNavigation';
import Toast from '../components/Toast';

export default function RiderLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0c1033] text-white selection:bg-[#D4FF00] selection:text-[#08071E] overflow-x-clip relative">
      {/* Background Blueish Ambient Mesh & Dot Pattern */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(1100px 650px at 85% 0%, rgba(59, 56, 245, 0.28), transparent 60%), radial-gradient(900px 700px at 5% 50%, rgba(42, 31, 210, 0.22), transparent 60%), radial-gradient(800px 500px at 50% 100%, rgba(71, 54, 250, 0.16), transparent 70%), linear-gradient(180deg, #0d1238 0%, #0a0e2f 50%, #080b26 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(165, 185, 255, 0.45) 1.5px, transparent 1.5px)',
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
