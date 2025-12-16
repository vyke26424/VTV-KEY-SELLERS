import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Gamepad2, Bot, MonitorPlay } from 'lucide-react'; 
import { Link } from 'react-router-dom';

// --- IMPORT COMPONENT ---
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';
import axiosClient from '../store/axiosClient';

// Cấu hình danh mục (Giữ nguyên)
const CATEGORIES = [
  { id: 'hot', title: 'SẢN PHẨM HOT TREND', icon: <Zap size={20} className="text-yellow-400"/> },
  { id: 'game', title: 'GAME HAY', icon: <Gamepad2 size={20} className="text-blue-400"/> },
  { id: 'ai', title: 'SẢN PHẨM AI', icon: <Bot size={20} className="text-green-400"/> },
  { id: 'entertainment', title: 'GIẢI TRÍ', icon: <MonitorPlay size={20} className="text-red-400"/> },
  { id: 'software', title: 'PHẦN MỀM', icon: <MonitorPlay size={20} className="text-purple-400"/> },
  { id: 'education', title: 'HỌC TẬP', icon: <MonitorPlay size={20} className="text-indigo-400"/> },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // 1. Dùng axiosClient (Tự động base URL, tự động check bảo trì)
        // Lưu ý: Lấy limit lớn (100) để về client lọc cho đủ các mục
        const res = await axiosClient.get('/products', {
            params: { limit: 100 } 
        });

        // 2. Xử lý dữ liệu an toàn
        // Backend trả về { product: [...] } hoặc mảng trực tiếp tùy Controller
        // Ta check kỹ để tránh lỗi màn hình trắng
        let productList = [];
        if (res && Array.isArray(res.product)) {
            productList = res.product;
        } else if (Array.isArray(res)) {
            productList = res;
        }

        setProducts(productList);

      } catch (error) {
        console.error("Lỗi tải trang chủ:", error);
        // Nếu lỗi 503, axiosClient đã tự redirect sang /maintenance rồi
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="pb-20 bg-slate-950 min-h-screen"> 
      <Banner />

      <div className="container mx-auto px-4 space-y-12 mt-12">
        {loading ? (
            // Skeleton Loading đơn giản
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vtv-green mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải thế giới công nghệ...</p>
            </div>
        ) : (
          CATEGORIES.map((cat) => {
            // Logic lọc sản phẩm
            const filteredProducts = products.filter(p => {
                // 1. Lọc HOT
                if (cat.id === 'hot') return p.isHot === true;

                // 2. Lọc theo Category Slug
                // Backend trả về p.category.slug (nếu có include) hoặc ta so sánh p.categoryId nếu cần
                // Giả định backend trả về object category bên trong product
                const categorySlug = p.category?.slug || ''; 
                return categorySlug === cat.id;
            });

            // Nếu danh mục không có sản phẩm nào thì ẩn luôn cho đẹp
            if (filteredProducts.length === 0) return null;

            return (
               <section key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-2">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase">
                      {cat.icon} {cat.title}
                    </h2>
                    <Link to={cat.id === 'hot' ? '/products' : `/category/${cat.id}`} className="text-xs text-gray-400 hover:text-vtv-green transition">
                        Xem tất cả &rarr;
                    </Link>
                  </div>
                  
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {/* Chỉ hiện tối đa 4 hoặc 9 sản phẩm đầu để chừa chỗ cho nút Xem Thêm */}
                      {filteredProducts.slice(0, 9).map(product => (
                          <ProductCard key={product.id} product={product} />
                      ))}
                      
                      {/* Card "Xem Thêm" cuối cùng */}
                      <Link to={cat.id === 'hot' ? '/products' : `/category/${cat.id}`} className="flex flex-col h-full min-h-[280px] group">
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex-grow bg-slate-900/50 rounded-xl border border-dashed border-slate-700 hover:border-vtv-green hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
                        >
                            <div className="text-center group-hover:translate-x-1 transition-transform">
                                 <span className="text-vtv-green font-black text-lg block mb-1">XEM THÊM &gt;</span>
                                 <span className="text-gray-500 text-xs">Khám phá kho {cat.title}</span>
                            </div>
                        </motion.div>
                      </Link>
                   </div>
               </section>
            );
          })
        )}
      </div>
    </div>
  );
};
export default Home;