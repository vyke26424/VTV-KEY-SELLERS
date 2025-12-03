import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Filter } from 'lucide-react';

// Format tiền tệ
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Component ProductCard (Tái sử dụng code cũ)
const ProductCard = ({ product }) => {
  const minVariant = product.variants?.length > 0 
    ? product.variants.reduce((prev, curr) => parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr) 
    : { price: 0, orginalPrice: 0 };

  const discountPercent = minVariant.orginalPrice > 0
    ? Math.round(((minVariant.orginalPrice - minVariant.price) / minVariant.orginalPrice) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-vtv-card rounded-xl overflow-hidden border border-slate-700 hover:border-vtv-green transition-colors group relative flex flex-col h-full cursor-pointer hover:shadow-lg hover:shadow-green-500/10">
        <div className="h-40 bg-slate-700/50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
          {product.thumbnail ? <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover"/> : '📦'}
        </div>
        
        {discountPercent > 0 && <div className="absolute top-2 right-2 bg-vtv-red text-white text-xs font-bold px-2 py-1 rounded">-{discountPercent}%</div>}
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-white text-sm truncate mb-1">{product.name}</h3>
          <div className="mt-auto">
            {parseFloat(minVariant.orginalPrice) > 0 && (
              <span className="text-gray-500 text-xs line-through block">{formatCurrency(minVariant.orginalPrice)}</span>
            )}
            <div className="flex justify-between items-center mt-2">
              <span className="text-vtv-green font-bold text-lg">{formatCurrency(minVariant.price)}</span>
              <button className="bg-vtv-green hover:bg-green-500 text-black p-2 rounded-lg transition-colors"><ShoppingCart size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategoryPage = () => {
  const { slug } = useParams(); // Lấy slug từ URL (ví dụ: 'steam', 'ai')
  const [products, setProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState('');

  // Cấu hình tên hiển thị cho đẹp
  const categoryNames = {
    'hot': '🔥 SẢN PHẨM HOT TREND',
    'steam': '🎮 GAME STEAM GIÁ RẺ',
    'ai': '🤖 CÔNG CỤ TRÍ TUỆ NHÂN TẠO (AI)',
    'entertainment': '🎬 GIẢI TRÍ & TRUYỀN HÌNH',
  };

  useEffect(() => {
    // 1. Set tên tiêu đề trang
    setCategoryTitle(categoryNames[slug] || 'DANH SÁCH SẢN PHẨM');

    // 2. Mock Data (Giả lập gọi API lấy TOÀN BỘ sản phẩm)
    // Thực tế sau này sẽ gọi: fetch(`http://localhost:3000/products?category=${slug}`)
    const allProducts = [
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
      },
      // Thêm vài data giả để test trang danh mục cho đầy đặn
      {
        id: 6, name: "Youtube Premium", categorySlug: "entertainment", isHot: true,
        variants: [{ id: 601, name: "6 Tháng", price: "150000", orginalPrice: "300000"}]
      },
      {
        id: 7, name: "Black Myth: Wukong", categorySlug: "steam", isHot: true,
        variants: [{ id: 701, name: "Deluxe", price: "1200000", orginalPrice: "1500000"}]
      },
    ];

    // 3. Lọc sản phẩm theo slug
    const filtered = allProducts.filter(p => {
        if (slug === 'hot') return p.isHot;
        return p.categorySlug === slug;
    });

    setProducts(filtered);
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Breadcrumb / Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition">
            <ArrowLeft size={20} className="text-gray-400" />
        </Link>
        <div>
            <div className="text-sm text-gray-500 mb-1">Trang chủ / Danh mục</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white uppercase">{categoryTitle}</h1>
        </div>
      </div>

      {/* Filter & Sort Bar (Để trang trí cho chuyên nghiệp) */}
      <div className="bg-vtv-card border border-slate-700 rounded-lg p-4 mb-8 flex justify-between items-center">
          <span className="text-gray-400 text-sm">Tìm thấy <strong className="text-white">{products.length}</strong> sản phẩm</span>
          <button className="flex items-center gap-2 text-sm text-white bg-slate-700 px-4 py-2 rounded hover:bg-slate-600 transition">
             <Filter size={16}/> Lọc & Sắp xếp
          </button>
      </div>

      {/* Grid Sản Phẩm */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      ) : (
        <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400">Chưa có sản phẩm nào trong danh mục này.</p>
            <Link to="/" className="text-vtv-green hover:underline mt-2 inline-block">Quay lại trang chủ</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;