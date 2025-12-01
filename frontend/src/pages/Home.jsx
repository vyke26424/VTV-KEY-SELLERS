import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Gamepad2, Bot, MonitorPlay } from 'lucide-react'; 
import { Link } from 'react-router-dom';

// --- IMPORT COMPONENT ---
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';

// Giữ lại cấu hình danh mục
const CATEGORIES = [
  { id: 'hot', title: 'SẢN PHẨM HOT TREND', icon: <Zap size={20} className="text-yellow-400"/> },
  { id: 'steam', title: 'GAME STEAM', icon: <Gamepad2 size={20} className="text-blue-400"/> },
  { id: 'ai', title: 'SẢN PHẨM AI', icon: <Bot size={20} className="text-green-400"/> },
  { id: 'entertainment', title: 'GIẢI TRÍ', icon: <MonitorPlay size={20} className="text-red-400"/> },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data 
    const mockPrismaData = [
      {
        id: 1, name: "Netflix Premium 4K", thumbnail: "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg", categorySlug: "entertainment", isHot: true,
        variants: [{ id: 101, name: "1 Tháng", price: "65000", orginalPrice: "260000" }]
      },
      {
        id: 2, name: "ChatGPT Plus (OpenAI)", categorySlug: "ai", isHot: true,
        variants: [{ id: 201, name: "Tài khoản riêng", price: "450000", orginalPrice: "550000" }]
      },
      {
        id: 3, name: "Windows 11 Pro Key", categorySlug: "hot", isHot: true,
        variants: [{ id: 301, name: "Vĩnh viễn", price: "150000", orginalPrice: "3000000"}]
      },
      {
        id: 4, name: "Elden Ring", categorySlug: "steam", isHot: false,
        variants: [{ id: 401, name: "Standard", price: "890000", orginalPrice: "1200000"}]
      },
      {
        id: 5, name: "Midjourney", categorySlug: "ai", isHot: false,
        variants: [{ id: 501, name: "Pro", price: "200000", orginalPrice: "400000"}]
      }
    ];

    setTimeout(() => {
      setProducts(mockPrismaData);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="pb-20">
      {/* 1. SỬ DỤNG COMPONENT BANNER (Đã thay thế đoạn div cũ) */}
      <Banner />

      <div className="container mx-auto px-4 space-y-12 mt-12">
        {loading ? <div className="text-center text-gray-500 py-10">Đang tải dữ liệu...</div> : 
          CATEGORIES.map((cat) => {
            const filteredProducts = products.filter(p => {
                 if (cat.id === 'hot') return p.isHot;
                 return p.categorySlug === cat.id;
            });

            if (filteredProducts.length === 0) return null;

            return (
              <section key={cat.id}>
                {/* Tiêu đề kệ hàng */}
                <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-2">
                  <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase">
                    {cat.icon} {cat.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {/* 2. SỬ DỤNG COMPONENT PRODUCT CARD (Đã thay thế đoạn code dài cũ) */}
                  {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                  ))}

                  {/* Card Xem Thêm (Vẫn giữ nguyên ở đây hoặc tách ra nếu muốn) */}
                  <Link to={`/category/${cat.id}`} className="flex flex-col h-full min-h-[250px] group">
                    <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="flex-grow bg-slate-900/50 rounded-xl border border-dashed border-slate-600 hover:border-vtv-red hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
                    >
                        <div className="text-center group-hover:translate-x-1 transition-transform">
                             <span className="text-vtv-red font-black text-lg block mb-1">XEM THÊM &gt;</span>
                             <span className="text-gray-500 text-xs">Xem tất cả sản phẩm</span>
                        </div>
                    </motion.div>
                  </Link>

                </div>
              </section>
            );
          })
        }
      </div>
    </div>
  );
};

export default Home;