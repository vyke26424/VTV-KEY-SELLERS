import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Gamepad2, Bot, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. KHÔI PHỤC CẤU HÌNH DANH MỤC (VISUAL SECTIONS)
const CATEGORIES = [
  { id: 'hot', title: 'SẢN PHẨM HOT TREND', icon: <Zap size={20} className="text-yellow-400"/> },
  { id: 'steam', title: 'GAME STEAM', icon: <Gamepad2 size={20} className="text-blue-400"/> },
  { id: 'ai', title: 'SẢN PHẨM AI', icon: <Bot size={20} className="text-green-400"/> },
  { id: 'entertainment', title: 'GIẢI TRÍ', icon: <MonitorPlay size={20} className="text-red-400"/> },
];

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ProductCard = ({ product }) => {
  // Logic tìm giá thấp nhất (giữ nguyên từ bản Prisma)
  const minVariant = product.variants?.length > 0 
    ? product.variants.reduce((prev, curr) => parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr) 
    : { price: 0, orginalPrice: 0 };

  const discountPercent = minVariant.orginalPrice > 0
    ? Math.round(((minVariant.orginalPrice - minVariant.price) / minVariant.orginalPrice) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div whileHover={{ scale: 1.03, y: -5 }} className="bg-vtv-card rounded-xl overflow-hidden border border-slate-700 hover:border-vtv-green transition-colors group relative flex flex-col h-full cursor-pointer">
        <div className="h-32 bg-slate-700/50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
          {product.thumbnail ? <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover"/> : '📦'}
        </div>
        
        {discountPercent > 0 && <div className="absolute top-2 right-2 bg-vtv-red text-white text-xs font-bold px-2 py-1 rounded">-{discountPercent}%</div>}
        
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-semibold text-white text-sm truncate mb-1">{product.name}</h3>
          <div className="mt-auto">
            {parseFloat(minVariant.orginalPrice) > 0 && (
              <span className="text-gray-500 text-xs line-through block">{formatCurrency(minVariant.orginalPrice)}</span>
            )}
            <div className="flex justify-between items-center mt-1">
              <span className="text-vtv-green font-bold">{formatCurrency(minVariant.price)}</span>
              <button className="bg-vtv-green hover:bg-green-500 text-black p-1.5 rounded-lg transition-colors"><ShoppingCart size={14} /></button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. CẬP NHẬT MOCK DATA (Thêm categorySlug để lọc)
    const mockPrismaData = [
      {
        id: 1,
        name: "Netflix Premium 4K",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
        categorySlug: "entertainment", // Khớp với ID trong CATEGORIES
        isHot: true, // Đánh dấu là hàng hot
        variants: [
          { id: 101, name: "1 Tháng", price: "65000", orginalPrice: "260000" },
        ]
      },
      {
        id: 2,
        name: "ChatGPT Plus (OpenAI)",
        categorySlug: "ai",
        isHot: true,
        variants: [
          { id: 201, name: "Tài khoản riêng", price: "450000", orginalPrice: "550000" }
        ]
      },
      {
         id: 3,
         name: "Windows 11 Pro Key",
         categorySlug: "hot", // Có thể để hot hoặc software
         isHot: true,
         variants: [
             { id: 301, name: "Vĩnh viễn", price: "150000", orginalPrice: "3000000"}
         ]
      },
      {
        id: 4,
        name: "Elden Ring",
        categorySlug: "steam",
        isHot: false,
        variants: [
            { id: 401, name: "Standard", price: "890000", orginalPrice: "1200000"}
        ]
     },
     {
        id: 5,
        name: "Midjourney",
        categorySlug: "ai",
        isHot: false,
        variants: [
            { id: 501, name: "Pro", price: "200000", orginalPrice: "400000"}
        ]
     }
    ];

    setTimeout(() => {
      setProducts(mockPrismaData);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="pb-20">
      {/* Banner giữ nguyên */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-green-900 to-slate-900 rounded-2xl p-8 mb-8 border border-slate-700 relative overflow-hidden">
             <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white mb-2">Spotify Premium</h1>
                <p className="text-gray-300 mb-4">Chỉ từ 19k/tháng. Nâng cấp chính chủ.</p>
                <button className="bg-vtv-green text-black font-bold px-6 py-2 rounded-full">Mua ngay</button>
             </div>
        </div>
      </div>

      {/* 3. HIỂN THỊ THEO TỪNG KỆ HÀNG (Restored) */}
      <div className="container mx-auto px-4 space-y-12">
        {loading ? <div className="text-center text-gray-500">Đang tải dữ liệu...</div> : 
          CATEGORIES.map((cat) => (
            <section key={cat.id}>
              {/* Tiêu đề kệ hàng */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase">
                  {cat.icon} {cat.title}
                </h2>
                <a href="#" className="text-xs text-gray-400 hover:text-vtv-green transition">Xem tất cả &rarr;</a>
              </div>

              {/* Grid sản phẩm của kệ hàng đó */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products
                  .filter(p => {
                     // Logic lọc: Nếu là kệ HOT thì lấy sản phẩm có isHot = true
                     if (cat.id === 'hot') return p.isHot;
                     // Nếu kệ thường thì lấy theo categorySlug
                     return p.categorySlug === cat.id;
                  })
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                }
              </div>
            </section>
          ))
        }
      </div>
    </div>
  );
};
export default Home;