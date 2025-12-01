import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';

// Import 2 trang vừa tạo
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-vtv-dark text-gray-200 font-sans pb-20">
        
        {/* --- HEADER (Dùng chung cho mọi trang) --- */}
        <header className="sticky top-0 z-50 bg-vtv-dark/90 backdrop-blur-md border-b border-slate-800">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-black tracking-tighter text-white">
              VTV<span className="text-vtv-green">KEY</span>
            </Link>

            <div className="flex-1 max-w-2xl relative hidden md:block">
              <input type="text" placeholder="Tìm kiếm sản phẩm..." className="w-full bg-slate-900 border border-slate-700 text-sm rounded-full py-2.5 pl-5 text-white focus:border-vtv-green focus:outline-none"/>
              <Search className="absolute right-3 top-2.5 text-gray-500" size={18}/>
            </div>

            <div className="flex gap-4 text-sm font-bold">
               <button className="flex items-center gap-2 hover:text-vtv-green transition">
                <ShoppingCart size={20} />
                <span className="hidden sm:block">Giỏ hàng</span>
              </button>
            </div>
          </div>
        </header>

        {/* --- NỘI DUNG THAY ĐỔI THEO ROUTE --- */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>

        {/* --- FOOTER (Dùng chung) --- */}
        <footer className="mt-10 border-t border-slate-800 py-8 text-center text-gray-500 text-sm">
          <p>© 2025 VTV Key Shop. All rights reserved.</p>
        </footer>

      </div>
    </Router>
  );
}

export default App;