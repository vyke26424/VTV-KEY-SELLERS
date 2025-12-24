import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Camera,
  Lock,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Save,
  ChevronRight,
} from 'lucide-react';
import axiosClient from '../store/axiosClient';
import useAuthStore from '../store/useAuthStore';

// Helper format tiền & ngày
const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    amount,
  );
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuthStore();

  // State
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  // Form đổi thông tin
  const [fullName, setFullName] = useState(user?.fullName || '');

  // State Avatar "Phông bạt"
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // Form đổi mật khẩu
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 1. Fetch dữ liệu đơn hàng (API CHUẨN)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy lịch sử đơn hàng của user
        const res = await axiosClient.get('/orders/my-orders');

        if (Array.isArray(res)) {
          setOrders(res);

          // Tính toán thống kê (Xử lý case-insensitive và chính tả)
          const pending = res.filter(
            (o) => o.status?.toUpperCase() === 'PENDING',
          ).length;
          
          const completed = res.filter(
            (o) =>
              o.status?.toUpperCase() === 'COMPLETED' ||
              o.status?.toUpperCase() === 'SUCCESS',
          ).length;
          
          const cancelled = res.filter((o) =>
            ['CANCELED', 'CANCELLED', 'REFUNDED'].includes(
              o.status?.toUpperCase(),
            ),
          ).length;

          setStats({ pending, completed, cancelled });
        }
      } catch (error) {
        console.error('Lỗi tải đơn hàng:', error);
      }
    };
    fetchData();
  }, []);

  // 2. Xử lý chọn ảnh "Phông bạt"
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  // 3. Cập nhật thông tin (CHỈ GỬI TÊN)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.patch('/users/profile', {
        fullName: fullName,
      });

      alert('Cập nhật thông tin thành công!');
      await checkAuth(); // Reload lại store để cập nhật tên trên Header
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 4. Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post('/auth/change-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      logout();
      navigate('/login');
    } catch (error) {
      alert(
        'Lỗi: ' + (error.response?.data?.message || 'Mật khẩu cũ không đúng'),
      );
    } finally {
      setLoading(false);
    }
  };

  // Lấy avatar hiển thị
  const displayAvatar =
    previewAvatar ||
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${
      user?.fullName || 'User'
    }&background=22c55e&color=000&size=128`;

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI: THÔNG TIN & STATS --- */}
        <div className="space-y-6">
          {/* Card Avatar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-xl mx-auto ring-2 ring-vtv-green/20">
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Nút bấm "Phông bạt" */}
              <label className="absolute bottom-0 right-0 bg-vtv-green text-black p-2 rounded-full cursor-pointer hover:bg-green-400 transition shadow-lg transform active:scale-95">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">
              {user?.fullName || 'Thành viên mới'}
            </h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="mt-3 inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold border border-yellow-500/20">
              {user?.role === 'ADMIN'
                ? 'Quản trị viên'
                : 'Khách hàng thân thiết'}
            </div>
          </div>

          {/* Thống kê đơn hàng (Click vào chuyển sang trang OrderHistory) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-400" /> Thống kê đơn hàng
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Link
                to="/orders"
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition group"
              >
                <Clock
                  size={24}
                  className="text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition"
                />
                <div className="text-xl font-bold text-white">
                  {stats.pending}
                </div>
                <div className="text-[10px] text-gray-500 uppercase">
                  Chờ xử lý
                </div>
              </Link>
              <Link
                to="/orders"
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-green-500/50 transition group"
              >
                <CheckCircle
                  size={24}
                  className="text-green-500 mx-auto mb-2 group-hover:scale-110 transition"
                />
                <div className="text-xl font-bold text-white">
                  {stats.completed}
                </div>
                <div className="text-[10px] text-gray-500 uppercase">
                  Hoàn thành
                </div>
              </Link>
              <Link
                to="/orders"
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-red-500/50 transition group"
              >
                <XCircle
                  size={24}
                  className="text-red-500 mx-auto mb-2 group-hover:scale-110 transition"
                />
                <div className="text-xl font-bold text-white">
                  {stats.cancelled}
                </div>
                <div className="text-[10px] text-gray-500 uppercase">
                  Đã hủy
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: NỘI DUNG CHÍNH --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Form Thông tin */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <User size={20} className="text-vtv-green" /> Thông tin tài khoản
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-3 text-gray-500"
                    />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-vtv-green outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Email (Không thể đổi)
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-3 text-gray-500"
                    />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-vtv-green text-black font-bold px-6 py-2.5 rounded-xl hover:bg-green-400 transition flex items-center gap-2 transform active:scale-95"
                >
                  <Save size={18} /> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>

          {/* 2. Đơn hàng gần đây (MỚI THÊM) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Package size={20} className="text-yellow-500" /> Đơn hàng mới
                nhất
              </h3>
              <Link
                to="/orders"
                className="text-sm text-vtv-green hover:underline flex items-center"
              >
                Xem tất cả <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => {
                 const stKey = order.status?.toUpperCase();
                 const isCompleted = stKey === 'COMPLETED' || stKey === 'SUCCESS';
                 const isPending = stKey === 'PENDING';
                 
                 return (
                <div
                  key={order.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center hover:bg-slate-800/50 transition"
                >
                  <div>
                    <p className="text-white font-bold text-sm">{order.code}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)} • {order.items.length} sản
                      phẩm
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-vtv-green font-bold text-sm">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold 
                        ${
                          isCompleted
                            ? 'text-green-500 bg-green-500/10'
                            : isPending
                            ? 'text-yellow-500 bg-yellow-500/10'
                            : 'text-red-500 bg-red-500/10'
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              )})}
              {orders.length === 0 && (
                <p className="text-center text-gray-500 py-4 italic">
                  Chưa có đơn hàng nào.
                </p>
              )}
            </div>
          </div>

          {/* 3. Form Đổi mật khẩu */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Lock size={20} className="text-red-400" /> Đổi mật khẩu
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passData.currentPassword}
                  onChange={(e) =>
                    setPassData({
                      ...passData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:border-vtv-green outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passData.newPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, newPassword: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:border-vtv-green outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passData.confirmPassword}
                    onChange={(e) =>
                      setPassData({
                        ...passData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:border-vtv-green outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-slate-700 border border-slate-600 transition transform active:scale-95"
                >
                  {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;