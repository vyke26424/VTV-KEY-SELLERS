import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen text-gray-300 font-sans">
      {/* 1. Sidebar bên trái */}
      <AdminSidebar />

      {/* 2. Content Area bên phải */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        {/* Vùng nội dung chính thay đổi theo Route */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
