import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
  Package,
  Loader,
  X // Thêm icon X để xóa tìm kiếm
} from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../store/axiosClient';

// Helper format tiền tệ
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // --- STATE CHO LIVE SEARCH ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  // -----------------------------

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // --- 1. LOGIC TÌM KIẾM (DEBOUNCE) ---
  useEffect(() => {
    // Chỉ tìm khi gõ > 1 ký tự
    if (!query || query.trim().length < 2) {
        setResults([]);
        return;
    }

    const timer = setTimeout(async () => {
        setLoading(true);
        try {
            // Gọi API Search Public (SearchController bạn vừa gửi)
            const res = await axiosClient.get(`/search?q=${query}`);
            // API trả về { products: [...] }
            setResults(res.products || []);
            setShowDropdown(true);
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
        } finally {
            setLoading(false);
        }
    }, 500); // Đợi 500ms sau khi ngừng gõ

    return () => clearTimeout(timer);
  }, [query]);

  // --- 2. XỬ LÝ SỰ KIỆN ---
  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${query}`);
      setShowDropdown(false);
    }
  };

  const handleClearSearch = () => {
      setQuery('');
      setResults([]);
      setShowDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      logout();
      setIsUserMenuOpen(false);
      navigate('/');
    }
  };

  // Click outside để đóng menu & search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      // Đóng search dropdown khi click ra ngoài
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-vtv-dark/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-white">
          VTV<span className="text-vtv-green">KEY</span>
        </Link>

        {/* --- SEARCH BAR (LIVE SEARCH) --- */}
        <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
          <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowDropdown(true)}
                onKeyDown={handleSearchEnter}
                placeholder="Tìm kiếm phần mềm, game, key..."
                className="w-full bg-slate-900 border border-slate-700 text-sm rounded-full py-2.5 pl-10 pr-10 text-white focus:border-vtv-green focus:outline-none transition-all focus:ring-1 focus:ring-vtv-green"
              />
              <Search className="absolute left-3.5 top-2.5 text-gray-500" size={18} />
              
              {/* Icon Loading hoặc Clear */}
              {loading ? (
                  <Loader className="absolute right-3 top-2.5 text-vtv-green animate-spin" size={16} />
              ) : query && (
                  <button onClick={handleClearSearch} className="absolute right-3 top-2.5 text-gray-500 hover:text-white">
                      <X size={16} />
                  </button>
              )}
          </div>

          {/* --- DROPDOWN KẾT QUẢ --- */}
          {showDropdown && (query.length >= 2) && (
              <div className="absolute top-full mt-2 left-0 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                  
                  {results.length > 0 ? (
                      <>
                          <div className="px-4 py-2 bg-slate-800/50 text-xs font-bold text-gray-400 uppercase">
                              Sản phẩm gợi ý
                          </div>
                          {results.map((prod) => {
                              // Tính giá rẻ nhất để hiển thị
                              const minPrice = prod.variants?.length > 0 
                                  ? Math.min(...prod.variants.map(v => Number(v.price))) 
                                  : 0;

                              return (
                                  <Link 
                                      key={prod.id} 
                                      to={`/product/${prod.slug || prod.id}`}
                                      onClick={() => setShowDropdown(false)}
                                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 border-b border-slate-800/50 last:border-0 transition-colors group"
                                  >
                                      {/* Ảnh nhỏ */}
                                      <div className="w-10 h-10 rounded bg-slate-700 overflow-hidden shrink-0 border border-slate-700">
                                          {prod.thumbnail ? (
                                              <img src={prod.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                                          ) : <div className="w-full h-full flex items-center justify-center">📦</div>}
                                      </div>
                                      
                                      {/* Thông tin */}
                                      <div className="flex-1 min-w-0">
                                          <h4 className="text-sm font-bold text-white truncate group-hover:text-vtv-green transition-colors">{prod.name}</h4>
                                          <div className="flex items-center gap-2 text-xs">
                                              <span className="text-vtv-green font-mono">{minPrice > 0 ? formatCurrency(minPrice) : 'Liên hệ'}</span>
                                              <span className="text-gray-500">• {prod.category?.name || 'Phần mềm'}</span>
                                          </div>
                                      </div>
                                  </Link>
                              );
                          })}
                          
                          {/* Nút xem tất cả */}
                          <button 
                              onClick={() => { navigate(`/search?q=${query}`); setShowDropdown(false); }}
                              className="w-full py-3 text-center text-sm font-bold text-blue-400 hover:text-white hover:bg-slate-800 transition block"
                          >
                              Xem tất cả kết quả cho "{query}" &rarr;
                          </button>
                      </>
                  ) : (
                      !loading && (
                          <div className="p-6 text-center text-gray-500">
                              <p>Không tìm thấy sản phẩm nào.</p>
                          </div>
                      )
                  )}
              </div>
          )}
        </div>

        {/* USER ACTIONS (Giữ nguyên) */}
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
                <ChevronDown size={14} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-vtv-card border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Tài khoản</p>
                    <p className="text-white font-bold truncate">{user?.fullName || 'Chưa đặt tên'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="w-full text-left p-3 text-gray-300 hover:bg-slate-700 rounded-lg flex items-center gap-3 transition">
                      <User size={16} /> Hồ sơ cá nhân
                    </Link>
                    <Link to="/orders" onClick={() => setIsUserMenuOpen(false)} className="w-full text-left p-3 text-gray-300 hover:bg-slate-700 rounded-lg flex items-center gap-3 transition">
                      <Package size={16} /> Quản lý đơn hàng
                    </Link>
                    <div className="border-t border-slate-700/50 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left p-3 text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition">
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-vtv-green transition border-l border-slate-700 pl-6">
              <div className="bg-slate-800 p-1.5 rounded-full"><User size={18} /></div>
              <span className="hidden sm:block">Đăng nhập / Đăng ký</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;