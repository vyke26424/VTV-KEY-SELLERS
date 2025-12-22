import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Sun, X, Package, User, ShoppingCart, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../store/axiosClient';

const AdminHeader = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // --- 1. LOGIC GỌI API (DEBOUNCE) ---
  useEffect(() => {
    // Chỉ search khi gõ > 2 ký tự
    if (query.length < 2) {
        setResults(null);
        return;
    }

    // Delay 500ms để tránh spam API khi đang gõ
    const timer = setTimeout(async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/admin/search?q=${query}`);
            setResults(res);
            setShowDropdown(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hàm chuyển trang khi chọn kết quả
  const handleNavigate = (path) => {
      navigate(path);
      setShowDropdown(false);
      setQuery(''); // Reset ô tìm kiếm
  };

  const hasResults = results && (results.orders.length > 0 || results.products.length > 0 || results.users.length > 0);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* --- SEARCH BAR --- */}
      <div className="relative w-96 hidden md:block" ref={searchRef}>
        <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
              placeholder="Tìm đơn hàng, sản phẩm, email..."
              className="w-full bg-slate-800 border border-slate-700 text-gray-300 text-sm rounded-full py-2 pl-10 pr-10 focus:outline-none focus:border-vtv-green focus:ring-1 focus:ring-vtv-green transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            {loading && <Loader className="absolute right-3 top-2.5 text-vtv-green animate-spin" size={16} />}
            {query && !loading && (
                <button onClick={() => { setQuery(''); setResults(null); }} className="absolute right-3 top-2.5 text-gray-500 hover:text-white">
                    <X size={16} />
                </button>
            )}
        </div>

        {/* --- DROPDOWN KẾT QUẢ --- */}
        {showDropdown && (
            <div className="absolute top-full mt-2 left-0 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
                
                {!hasResults && !loading && (
                    <div className="p-4 text-center text-gray-500 text-sm">Không tìm thấy kết quả nào.</div>
                )}

                {/* 1. KẾT QUẢ ĐƠN HÀNG */}
                {results?.orders?.length > 0 && (
                    <div className="border-b border-slate-800">
                        <div className="px-4 py-2 bg-slate-800/50 text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                            <ShoppingCart size={14}/> Đơn hàng
                        </div>
                        {results.orders.map(order => (
                            <div 
                                key={order.id} 
                                onClick={() => handleNavigate('/admin/orders')} // Sau này sửa thành /admin/orders/{id} nếu làm trang chi tiết
                                className="px-4 py-3 hover:bg-slate-800 cursor-pointer transition border-b border-slate-800/50 last:border-0"
                            >
                                <div className="text-white font-bold text-sm">{order.code}</div>
                                <div className="text-xs text-vtv-green">{new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ - {order.status}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. KẾT QUẢ SẢN PHẨM */}
                {results?.products?.length > 0 && (
                    <div className="border-b border-slate-800">
                        <div className="px-4 py-2 bg-slate-800/50 text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                            <Package size={14}/> Sản phẩm
                        </div>
                        {results.products.map(prod => (
                            <div 
                                key={prod.id} 
                                onClick={() => handleNavigate(`/admin/products/edit/${prod.id}`)}
                                className="px-4 py-2 hover:bg-slate-800 cursor-pointer transition flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded bg-slate-700 overflow-hidden shrink-0">
                                    {prod.thumbnail ? <img src={prod.thumbnail} className="w-full h-full object-cover"/> : ''}
                                </div>
                                <div className="text-sm text-gray-300 truncate">{prod.name}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. KẾT QUẢ KHÁCH HÀNG */}
                {results?.users?.length > 0 && (
                    <div>
                        <div className="px-4 py-2 bg-slate-800/50 text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                            <User size={14}/> Khách hàng
                        </div>
                        {results.users.map(u => (
                            <div 
                                key={u.id} 
                                onClick={() => handleNavigate('/admin/customers')}
                                className="px-4 py-3 hover:bg-slate-800 cursor-pointer transition"
                            >
                                <div className="text-white text-sm font-medium">{u.fullName || 'Chưa đặt tên'}</div>
                                <div className="text-xs text-gray-500">{u.email}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Actions Right (Giữ nguyên) */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-yellow-400 transition">
          <Sun size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-white transition relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;