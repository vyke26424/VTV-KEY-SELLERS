// fileName: frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore'; 
import NotFoundPage from '../../pages/NotFoundPage'; 

const ProtectedRoute = ({ requiredRole }) => {
  // Dùng Hook để đảm bảo tính Reactive
  const { user, isAuthenticated } = useAuthStore();

  // 1. Chưa đăng nhập -> Đá về Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Đã đăng nhập nhưng sai quyền (Ví dụ: User thường vào trang Admin)
  // -> Hiển thị trang 404 ngay tại URL đó (Giả vờ như trang không tồn tại)
  if (requiredRole && user.role !== requiredRole) {
    // return <Navigate to="/404" replace />; // <-- Cách cũ: Lộ URL
    return <NotFoundPage />; // "Tàng hình" hoàn hảo
  }

  // 3. Đúng quyền -> Cho phép truy cập
  return <Outlet />;
};

export default ProtectedRoute;