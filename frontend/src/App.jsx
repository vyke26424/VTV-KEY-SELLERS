import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, User, Zap, Gamepad2, Bot, MonitorPlay } from 'lucide-react';

const CATEGORIES = [
  { id: 'hot', title: 'SẢN PHẨM HOT TREND', icon: <Zap size={20} className="text-yellow-400"/> },
  { id: 'steam', title: 'GAME STEAM', icon: <Gamepad2 size={20} className="text-blue-400"/> },
  { id: 'ai', title: 'SẢN PHẨM AI', icon: <Bot size={20} className="text-green-400"/> },
  { id: 'ent', title: 'GIẢI TRÍ', icon: <MonitorPlay size={20} className="text-red-400"/> },
];

const PRODUCTS = [
  { id: 1, name: 'Spotify Premium 1 Năm', price: '290.000đ', oldPrice: '590.000đ', discount: '-50%', category: 'ent', image: '🎵', hot: true },
  { id: 2, name: 'ChatGPT Plus', price: '450.000đ', oldPrice: '550.000đ', discount: '-18%', category: 'ai', image: '🤖', hot: true },
  { id: 3, name: 'Elden Ring', price: '890.000đ', oldPrice: '1.200.000đ', discount: '-25%', category: 'steam', image: '⚔️', hot: false },
  { id: 4, name: 'Youtube Premium', price: '25.000đ', oldPrice: '50.000đ', discount: '-50%', category: 'ent', image: '▶️', hot: true },
  { id: 5, name: 'Windows 11 Pro', price: '150.000đ', oldPrice: '3.500.000đ', discount: '-95%', category: 'hot', image: '🪟', hot: true },
  { id: 6, name: 'Midjourney', price: '200.000đ', oldPrice: '400.000đ', discount: '-50%', category: 'ai', image: '🎨', hot: false },
  { id: 7, name: 'Steam Wallet 50$', price: '1.200.000đ', oldPrice: '1.300.000đ', discount: '-10%', category: 'steam', image: '💳', hot: false },
  { id: 8, name: 'Netflix 4K', price: '65.000đ', oldPrice: '260.000đ', discount: '-75%', category: 'ent', image: '🎬', hot: true },
];

const ProductCard = ({ product }) => (
  <motion.div 
    whileHover={{ scale: 1.03, y: -5 }}
    // Sử dụng màu vtv-card
    className="bg-vtv-card rounded-xl overflow-hidden border border-slate-700 hover:border-vtv-green transition-colors group relative"
  >
    <div className="h-32 bg-slate-700/50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
      {product.image}
    </div>
    
    <div className="absolute top-2 right-2 bg-vtv-red text-white text-xs font-bold px-2 py-1 rounded">
      {product.discount}
    </div>

    <div className="p-3">
      <h3 className="font-semibold text-white text-sm truncate mb-1">{product.name}</h3>
      <div className="flex flex-col">
        <span className="text-gray-500 text-xs line-through">{product.oldPrice}</span>
        <div className="flex justify-between items-center mt-1">
          <span className="text-vtv-green font-bold">{product.price}</span>
          <button className="bg-vtv-green hover:bg-green-500 text-white p-1.5 rounded-lg transition-colors">
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

function App() {
  return (
    // Sử dụng màu vtv-dark cho nền
    <div className="min-h-screen bg-vtv-dark text-gray-200 font-sans pb-20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-vtv-dark/90 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* LOGO ĐÃ ĐỔI TÊN */}
          <div className="text-2xl font-black tracking-tighter text-white">
            VTV<span className="text-vtv-green">KEY</span>
          </div>

          <div className="flex-1 max-w-2xl relative hidden md:block">
            <input 
              type="text" 
              placeholder="Tìm kiếm: 'Key win 11', 'Tài khoản ChatGPT'..." 
              className="w-full bg-slate-900 border border-slate-700 text-sm rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:border-vtv-green transition-all text-white placeholder-gray-500"
            />
            <button className="absolute right-1.5 top-1.5 bg-slate-800 p-1.5 rounded-full hover:bg-slate-700 text-gray-400">
              <Search size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button className="flex items-center gap-2 hover:text-vtv-green transition">
              <ShoppingCart size={20} />
              <span className="hidden sm:block">Giỏ hàng</span>
            </button>
            <button className="bg-vtv-green hover:bg-green-500 text-white px-4 py-2 rounded-full transition">
              Đăng nhập
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <div className="container mx-auto px-4 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <div className="md:col-span-2 bg-gradient-to-r from-green-900 to-slate-900 rounded-2xl p-8 relative overflow-hidden border border-slate-700">
            <div className="relative z-10 max-w-md">
              <span className="bg-white/10 text-green-300 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">PREMIUM SALE</span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">Spotify Premium <br/>Chỉ từ 19k/tháng</h1>
              <button className="bg-vtv-green text-black font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform">
                MUA NGAY
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          </div>

          <div className="bg-vtv-card rounded-2xl p-6 border border-slate-700 flex flex-col justify-center items-center text-center relative overflow-hidden">
             <h3 className="text-vtv-red font-bold text-lg mb-2 tracking-widest">FLASH SALE</h3>
             <div className="text-4xl font-mono font-bold text-white mb-4 flex gap-2">
               <div className="bg-slate-900 p-2 rounded">00</div>:
               <div className="bg-slate-900 p-2 rounded">10</div>:
               <div className="bg-slate-900 p-2 rounded">17</div>
             </div>
             <p className="text-gray-400 text-sm">Kết thúc sớm, đừng bỏ lỡ!</p>
          </div>
        </motion.div>
      </div>

      {/* DANH MỤC */}
      <div className="container mx-auto px-4 mt-12 space-y-12">
        {CATEGORIES.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white uppercase">
                {cat.icon} {cat.title}
              </h2>
              <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-vtv-green transition">Xem tất cả &rarr;</a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {PRODUCTS
                .filter(p => cat.id === 'hot' ? p.hot : p.category === cat.id)
                .map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* FOOTER ĐỔI TÊN */}
      <footer className="mt-20 border-t border-slate-800 py-8 text-center text-gray-500 text-sm">
        <p>© 2025 VTV Key Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;