import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, ChevronDown, Package } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const Header = () => {
  // --- SỬA LẠI ĐÚNG Ở ĐÂY ---
  const { user, isAuthenticated, logout } = useAuthStore(); 
  // -------------------------

  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Logic click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="sticky top-0 z-50 bg-vtv-dark/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-white">
          VTV<span className="text-vtv-green">KEY</span>
        </Link>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="w-full bg-slate-900 border border-slate-700 text-sm rounded-full py-2.5 pl-5 text-white focus:border-vtv-green focus:outline-none transition-colors"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 hover:text-white cursor-pointer" size={18}/>
        </div>

        {/* USER ACTIONS */}
        <div className="flex items-center gap-6 text-sm font-bold">
           <Link to="/cart" className="flex items-center gap-2 hover:text-vtv-green transition relative group">
            <div className="relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-vtv-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:block">Giỏ hàng</span>
          </Link>

          {isAuthenticated ? (
               <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-3 border-l border-slate-700 pl-6 transition ${isUserMenuOpen ? 'text-vtv-green' : 'text-white hover:text-vtv-green'}`}
                  >
                     <div className="bg-vtv-green text-black p-1.5 rounded-full">
                        <User size={18} />
                     </div>
                     <div className="hidden sm:flex flex-col items-start leading-none">
                        <span className="text-sm font-bold">
                           {user?.fullName || 'Thành viên'}
                        </span>
                     </div>
                     <ChevronDown size={14} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}/>
                  </button>
                  
                  {/* Menu Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-3 w-64 bg-vtv-card border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                        
                        {/* Header của menu: Tên & Email */}
                        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Tài khoản</p>
                            <p className="text-white font-bold truncate">{user?.fullName || 'Chưa đặt tên'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        {/* Danh sách các nút chức năng */}
                        <div className="p-2 space-y-1"> {/* space-y-1 để tạo khoảng cách nhỏ giữa các nút */}
                          
                          {/* 1. NÚT HỒ SƠ CÁ NHÂN (Link tạm tới /profile) */}
                          <Link 
                              to="/profile" 
                              onClick={() => setIsUserMenuOpen(false)}
                              className="w-full text-left p-3 text-gray-300 hover:bg-slate-700 rounded-lg flex items-center gap-3 transition"
                          >
                              <User size={16} /> Hồ sơ cá nhân
                          </Link>

                          {/* 2. NÚT QUẢN LÝ ĐƠN HÀNG (Mới thêm) */}
                          <Link 
                              to="/orders" 
                              onClick={() => setIsUserMenuOpen(false)}
                              className="w-full text-left p-3 text-gray-300 hover:bg-slate-700 rounded-lg flex items-center gap-3 transition"
                          >
                              <Package size={16} /> Quản lý đơn hàng
                          </Link>

                          {/* 3. NÚT ĐĂNG XUẤT (Có viền mờ ngăn cách) */}
                          <div className="border-t border-slate-700/50 my-1"></div>
                          
                          <button 
                            onClick={handleLogout}
                            className="w-full text-left p-3 text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition"
                          >
                            <LogOut size={16}/> Đăng xuất
                          </button>
                        </div>
                    </div>
                  )}
               </div>
             ) : (
               <Link to="/login" className="flex items-center gap-2 hover:text-vtv-green transition border-l border-slate-700 pl-6">
                 <div className="bg-slate-800 p-1.5 rounded-full">
                    <User size={18} />
                 </div>
                 <span className="hidden sm:block">Đăng nhập / Đăng ký</span>
               </Link>
             )}
        </div>
      </div>
    </header>
  );
};

export default Header;