import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, ShieldCheck, ShoppingCart, AlertCircle, Loader } from 'lucide-react';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ProductDetail = () => {
  const { id } = useParams(); // id ở đây có thể là số (1) hoặc slug (netflix-premium)
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cấu hình URL API (Sửa port nếu backend bạn chạy khác port 3000)
  const API_URL = 'http://localhost:3000'; 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Gọi API Backend
        const response = await fetch(`${API_URL}/products/${id}`);
        
        if (!response.ok) {
            throw new Error('Không tìm thấy sản phẩm');
        }

        const data = await response.json();

        // Xử lý dữ liệu trả về để khớp với giao diện
        // Backend trả về variants, nhưng ta cần đảm bảo price là số để formatCurrency chạy đúng
        const processedProduct = {
            ...data,
            variants: data.variants.map(v => ({
                ...v,
                price: Number(v.price), // Chuyển Decimal string sang Number
                orginalPrice: Number(v.orginalPrice),
                // Backend trả về trường 'stock' (do ta đã custom trong service)
                stock: v.stock 
            }))
        };

        setProduct(processedProduct);

        // Logic chọn gói mặc định: Chọn gói đầu tiên CÒN HÀNG
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

  // --- TRẠNG THÁI LOADING & ERROR ---
  if (loading) return (
    <div className="flex justify-center items-center h-screen text-white">
        <Loader className="animate-spin mr-2"/> Đang tải dữ liệu...
    </div>
  );

  if (error || !product) return (
    <div className="text-center mt-20 text-red-400">
        <h2 className="text-2xl font-bold">Lỗi!</h2>
        <p>{error || 'Sản phẩm không tồn tại.'}</p>
    </div>
  );

  // Biến kiểm tra hết hàng
  const isOutOfStock = selectedVariant?.stock === 0;

  return (
    <div className="container mx-auto px-4 py-8 text-gray-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: THÔNG TIN --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 flex items-center justify-between border border-slate-700 shadow-lg relative overflow-hidden">
             <div className="z-10">
                {product.isHot && <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">HOT</span>}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-blue-200">Danh mục: {product.category?.name}</p>
             </div>
             {/* Nếu có thumbnail thật thì hiện ảnh, không thì hiện icon */}
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
            
            {/* Hiển thị tính năng từ JSON aiMetadata */}
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
                
                {/* Nút Mua */}
                {isOutOfStock ? (
                    <button disabled className="w-full bg-slate-600 text-gray-400 font-bold py-3 rounded-lg mb-3 cursor-not-allowed flex justify-center items-center gap-2">
                       <AlertCircle size={20}/> TẠM HẾT HÀNG
                    </button>
                ) : (
                    <>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mb-3 shadow-lg shadow-blue-500/20 transition-all">
                           MUA NGAY ({selectedVariant?.name})
                        </button>
                        <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                           <ShoppingCart size={18}/> Thêm vào giỏ
                        </button>
                    </>
                )}

                {/* Footer thông tin */}
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