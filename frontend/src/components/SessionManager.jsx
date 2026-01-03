import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../store/axiosClient';

const SessionManager = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // CẤU HÌNH THỜI GIAN (Đơn vị: Milliseconds)
  // Token hết hạn sau 30 phút
  const TIMEOUT_DURATION = 30 * 60 * 1000; //Thời gian hết hạn phiên
  // Hiện thông báo trước khi hết hạn bao lâu? (Ví dụ: trước 2 phút)
  const WARNING_BEFORE = 2 * 60 * 1000;

  const timerRef = useRef(null);
  const logoutTimerRef = useRef(null);

  // Hàm reset lại đồng hồ đếm ngược
  const resetTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    setShowModal(false);

    // 1. Hẹn giờ hiện thông báo
    timerRef.current = setTimeout(() => {
      setShowModal(true);
      setCountdown(WARNING_BEFORE / 1000); // Set số giây đếm ngược hiển thị
    }, TIMEOUT_DURATION - WARNING_BEFORE);

    // 2. Hẹn giờ Logout luôn (nếu user không bấm gì)
    logoutTimerRef.current = setTimeout(() => {
      handleForceLogout();
    }, TIMEOUT_DURATION);
  };

  // Hàm xử lý Logout bắt buộc
  const handleForceLogout = async () => {
    setShowModal(false);
    // Gọi API logout để hủy token trên server
    try {
      await axiosClient.post('/auth/logout');
    } catch (e) {}

    logout(); // Xóa client
    navigate('/login');
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  };

  // Hàm xử lý Gia hạn (Khi user bấm nút YES)
  const handleExtendSession = async () => {
    try {
      // Gọi API refresh để lấy token mới từ Server
      // axiosClient sẽ tự động cập nhật token mới vào Store nhờ code cũ ta đã viết
      await axiosClient.post('/auth/refresh');

      // Reset lại đồng hồ đếm từ đầu
      resetTimers();
    } catch (error) {
      console.error('Gia hạn thất bại:', error);
      handleForceLogout();
    }
  };

  // Effect: Chạy khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    if (isAuthenticated) {
      resetTimers();
    } else {
      // Nếu chưa đăng nhập thì xóa hết timer
      if (timerRef.current) clearTimeout(timerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      setShowModal(false);
    }

    // Cleanup khi component bị hủy
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [isAuthenticated]);

  // Effect: Đếm ngược số giây hiển thị trên Modal
  useEffect(() => {
    let interval = null;
    if (showModal && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showModal, countdown]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-vtv-card border border-yellow-500/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
        {/* Hiệu ứng thanh thời gian chạy ở trên đầu */}
        <div
          className="absolute top-0 left-0 h-1 bg-yellow-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(countdown / (WARNING_BEFORE / 1000)) * 100}%` }}
        ></div>

        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
          <Clock size={32} className="animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Cảnh báo hết phiên!
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Phiên đăng nhập của bạn sẽ kết thúc sau{' '}
          <strong className="text-yellow-500 text-lg">{countdown}</strong> giây
          nữa. Bạn có muốn gia hạn không?
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleForceLogout}
            className="flex-1 py-3 rounded-lg border border-slate-600 text-gray-400 hover:bg-slate-800 hover:text-white transition font-bold"
          >
            Đăng xuất
          </button>
          <button
            onClick={handleExtendSession}
            className="flex-1 py-3 rounded-lg bg-vtv-green text-black font-bold hover:bg-green-400 transition shadow-lg shadow-green-500/20"
          >
            Gia hạn ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;
