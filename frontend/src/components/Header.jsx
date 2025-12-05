import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const Header = () => {

  const cart = useCartStore((state) => state.cart);
  // Tính tổng số lượng item (VD: Mua 2 cái Netflix + 1 cái Spotify = 3)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

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
              {/* Hiển thị số lượng thật */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-vtv-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:block">Giỏ hàng</span>
          </Link>

          <button className="flex items-center gap-2 hover:text-vtv-green transition border-l border-slate-700 pl-6">
            <div className="bg-slate-800 p-1.5 rounded-full">
               <User size={18} />
            </div>
            <span className="hidden sm:block">Đăng nhập / Đăng ký</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;