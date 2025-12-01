import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, CheckCircle, ShieldCheck, ShoppingCart, User } from 'lucide-react';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null); // State lưu gói đang chọn

  // Mock Data giả lập API trả về chi tiết 1 sản phẩm
  useEffect(() => {
    // Dữ liệu mẫu khớp Prisma schema
    const mockDetail = {
      id: 1,
      name: 'Gemini Advanced: Google AI Premium',
      description: 'Gemini Advanced là gói cao cấp trong Google One AI Premium...',
      thumbnail: null,
      avgRating: 4.9,
      // aiMetadata dùng để hiển thị tính năng
      aiMetadata: {
        features: [
            'Mô hình Ultra 1.5 Pro',
            'Cửa sổ ngữ cảnh 1 triệu token',
            'Tích hợp Google Docs, Drive',
            'Bảo hành trọn đời'
        ]
      },
      // Quan trọng: Mảng các gói
      variants: [
        { id: 10, name: 'Gói 1 Tháng', price: '450000', orginalPrice: '590000' },
        { id: 11, name: 'Gói 6 Tháng', price: '2500000', orginalPrice: '3540000' },
        { id: 12, name: 'Gói 1 Năm', price: '4800000', orginalPrice: '7080000' }
      ],
      reviews: [
        { id: 1, rating: 5, comment: "Ngon bổ rẻ", user: { fullName: "Nguyen Van A" }, createdAt: "2025-01-01" }
      ]
    };

    setProduct(mockDetail);
    // Mặc định chọn gói đầu tiên
    if (mockDetail.variants && mockDetail.variants.length > 0) {
      setSelectedVariant(mockDetail.variants[0]);
    }
  }, [id]);

  if (!product || !selectedVariant) return <div className="text-white text-center mt-10">Đang tải...</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-gray-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 flex items-center justify-between border border-slate-700 shadow-lg relative overflow-hidden">
             <div className="z-10">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Best Seller</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-blue-200">Cam kết bảo hành - Uy tín số 1</p>
             </div>
             <div className="text-9xl z-10">🤖</div>
          </div>

          <div className="bg-vtv-card rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-vtv-green pl-3">Mô tả sản phẩm</h2>
            <p className="leading-relaxed mb-6 whitespace-pre-line">{product.description}</p>
            
            {/* Hiển thị tính năng từ aiMetadata hoặc fix cứng */}
            <h3 className="font-bold text-white mb-3">Tính năng nổi bật:</h3>
            <ul className="space-y-2">
              {product.aiMetadata?.features ? product.aiMetadata.features.map((feat, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-vtv-green" />
                  <span>{feat}</span>
                </li>
              )) : (
                 <li className="text-gray-500">Đang cập nhật tính năng...</li>
              )}
            </ul>
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
                        {product.variants.map((v) => (
                            <button 
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={`p-3 rounded-lg border text-left flex justify-between transition-all ${
                                    selectedVariant.id === v.id 
                                    ? 'border-vtv-green bg-green-900/20 text-white' 
                                    : 'border-slate-600 hover:border-slate-400 text-gray-400'
                                }`}
                            >
                                <span className="font-semibold">{v.name}</span>
                                {/* Hiển thị giá rút gọn trên nút bấm */}
                                <span className={selectedVariant.id === v.id ? 'text-vtv-green' : ''}>
                                    {new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(v.price)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Hiển thị giá theo gói đã chọn */}
                <div className="flex justify-between items-center mb-4">
                   <span className="text-gray-400">Giá gốc:</span>
                   <span className="line-through text-gray-500">{formatCurrency(selectedVariant.orginalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                   <span className="text-white font-bold text-lg">Tổng cộng:</span>
                   <span className="text-3xl font-bold text-vtv-green">{formatCurrency(selectedVariant.price)}</span>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mb-3 shadow-lg shadow-blue-500/20 transition-all">
                   MUA NGAY ({selectedVariant.name})
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                   <ShoppingCart size={18}/> Thêm vào giỏ
                </button>

                <div className="mt-6 pt-6 border-t border-slate-700 space-y-3 text-sm text-gray-400">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-green-500"/> 
                      <span>Bảo hành trọn đời gói {selectedVariant.name}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500"/> 
                      <span>Stock Status: <span className="text-vtv-green font-bold">Sẵn sàng</span></span>
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