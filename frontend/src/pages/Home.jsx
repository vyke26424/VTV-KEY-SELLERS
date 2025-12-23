import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Gamepad2, Bot, MonitorPlay, ArrowRight, Sparkles } from 'lucide-react'; // Thêm icon Sparkles
import { Link } from 'react-router-dom';

// --- IMPORT COMPONENT ---
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';
import axiosClient from '../store/axiosClient';
import useAuthStore from '../store/useAuthStore'; // Import Auth Store để check login

const CATEGORIES = [
  { id: 'hot', title: 'SẢN PHẨM HOT TREND', icon: <Zap size={20} className="text-yellow-400" /> },
  { id: 'game', title: 'GAME HAY', icon: <Gamepad2 size={20} className="text-blue-400" /> },
  { id: 'ai', title: 'SẢN PHẨM AI', icon: <Bot size={20} className="text-green-400" /> },
  { id: 'entertainment', title: 'GIẢI TRÍ', icon: <MonitorPlay size={20} className="text-red-400" /> },
  { id: 'software', title: 'PHẦN MỀM', icon: <MonitorPlay size={20} className="text-purple-400" /> },
  { id: 'education', title: 'HỌC TẬP', icon: <MonitorPlay size={20} className="text-indigo-400" /> },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]); // State chứa gợi ý
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore(); // Check login

  // 1. Fetch sản phẩm chung
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
        console.error('Lỗi tải trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Fetch Gợi ý (Chỉ chạy khi đã login)
  useEffect(() => {
      if (isAuthenticated) {
          const fetchRecommendations = async () => {
              try {
                  const res = await axiosClient.get('/products/recommendations');
                  // Nếu có dữ liệu trả về thì lưu vào state
                  if (Array.isArray(res) && res.length > 0) {
                      setRecommendedProducts(res);
                  }
              } catch (error) {
                  console.error("Lỗi lấy gợi ý:", error);
                  // Không cần làm gì cả, nếu lỗi thì ẩn section đi thôi
              }
          };
          fetchRecommendations();
      }
  }, [isAuthenticated]);

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
          <>
            {/* --- SECTION ĐẶC BIỆT: CÓ THỂ BẠN SẼ THÍCH (Hiển thị nếu có gợi ý) --- */}
            {recommendedProducts.length > 0 && (
                <section className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg shadow-purple-900/10 relative overflow-hidden">
                    {/* Hiệu ứng nền nhẹ */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-purple-500/20 pb-2 relative z-10">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase">
                            <Sparkles size={24} className="text-purple-400 animate-pulse" /> CÓ THỂ BẠN SẼ THÍCH
                        </h2>
                        <span className="text-xs font-medium text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                            Dành riêng cho bạn ✨
                        </span>
                    </div>

                    {/* Grid Sản phẩm (Không có nút xem thêm) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
                        {recommendedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* --- CÁC SECTION DANH MỤC THƯỜNG --- */}
            {CATEGORIES.map((cat) => {
                const filteredProducts = products.filter((p) => {
                if (cat.id === 'hot') return p.isHot === true;
                const categorySlug = p.category?.slug || '';
                return categorySlug === cat.id;
                });

                if (filteredProducts.length === 0) return null;

                return (
                <section
                    key={cat.id}
                    className="bg-vtv-card p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-2">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase">
                        {cat.icon} {cat.title}
                    </h2>
                    <Link
                        to={cat.id === 'hot' ? '/products' : `/category/${cat.id}`}
                        className="text-xs text-gray-400 hover:text-vtv-green transition"
                    >
                        Xem tất cả &rarr;
                    </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.slice(0, 7).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}

                    <Link
                        to={cat.id === 'hot' ? '/products' : `/category/${cat.id}`}
                        className="group h-full block"
                    >
                        <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-slate-900 h-full rounded-xl border border-dashed border-slate-700 hover:border-vtv-green hover:bg-slate-800/50 transition-all flex flex-row items-center justify-center gap-3 p-4 cursor-pointer relative overflow-hidden"
                        >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-vtv-green group-hover:text-black transition-colors duration-300">
                            <ArrowRight
                            size={24}
                            className="group-hover:translate-x-1 transition-transform"
                            />
                        </div>
                        <div className="text-left">
                            <span className="text-white font-bold text-sm block group-hover:text-vtv-green transition-colors">
                            XEM TẤT CẢ
                            </span>
                            <span className="text-gray-500 text-xs">
                            Còn nhiều nữa...
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-vtv-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                    </Link>
                    </div>
                </section>
                );
            })}
          </>
        )}
      </div>
    </div>
  );
};
export default Home;