import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, CheckCircle, ShieldCheck, ShoppingCart, User } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL (để sau này gọi API chi tiết)

  // Dữ liệu giả lập chi tiết cho giống hình (Sau này lấy từ DB)
  const product = {
    name: 'Gemini Advanced: Google AI Premium',
    price: '450.000đ',
    originalPrice: '590.000đ',
    description: 'Gemini Advanced là gói cao cấp trong Google One AI Premium, mở khóa mô hình cấp cao (Ultra 1.5 Pro) với cửa sổ ngữ cảnh lớn lên tới 1 triệu token. Cho phép đọc và phân tích tệp tin lớn như PDF dài hàng nghìn trang.',
    features: [
      'Mô hình Ultra 1.5 Pro thông minh nhất',
      'Cửa sổ ngữ cảnh 1 triệu token',
      'Tích hợp sâu vào Google Docs, Gmail, Drive',
      'Bảo hành trọn đời gói mua'
    ],
    reviews: [
      { user: 'nguyenhai1985', date: '2025-04-25', rating: 5, comment: 'Mua hàng ở đây rất yên tâm, nhân viên hỗ trợ nhiệt tình.' },
      { user: 'minhtrang91', date: '2025-04-10', rating: 5, comment: 'Đã mua nhiều lần và lần nào cũng hài lòng.' },
      { user: 'vuthao92', date: '2025-02-23', rating: 5, comment: 'Giao diện dễ sử dụng, thanh toán tiện lợi.' },
      { user: 'phamho1985', date: '2025-06-19', rating: 4, comment: 'Rất hài lòng với dịch vụ. Chắc chắn sẽ quay lại.' },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: THÔNG TIN CHÍNH (Chiếm 2 phần) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Banner Sản Phẩm */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 flex items-center justify-between border border-slate-700 shadow-lg relative overflow-hidden">
             <div className="z-10">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Best Seller</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-blue-200">Nâng cấp chính chủ - Bảo hành 1 đổi 1</p>
             </div>
             <div className="text-9xl z-10">🤖</div>
             {/* Glow effect */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 blur-[100px] rounded-full"></div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="bg-vtv-card rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-vtv-green pl-3">Mô tả sản phẩm</h2>
            <p className="leading-relaxed mb-6">{product.description}</p>
            
            <h3 className="font-bold text-white mb-3">Tính năng nổi bật:</h3>
            <ul className="space-y-2">
              {product.features.map((feat, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-vtv-green" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Đánh giá khách hàng (Review Grid) */}
          <div className="bg-vtv-card rounded-xl p-6 border border-slate-700">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white border-l-4 border-vtv-green pl-3">Khách hàng nói gì về chúng tôi?</h2>
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
                   <span>4.9/5</span>
                   <div className="flex"><Star fill="currentColor" size={20}/><Star fill="currentColor" size={20}/><Star fill="currentColor" size={20}/><Star fill="currentColor" size={20}/><Star fill="currentColor" size={20}/></div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-4">
                {product.reviews.map((rev, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 hover:border-slate-600 transition">
                    <div className="flex justify-between items-start mb-2">
                       <div className="font-bold text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><User size={16}/></div>
                          {rev.user}
                       </div>
                       <div className="flex text-yellow-400 text-xs">
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                       </div>
                    </div>
                    <p className="text-sm text-gray-400 italic">"{rev.comment}"</p>
                    <div className="text-xs text-slate-500 mt-2 text-right">{rev.date}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: THANH TOÁN (Sidebar sticky) --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
             {/* Card giá tiền */}
             <div className="bg-vtv-card rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-gray-400">Giá gốc:</span>
                   <span className="line-through text-gray-500">{product.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                   <span className="text-white font-bold text-lg">Tổng cộng:</span>
                   <span className="text-3xl font-bold text-vtv-green">{product.price}</span>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mb-3 shadow-lg shadow-blue-500/20 transition-all">
                   MUA NGAY
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                   <ShoppingCart size={18}/> Thêm vào giỏ
                </button>

                <div className="mt-6 pt-6 border-t border-slate-700 space-y-3 text-sm text-gray-400">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-green-500"/> 
                      <span>Bảo hành uy tín trọn đời</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500"/> 
                      <span>Giao hàng tự động qua Email</span>
                   </div>
                </div>
             </div>

             {/* Sản phẩm liên quan nhỏ */}
             <div className="bg-vtv-card rounded-xl p-4 border border-slate-700">
                <h3 className="font-bold text-white mb-4 text-sm uppercase">Sản phẩm liên quan</h3>
                <div className="space-y-3">
                   <div className="flex gap-3 items-center hover:bg-slate-800 p-2 rounded cursor-pointer transition">
                      <div className="w-10 h-10 bg-green-900 rounded flex items-center justify-center text-xl">🤖</div>
                      <div>
                         <div className="text-white text-sm font-medium">ChatGPT Plus</div>
                         <div className="text-vtv-green text-xs font-bold">450.000đ</div>
                      </div>
                   </div>
                   <div className="flex gap-3 items-center hover:bg-slate-800 p-2 rounded cursor-pointer transition">
                      <div className="w-10 h-10 bg-purple-900 rounded flex items-center justify-center text-xl">🎨</div>
                      <div>
                         <div className="text-white text-sm font-medium">Midjourney</div>
                         <div className="text-vtv-green text-xs font-bold">200.000đ</div>
                      </div>
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