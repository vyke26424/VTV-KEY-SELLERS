import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Gamepad2, Bot, MonitorPlay, ArrowRight } from 'lucide-react'; // Thêm ArrowRight
import { Link } from 'react-router-dom';

// --- IMPORT COMPONENT ---
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';
import axiosClient from '../store/axiosClient';

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
        const res = await axiosClient.get('/products', { params: { limit: 100 } });
        
        let productList = [];
        if (res && Array.isArray(res.product)) {
            productList = res.product;
        } else if (Array.isArray(res)) {
            productList = res;
        }
        setProducts(productList);
      } catch (error) {
        console.error("Lỗi tải trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pb-20 min-h-screen">
      <Banner />

      <div className="container mx-auto px-4 space-y-12 mt-12">
        {loading ? (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vtv-green mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải thế giới công nghệ...</p>
            </div>
        ) : (
          CATEGORIES.map((cat) => {
            const filteredProducts = products.filter(p => {
                if (cat.id === 'hot') return p.isHot === true;
                const categorySlug = p.category?.slug || ''; 
                return categorySlug === cat.id;
            });

            if (filteredProducts.length === 0) return null;

            return (
               <section key={cat.id} className="bg-vtv-card p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* Header Danh mục */}
                  <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-2">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase">
                      {cat.icon} {cat.title}
                    </h2>
                    <Link to={cat.id === 'hot' ? '/products' : `/category/${cat.id}`} className="text-xs text-gray-400 hover:text-vtv-green transition">
                        Xem tất cả &rarr;
                    </Link>
                  </div>
                  
                   {/* GRID MỚI CHO CARD NGANG 
                      (Tăng số cột để card không bị kéo giãn quá dài)
                   */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      
                      {/* Hiển thị tối đa 7 sản phẩm (để chừa 1 ô cho nút Xem Thêm nếu grid 4 cột) */}
                      {filteredProducts.slice(0, 7).map(product => (
                          <ProductCard key={product.id} product={product} />
                      ))}
                      
                      {/* --- CARD "XEM THÊM" (STYLE NGANG ĐỒNG BỘ) --- */}
                      <Link to={cat.id === 'hot' ? '/products' : `/category/${cat.id}`} className="group h-full block">
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-900 h-full rounded-xl border border-dashed border-slate-700 hover:border-vtv-green hover:bg-slate-800/50 transition-all flex flex-row items-center justify-center gap-3 p-4 cursor-pointer relative overflow-hidden"
                        >
                            {/* Icon Arrow bay bay */}
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-vtv-green group-hover:text-black transition-colors duration-300">
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform"/>
                            </div>
                            
                            {/* Text */}
                            <div className="text-left">
                                 <span className="text-white font-bold text-sm block group-hover:text-vtv-green transition-colors">XEM TẤT CẢ</span>
                                 <span className="text-gray-500 text-xs">Còn nhiều nữa...</span>
                            </div>

                            {/* Hiệu ứng nền nhẹ */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-vtv-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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