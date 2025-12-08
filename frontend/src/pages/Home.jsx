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
  const [products, setProducts] = useState([]); // Khởi tạo mảng rỗng
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((res) => {
        // Kiểm tra nếu Server trả về lỗi (404, 500...)
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // QUAN TRỌNG: Chỉ setProducts nếu data thực sự là một mảng
        if (Array.isArray(data)) {
            setProducts(data);
        } else {
            console.error("Dữ liệu nhận được không phải là mảng:", data);
            setProducts([]); // Fallback về mảng rỗng để không lỗi .filter
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi kết nối Backend:", err);
        setProducts([]); // Gặp lỗi thì set rỗng để web không chết
        setLoading(false);
      });
  }, []);

  return (
    <div className="pb-20">
      <Banner />

      <div className="container mx-auto px-4 space-y-12 mt-12">
        {loading ? <div className="text-center text-gray-500 py-10">Đang tải dữ liệu từ Server...</div> : 
          CATEGORIES.map((cat) => {
            const filteredProducts = products.filter(p => {
                // 1. Nếu là kệ HOT TREND: Chỉ lấy sản phẩm có cờ isHot = true
                if (cat.id === 'hot') {
                    return p.isHot === true; 
                }

                // 2. Nếu là các kệ khác (Steam, AI...): Lọc theo slug danh mục
                // (Ưu tiên lấy từ p.category.slug nếu có relation, không thì lấy categorySlug)
                const productCatSlug = p.category?.slug || p.categorySlug;
                return productCatSlug === cat.id;
            });
            if (filteredProducts.length === 0) return null;

            return (
               <section key={cat.id}>
                  <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-2">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase">
                      {cat.icon} {cat.title}
                    </h2>
                  </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {filteredProducts.map(product => (
                          <ProductCard key={product.id} product={product} />
                      ))}
                      
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