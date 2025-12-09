import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate } from 'react-router-dom'; // Note: Thêm useNavigate để chuyển trang
=======
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useNavigate
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
import { CheckCircle, ShieldCheck, ShoppingCart, AlertCircle, Loader } from 'lucide-react';
import useCartStore from '../store/useCartStore'; // <--- 1. Import Store Giỏ hàng
import useAuthStore from '../store/useAuthStore'; // <--- 2. Import Store Auth

// --- IMPORT STORE ---
import useCartStore from '../store/useCartStore'; // Note: Lấy hàm thêm giỏ hàng
import useAuthStore from '../store/useAuthStore'; // Note: Lấy trạng thái đăng nhập

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ProductDetail = () => {
  const { id } = useParams();
<<<<<<< HEAD
  const navigate = useNavigate(); // Hook dùng để chuyển hướng trang (redirect)

  // --- KẾT NỐI VỚI ZUSTAND STORE ---
  const addToCart = useCartStore((state) => state.addToCart); // Lấy hàm addToCart từ store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Kiểm tra xem user đã login chưa
=======
  const navigate = useNavigate(); // Hook để chuyển trang

  // --- KẾT NỐI STORE ---
  const addToCart = useCartStore((state) => state.addToCart); // Hàm thêm vào giỏ
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Trạng thái đăng nhập
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000'; 

<<<<<<< HEAD
  // --- HÀM 1: XỬ LÝ THÊM VÀO GIỎ HÀNG ---
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    // Gọi hàm từ Store để lưu vào LocalStorage/State
    addToCart(product, selectedVariant);
    
    // Thông báo cho người dùng biết
    alert(`Đã thêm "${product.name} - ${selectedVariant.name}" vào giỏ hàng!`);
  };

  // --- HÀM 2: XỬ LÝ MUA NGAY ---
  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;

    // Bước 1: Kiểm tra đăng nhập
    if (!isAuthenticated) {
        // Note: Nếu chưa đăng nhập -> Hỏi user và chuyển qua trang Login
        if (window.confirm("Bạn cần đăng nhập để mua hàng. Chuyển đến trang đăng nhập ngay?")) {
            navigate('/login');
        }
        return; // Dừng lại, không làm gì tiếp
    }

    // Bước 2: Nếu đã đăng nhập
    // -> Thêm sản phẩm vào giỏ hàng trước (để trang Checkout có dữ liệu mà hiển thị)
=======
  // --- LOGIC: THÊM VÀO GIỎ HÀNG ---
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    // Gọi hàm từ Store (file useCartStore.js của bạn đã viết rất chuẩn rồi)
    addToCart(product, selectedVariant);
    
    // Thông báo nhỏ cho người dùng biết
    //alert(`Đã thêm "${product.name} - ${selectedVariant.name}" vào giỏ hàng!`);
  };

  // --- LOGIC: MUA NGAY ---
  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;

    // 1. Kiểm tra đăng nhập
    if (!isAuthenticated) {
        // Nếu chưa đăng nhập -> Đẩy qua trang Login
        // Mẹo: Bạn có thể lưu lại url hiện tại để login xong quay lại đây (nâng cao), 
        // nhưng hiện tại cứ đẩy về login đơn giản trước.
        if (window.confirm("Bạn cần đăng nhập để mua hàng. Chuyển đến trang đăng nhập ngay?")) {
            navigate('/login');
        }
        return;
    }

    // 2. Nếu đã đăng nhập
    // -> Thêm sản phẩm vào giỏ hàng trước (để trang Checkout có dữ liệu mà render)
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
    addToCart(product, selectedVariant);

    // -> Chuyển hướng thẳng sang trang Thanh toán
    navigate('/checkout');
  };

<<<<<<< HEAD
  // --- GỌI API LẤY CHI TIẾT SẢN PHẨM ---
=======
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
<<<<<<< HEAD
        // Note: Gọi API public, không cần Token
=======
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
        const response = await fetch(`${API_URL}/products/${id}`);
        
        if (!response.ok) {
            throw new Error('Không tìm thấy sản phẩm');
        }

        const data = await response.json();

<<<<<<< HEAD
        // Note: Xử lý dữ liệu trả về (ép kiểu số cho giá tiền)
=======
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
        const processedProduct = {
            ...data,
            variants: data.variants.map(v => ({
                ...v,
<<<<<<< HEAD
                price: Number(v.price), // Chuyển string 'Decimal' sang Number
                orginalPrice: Number(v.orginalPrice),
                stock: v.stock // Số lượng tồn kho
=======
                price: Number(v.price),
                orginalPrice: Number(v.orginalPrice),
                stock: v.stock 
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
            }))
        };

        setProduct(processedProduct);

<<<<<<< HEAD
        // Note: Tự động chọn gói đầu tiên mà CÒN HÀNG (stock > 0)
=======
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
        if (processedProduct.variants && processedProduct.variants.length > 0) {
            const availableVariant = processedProduct.variants.find(v => v.stock > 0);
            setSelectedVariant(availableVariant || processedProduct.variants[0]);
        }
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchProduct();
    }
  }, [id]);

<<<<<<< HEAD
  // --- GIAO DIỆN LOADING ---
=======
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
  if (loading) return (
    <div className="flex justify-center items-center h-screen text-white">
        <Loader className="animate-spin mr-2"/> Đang tải dữ liệu...
    </div>
  );

  // --- GIAO DIỆN LỖI ---
  if (error || !product) return (
    <div className="text-center mt-20 text-red-400">
        <h2 className="text-2xl font-bold">Lỗi!</h2>
        <p>{error || 'Sản phẩm không tồn tại.'}</p>
    </div>
  );

<<<<<<< HEAD
  // Note: Biến kiểm tra nhanh xem gói đang chọn có hết hàng không
=======
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
  const isOutOfStock = selectedVariant?.stock === 0;

  return (
    <div className="container mx-auto px-4 py-8 text-gray-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
<<<<<<< HEAD
        {/* --- CỘT TRÁI: THÔNG TIN SẢN PHẨM (Giữ nguyên) --- */}
=======
        {/* --- CỘT TRÁI (Giữ nguyên) --- */}
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 flex items-center justify-between border border-slate-700 shadow-lg relative overflow-hidden">
             <div className="z-10">
                {product.isHot && <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">HOT</span>}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-blue-200">Danh mục: {product.category?.name}</p>
             </div>
             <div className="z-10">
                {product.thumbnail && !product.thumbnail.includes('svg') ? (
                    <img src={product.thumbnail} alt={product.name} className="h-32 w-32 object-contain drop-shadow-lg" />
                ) : (
                    <div className="text-9xl">🤖</div>
                )}
             </div>
          </div>

          <div className="bg-vtv-card rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-vtv-green pl-3">Mô tả sản phẩm</h2>
            <p className="leading-relaxed mb-6 whitespace-pre-line">{product.description || 'Chưa có mô tả chi tiết.'}</p>
            
            {product.aiMetadata?.features && (
                <>
                    <h3 className="font-bold text-white mb-3">Tính năng nổi bật:</h3>
                    <ul className="space-y-2">
                    {product.aiMetadata.features.map((feat, index) => (
                        <li key={index} className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-vtv-green" />
                        <span>{feat}</span>
                        </li>
                    ))}
                    </ul>
                </>
            )}
          </div>
        </div>

        {/* --- CỘT PHẢI: THANH TOÁN & CHỌN GÓI --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
             <div className="bg-vtv-card rounded-xl p-6 border border-slate-700 shadow-xl">
                
                {/* Khu vực chọn Variant */}
                <div className="mb-6">
                    <label className="text-sm text-gray-400 font-bold mb-2 block uppercase">Chọn gói dịch vụ:</label>
                    <div className="grid grid-cols-1 gap-2">
                        {product.variants.map((v) => {
                            const isVariantOutOfStock = v.stock === 0;
                            return (
                                <button 
                                    key={v.id}
                                    onClick={() => setSelectedVariant(v)}
                                    className={`p-3 rounded-lg border text-left flex justify-between transition-all ${
                                        selectedVariant.id === v.id 
                                        ? 'border-vtv-green bg-green-900/20 text-white' 
                                        : 'border-slate-600 hover:border-slate-400 text-gray-400'
                                    } ${isVariantOutOfStock ? 'opacity-60 bg-slate-800' : ''}`}
                                >
                                    <div>
                                        <span className="font-semibold">{v.name}</span>
                                        {isVariantOutOfStock && (
                                            <span className="ml-2 text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded border border-red-500/50">
                                                Hết key
                                            </span>
                                        )}
                                    </div>
                                    <span className={selectedVariant.id === v.id ? 'text-vtv-green' : ''}>
                                        {new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(v.price)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Giá tiền */}
                {selectedVariant && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400">Giá gốc:</span>
                            <span className="line-through text-gray-500">{formatCurrency(selectedVariant.orginalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-white font-bold text-lg">Tổng cộng:</span>
                            <span className={`text-3xl font-bold ${isOutOfStock ? 'text-gray-500' : 'text-vtv-green'}`}>
                                    {formatCurrency(selectedVariant.price)}
                            </span>
                        </div>
                    </>
                )}
                
<<<<<<< HEAD
                {/* --- KHU VỰC NÚT BẤM (ĐÃ GẮN LOGIC) --- */}
=======
                {/* --- NÚT BẤM ĐÃ ĐƯỢC KÍCH HOẠT --- */}
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
                {isOutOfStock ? (
                    // Trường hợp Hết hàng: Khóa nút
                    <button disabled className="w-full bg-slate-600 text-gray-400 font-bold py-3 rounded-lg mb-3 cursor-not-allowed flex justify-center items-center gap-2">
                       <AlertCircle size={20}/> TẠM HẾT HÀNG
                    </button>
                ) : (
                    // Trường hợp Còn hàng
                    <>
<<<<<<< HEAD
                        {/* NÚT MUA NGAY -> Gọi handleBuyNow */}
=======
                        {/* NÚT MUA NGAY: Gắn hàm handleBuyNow */}
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
                        <button 
                            onClick={handleBuyNow}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mb-3 shadow-lg shadow-blue-500/20 transition-all"
                        >
                           MUA NGAY ({selectedVariant?.name})
                        </button>
                        
<<<<<<< HEAD
                        {/* NÚT THÊM GIỎ HÀNG -> Gọi handleAddToCart */}
=======
                        {/* NÚT GIỎ HÀNG: Gắn hàm handleAddToCart */}
>>>>>>> parent of c81af72 (Revert "Fix Product Detail Phong Bat")
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                           <ShoppingCart size={18}/> Thêm vào giỏ
                        </button>
                    </>
                )}

                <div className="mt-6 pt-6 border-t border-slate-700 space-y-3 text-sm text-gray-400">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-green-500"/> 
                      <span>Bảo hành trọn đời</span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                      {isOutOfStock ? (
                          <>
                             <AlertCircle size={16} className="text-red-500"/> 
                             <span>Trạng thái: <span className="text-red-500 font-bold">Hết hàng</span></span>
                          </>
                      ) : (
                          <>
                             <CheckCircle size={16} className="text-green-500"/> 
                             <span>Kho: <span className="text-vtv-green font-bold">Còn {selectedVariant?.stock} key</span></span>
                          </>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;