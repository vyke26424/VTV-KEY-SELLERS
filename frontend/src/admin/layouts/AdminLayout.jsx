import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import useAuthStore from '../../store/useAuthStore'; // Import store của bạn

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // --- BẢO VỆ ROUTE ADMIN ---
  useEffect(() => {
    // Nếu chưa login hoặc không phải ADMIN -> Đá về trang chủ
    if (!isAuthenticated || user?.role !== 'ADMIN') {
        // Tạm thời comment dòng này để bạn test UI, sau này mở ra nhé!
        // navigate('/'); 
        // alert("Bạn không có quyền truy cập Admin!");
    }
  }, [isAuthenticated, user, navigate]);

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