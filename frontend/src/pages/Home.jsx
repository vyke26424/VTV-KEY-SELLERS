import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Gamepad2, Bot, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link để chuyển trang

// Giữ lại các biến config
const CATEGORIES = [
  { id: 'hot', title: 'SẢN PHẨM HOT TREND', icon: <Zap size={20} className="text-yellow-400"/> },
  { id: 'steam', title: 'GAME STEAM', icon: <Gamepad2 size={20} className="text-blue-400"/> },
  { id: 'ai', title: 'SẢN PHẨM AI', icon: <Bot size={20} className="text-green-400"/> },
  { id: 'ent', title: 'GIẢI TRÍ', icon: <MonitorPlay size={20} className="text-red-400"/> },
];

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Component Card nhỏ gọn
const ProductCard = ({ product }) => {
  const discountPercent = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  return (
    <Link to={`/product/${product.id}`}> {/* Bấm vào thẻ sẽ chuyển sang trang chi tiết */}
      <motion.div whileHover={{ scale: 1.03, y: -5 }} className="bg-vtv-card rounded-xl overflow-hidden border border-slate-700 hover:border-vtv-green transition-colors group relative flex flex-col h-full cursor-pointer">
        <div className="h-32 bg-slate-700/50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
          {product.image || '📦'}
        </div>
        {discountPercent > 0 && <div className="absolute top-2 right-2 bg-vtv-red text-white text-xs font-bold px-2 py-1 rounded">-{discountPercent}%</div>}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-semibold text-white text-sm truncate mb-1">{product.name}</h3>
          <div className="mt-auto">
            {product.oldPrice && <span className="text-gray-500 text-xs line-through block">{formatCurrency(product.oldPrice)}</span>}
            <div className="flex justify-between items-center mt-1">
              <span className="text-vtv-green font-bold">{formatCurrency(product.price)}</span>
              <button className="bg-vtv-green hover:bg-green-500 text-black p-1.5 rounded-lg transition-colors"><ShoppingCart size={14} /></button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

// Component HOME chính
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
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

      {/* List sản phẩm */}
      <div className="container mx-auto px-4 space-y-12">
        {loading ? <div className="text-center text-gray-500">Đang tải...</div> : 
          CATEGORIES.map((cat) => (
            <section key={cat.id}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase">{cat.icon} {cat.title}</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.filter(p => cat.id === 'hot' ? p.category === 'hot' : p.category === cat.id).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </section>
          ))
        }
      </div>
    </div>
  );
};

export default Home;