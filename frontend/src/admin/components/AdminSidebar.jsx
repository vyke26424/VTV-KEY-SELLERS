import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  FolderTree,
  Settings,
  Menu,
  X,
  Package,
  LogOut, // Import icon Logout
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import axiosClient from '../../store/axiosClient';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Sản phẩm', icon: ShoppingBag, path: '/admin/products' },
  { name: 'Danh mục', icon: FolderTree, path: '/admin/categories' },
  { name: 'Đơn hàng', icon: ShoppingCart, path: '/admin/orders' },
  { name: 'Kho hàng', icon: Package, path: '/admin/stock' }, 
  { name: 'Khách hàng', icon: Users, path: '/admin/customers' },
  { name: 'Nhân viên', icon: Users, path: '/admin/staff' },
  { name: 'Cài đặt', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuthStore(); // Lấy hàm logout
  const navigate = useNavigate();

  // --- HÀM ĐĂNG XUẤT ---
  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất khỏi Admin?')) {
        try {
            await axiosClient.post('/auth/logout'); // Gọi API logout nếu cần
        } catch (error) {
            console.error(error);
        } finally {
            logout(); // Xóa state store
            navigate('/login'); // Chuyển về trang login
        }
    }
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 250 }}
      className="bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col z-20 transition-all duration-300 shadow-xl"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-black text-white tracking-tighter"
          >
            VTV<span className="text-vtv-green">ADMIN</span>
          </motion.span>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition ml-auto"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <nav className="space-y-1 px-2">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'} 
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                ${
                  isActive
                    ? 'bg-vtv-green text-black font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <item.icon size={22} className="flex-shrink-0" />

              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer (User Info + Logout) */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center flex-col' : ''}`}>
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg uppercase shrink-0 cursor-default">
            {user?.fullName ? user.fullName.substring(0, 2) : 'AD'}
          </div>

          {/* Info & Logout Button */}
          {!isCollapsed ? (
            <div className="flex-1 overflow-hidden flex justify-between items-center">
                <div className="min-w-0 mr-2">
                    <p className="text-sm font-bold text-white truncate">
                        {user?.fullName || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        {user?.email || 'Super Admin'}
                    </p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                    title="Đăng xuất"
                >
                    <LogOut size={18} />
                </button>
            </div>
          ) : (
            // Nút Logout khi thu nhỏ (nằm dưới Avatar)
            <button 
                onClick={handleLogout}
                className="mt-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                title="Đăng xuất"
            >
                <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;