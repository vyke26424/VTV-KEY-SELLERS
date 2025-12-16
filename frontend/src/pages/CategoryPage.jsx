import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, ShoppingCart } from 'lucide-react';
import axiosClient from '../store/axiosClient';

// Format tiền tệ
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Component ProductCard (Giữ nguyên)
const ProductCard = ({ product }) => {
  const minVariant = product.variants?.length > 0 
    ? product.variants.reduce((prev, curr) => parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr) 
    : { price: 0, orginalPrice: 0 };

  const discountPercent = minVariant.orginalPrice > 0
    ? Math.round(((minVariant.orginalPrice - minVariant.price) / minVariant.orginalPrice) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group h-full">
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-vtv-green transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/10 flex flex-col h-full">
        <div className="aspect-[4/3] bg-slate-800 relative overflow-hidden">
          {product.thumbnail ? (
             <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
          )}
          {discountPercent > 0 && (
             <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
               -{discountPercent}%
             </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 group-hover:text-vtv-green transition-colors">{product.name}</h3>
          <div className="mt-auto">
            {parseFloat(minVariant.orginalPrice) > parseFloat(minVariant.price) && (
              <span className="text-gray-500 text-xs line-through block mb-1">{formatCurrency(minVariant.orginalPrice)}</span>
            )}
            <div className="flex justify-between items-end">
              <span className="text-vtv-green font-bold text-base">{formatCurrency(minVariant.price)}</span>
              <button className="bg-slate-800 hover:bg-vtv-green hover:text-black text-gray-300 p-2 rounded-lg transition-colors">
                 <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategoryPage = () => {
  const { slug } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('Đang tải...');
  
  // Map slug sang tên hiển thị (Có thể mở rộng thêm)
  const categoryNames = {
    'hot': 'SẢN PHẨM HOT TREND 🔥',
    'game': 'GAME BẢN QUYỀN 🎮',
    'ai': 'TRÍ TUỆ NHÂN TẠO (AI) 🤖',
    'entertainment': 'GIẢI TRÍ & PHIM 🎬',
    'software': 'PHẦN MỀM BẢN QUYỀN 💻',
    'education': 'HỌC TẬP & VPN 📚',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Xác định activeSlug (Nếu vào /products thì coi là 'hot')
        const activeSlug = slug ? slug : 'hot'; 

        // 2. Set tên hiển thị
        setCategoryName(categoryNames[activeSlug] || `DANH MỤC: ${activeSlug.toUpperCase()}`);

        // 3. Gọi API lấy TOÀN BỘ sản phẩm (để Client tự lọc)
        // (Lý do: Backend của bạn hiện tại chưa có endpoint lọc riêng cho isHot)
        const res = await axiosClient.get('/products', {
            params: { limit: 100 }
        });

        let allProducts = [];
        if (res && Array.isArray(res.product)) {
            allProducts = res.product;
        } else if (Array.isArray(res)) {
            allProducts = res;
        }

        // --- 4. LOGIC LỌC SẢN PHẨM (QUAN TRỌNG) ---
        const filtered = allProducts.filter(p => {
            // TRƯỜNG HỢP 1: Lọc theo cờ isHot (Dựa trên Schema Boolean)
            if (activeSlug === 'hot') {
                return p.isHot === true; 
            }

            // TRƯỜNG HỢP 2: Lọc theo Category Slug (Relation)
            // Backend trả về: p.category = { slug: "game", name: "Game" }
            const pCatSlug = p.category?.slug || ''; 
            
            return pCatSlug === activeSlug;
        });

        setProducts(filtered);

      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <div className="text-xs text-gray-500 mb-1 font-mono">TRANG CHỦ / DANH MỤC</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">{categoryName}</h1>
        </div>
      </div>

      {/* Grid Sản Phẩm */}
      {loading ? (
         <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-vtv-green mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tìm kiếm sản phẩm...</p>
         </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
            <div className="text-6xl mb-4 grayscale opacity-50">📭</div>
            <h3 className="text-lg font-bold text-white">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500 text-sm mt-1">Danh mục này hiện đang được cập nhật thêm.</p>
            <Link to="/" className="mt-6 inline-block bg-vtv-green text-black font-bold px-6 py-2 rounded-lg hover:bg-green-400 transition">
                Về trang chủ
            </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;