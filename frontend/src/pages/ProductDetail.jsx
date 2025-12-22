/* FILE: frontend/src/pages/ProductDetail.jsx */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  ShieldCheck,
  ShoppingCart,
  AlertCircle,
  Loader,
  ArrowLeft,
  Star,
  Zap,
  ChevronDown, // Import thêm icon
  ChevronUp,   // Import thêm icon
} from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../store/axiosClient';
import ProductCard from '../components/ProductCard';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    amount,
  );

const ProductDetail = () => {
  const { id, slug } = useParams();
  const currentParam = slug || id;
  const navigate = useNavigate();
  
  // Store
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user); // Lấy thông tin User để log ID

  // State
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // State cho tính năng "Xem thêm"
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasLoggedReadMore, setHasLoggedReadMore] = useState(false);

  // 1. FETCH DATA & LOG VIEW
  useEffect(() => {
    const fetchProductData = async () => {
      if (!currentParam) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axiosClient.get('/products', {
          params: { limit: 100 },
        });
        
        let list = Array.isArray(res.product) ? res.product : Array.isArray(res) ? res : [];
        const found = list.find((p) => p.slug == currentParam || p.id == currentParam);

        if (!found) throw new Error('Không tìm thấy sản phẩm');

        // Xử lý dữ liệu Variants
        const processedProduct = {
          ...found,
          variants: found.variants
            .map((v) => ({
              ...v,
              price: Number(v.price),
              orginalPrice: Number(v.orginalPrice),
              stock: v.stock || 0,
            }))
            .sort((a, b) => a.price - b.price),
        };

        setProduct(processedProduct);

        // Chọn variant mặc định
        if (processedProduct.variants?.length > 0) {
          const available = processedProduct.variants.find((v) => v.stock > 0);
          setSelectedVariant(available || processedProduct.variants[0]);
        }

        // Lấy sản phẩm liên quan
        if (found.categoryId) {
          setRelatedProducts(
            list.filter((p) => p.categoryId === found.categoryId && p.id !== found.id).slice(0, 4),
          );
        }

        // --- LOG VIEW (Ghi nhận lượt xem) ---
        if (user?.id) {
            axiosClient.post('/interactions/log', {
                userId: user.id,
                productId: found.id,
                type: 'VIEW'
            }).catch(err => console.error("Log View Error:", err));
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [currentParam, user]); // Thêm user vào deps để đảm bảo log đúng user

  // 2. XỬ LÝ LOG "READ_MORE"
  const handleToggleDescription = () => {
    // Nếu đang chuẩn bị mở ra (Expand) VÀ chưa từng log lần nào
    if (!isExpanded && !hasLoggedReadMore && user?.id && product?.id) {
        axiosClient.post('/interactions/log', {
            userId: user.id,
            productId: product.id,
            type: 'READ_MORE'
        }).then(() => console.log("Logged READ_MORE score"));
        
        setHasLoggedReadMore(true); // Đánh dấu đã log
    }
    setIsExpanded(!isExpanded);
  };

  // 3. XỬ LÝ LOG "ADD_TO_CART"
  const logAddToCart = () => {
      if (user?.id && product?.id) {
          axiosClient.post('/interactions/log', {
              userId: user.id,
              productId: product.id,
              type: 'ADD_TO_CART'
          }).catch(err => console.error("Log AddToCart Error:", err));
      }
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addToCart(product, selectedVariant);
    logAddToCart(); // Gọi hàm log
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;
    if (!isAuthenticated) {
      if (window.confirm('Bạn cần đăng nhập để mua hàng. Đến trang đăng nhập ngay?'))
        navigate('/login');
      return;
    }
    addToCart(product, selectedVariant);
    logAddToCart(); // Gọi hàm log
    navigate('/checkout');
  };

  // --- RENDER UI ---

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <Loader className="animate-spin mr-2 text-vtv-green" /> Đang tải...
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-2">Opps! 😓</h2>
        <p>{error}</p>
      </div>
    );

  const isOutOfStock = selectedVariant?.stock === 0;
  const discountPercent =
    selectedVariant && selectedVariant.orginalPrice > selectedVariant.price
      ? Math.round(((selectedVariant.orginalPrice - selectedVariant.price) / selectedVariant.orginalPrice) * 100)
      : 0;

  return (
    <div className="min-h-screen text-gray-300 pb-20 font-inter">
      {/* BREADCRUMB */}
      <div className="container mx-auto px-4 py-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-white flex items-center gap-1">
          <ArrowLeft size={14} /> Trang chủ
        </Link>
        <span>/</span>
        <span className="text-gray-400">{product.category?.name}</span>
        <span>/</span>
        <span className="text-white truncate">{product.name}</span>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI: ẢNH & INFO */}
        <div className="lg:col-span-8 space-y-6">
          {/* HEADER: DYNAMIC AMBIENT BACKGROUND */}
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center border border-white/10">
            {/* Lớp nền Ambient */}
            {product.thumbnail && (
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl scale-150 opacity-60"
                style={{ backgroundImage: `url(${product.thumbnail})` }}
              ></div>
            )}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Ảnh sản phẩm */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 relative z-10 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 p-4 shadow-xl">
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
              )}
              {product.isHot && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce">
                  HOT
                </div>
              )}
            </div>

            <div className="relative z-10 text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight text-shadow-md">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-white mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
                  {product.category?.name}
                </span>
                <span className="flex items-center gap-1 bg-green-500/80 text-white px-2 py-1 rounded border border-white/20 text-xs font-bold animate-pulse shadow-sm">
                  <Zap size={12} fill="currentColor" /> Giao ngay
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <Star size={14} className="text-yellow-400" fill="currentColor" /> 5.0
                </span>
              </div>
            </div>
          </div>

          {/* MÔ TẢ - ĐÃ CẬP NHẬT TÍNH NĂNG "XEM THÊM" */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {product.aiMetadata?.features && (
              <div className="mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Zap size={18} className="text-yellow-400" /> Tính năng nổi bật
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.aiMetadata.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 p-2 rounded-lg text-sm text-gray-300">
                      <CheckCircle size={16} className="text-vtv-green shrink-0" /> {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* PHẦN MÔ TẢ CÓ NÚT XEM THÊM */}
            <div>
              <h3 className="text-white font-bold mb-3 border-l-4 border-vtv-green pl-3">
                Mô tả chi tiết
              </h3>
              
              <div className={`prose prose-invert max-w-none text-sm leading-relaxed text-gray-300 whitespace-pre-line overflow-hidden transition-all duration-500 ease-in-out relative ${isExpanded ? 'max-h-full' : 'max-h-[200px]'}`}>
                {product.description || 'Đang cập nhật mô tả...'}
                
                {/* Lớp phủ mờ khi chưa mở */}
                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
                )}
              </div>

              {/* Nút Toggle */}
              <div className="mt-4 flex justify-center">
                  <button 
                      onClick={handleToggleDescription}
                      className="group px-5 py-2 rounded-full border border-slate-700 bg-slate-800 hover:bg-vtv-green hover:text-black hover:border-vtv-green transition-all duration-300 font-bold text-sm flex items-center gap-2 shadow-lg"
                  >
                      {isExpanded ? (
                          <>Thu gọn <ChevronUp size={16} className="group-hover:-translate-y-1 transition-transform"/></>
                      ) : (
                          <>Xem thêm mô tả <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform"/></>
                      )}
                  </button>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THANH TOÁN (Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl ring-1 ring-white/5">
            {/* CHỌN GÓI */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 font-bold mb-3 block uppercase tracking-wider">
                Chọn gói dịch vụ
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isVOutOfStock = v.stock === 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full p-3 rounded-lg border text-left flex justify-between items-center transition-all ${
                        isSelected
                          ? 'border-vtv-green bg-green-900/10 text-white shadow-sm ring-1 ring-vtv-green/50'
                          : 'border-slate-700 hover:border-slate-500 text-gray-400 bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{v.name}</span>
                        {isVOutOfStock && (
                          <span className="text-[10px] bg-red-900/50 text-red-400 border border-red-700 px-1.5 py-0.5 rounded">
                            Hết key
                          </span>
                        )}
                      </div>
                      <span className={isSelected ? 'text-vtv-green font-bold' : ''}>
                        {new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(v.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GIÁ TIỀN */}
            {selectedVariant && (
              <div className="py-4 border-t border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm">Giá gốc:</span>
                  <span className="line-through text-gray-600 text-sm">
                    {formatCurrency(selectedVariant.orginalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-white font-bold text-lg">Thành tiền:</span>
                  <div className="text-right">
                    <span className={`text-3xl font-black block leading-none ${isOutOfStock ? 'text-gray-500' : 'text-vtv-green'}`}>
                      {formatCurrency(selectedVariant.price)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-red-500 text-xs font-bold bg-red-500/10 px-1 rounded">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* NÚT MUA */}
            <div className="mt-2 space-y-3">
              {isOutOfStock ? (
                <button disabled className="w-full bg-slate-800 text-gray-500 font-bold py-3.5 rounded-xl cursor-not-allowed flex justify-center items-center gap-2 border border-slate-700">
                  <AlertCircle size={20} /> TẠM HẾT HÀNG
                </button>
              ) : (
                <>
                  <button onClick={handleBuyNow} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2 group">
                    <Zap size={20} className="fill-white group-hover:scale-110 transition-transform" /> MUA NGAY
                  </button>
                  <button onClick={handleAddToCart} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 hover:border-slate-500">
                    <ShoppingCart size={18} /> Thêm vào giỏ
                  </button>
                </>
              )}
            </div>

            {/* THÔNG TIN KHO */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-500" />
                <span>Bảo hành trọn đời</span>
              </div>
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <>
                    <AlertCircle size={16} className="text-red-500" />
                    <span>Trạng thái: <span className="text-red-500 font-bold">Hết hàng</span></span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Kho: <span className="text-vtv-green font-bold">Còn {selectedVariant?.stock} key</span></span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SẢN PHẨM LIÊN QUAN */}
      <div className="container mx-auto px-4 mt-16">
        <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-3">
          Sản phẩm tương tự
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="text-gray-500 text-sm">Chưa có sản phẩm liên quan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;