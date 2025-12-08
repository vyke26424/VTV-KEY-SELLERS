import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Gom import lại cho gọn
import { ShieldCheck, CreditCard, QrCode, ArrowLeft } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore'; // <--- 1. QUAN TRỌNG: Import Auth Store

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  
  // 2. QUAN TRỌNG: Lấy thông tin user đang đăng nhập
  const { user } = useAuthStore(); 

  const [loading, setLoading] = useState(false);

  // Tính tổng tiền
  const totalAmount = cart.reduce((total, item) => total + (parseFloat(item.selectedVariant?.price || item.price) * item.quantity), 0);

  // Xử lý khi bấm nút "Xác nhận thanh toán"
  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Kiểm tra đăng nhập (Logic này giờ đã có biến user để check)
    if (!user) {
        alert("Vui lòng đăng nhập để thanh toán!");
        navigate('/login'); // Chuyển hướng người dùng đi đăng nhập luôn cho tiện
        return;
    }

    setLoading(true);

    // 1. Chuẩn bị dữ liệu đúng chuẩn DTO
    const orderData = {
        userId: user.id,
        totalAmount: totalAmount,
        items: cart.map(item => ({
            variantId: item.selectedVariant?.id || 0,
            quantity: item.quantity,
            price: parseFloat(item.selectedVariant?.price || item.price)
        }))
    };

    try {
        // 2. Gọi API Backend
        const res = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();

        if (res.ok) {
            // 3. Thành công -> Xóa giỏ -> Chuyển trang
            clearCart(); 
            navigate('/success'); 
        } else {
            alert('Lỗi đặt hàng: ' + (data.message || 'Thử lại sau'));
        }

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể kết nối đến Server");
    } finally {
        setLoading(false);
    }
   };

  if (cart.length === 0) return <div className="text-center py-20 text-white">Giỏ hàng trống! <Link to="/" className="text-vtv-green underline">Về trang chủ</Link></div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition">
            <ArrowLeft size={20} className="text-gray-400" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white uppercase">Thanh toán an toàn</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: FORM THÔNG TIN & PHƯƠNG THỨC TT --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Thông tin nhận hàng */}
          <div className="bg-vtv-card border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-vtv-green text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Thông tin nhận Key
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-gray-400 text-sm mb-2">Email nhận hàng (Bắt buộc)</label>
                  {/* Tự động điền email của user vào đây cho xịn */}
                  <input 
                    type="email" 
                    defaultValue={user?.email || ''} 
                    readOnly 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-gray-400 focus:border-vtv-green outline-none cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Key bản quyền sẽ được gửi tự động qua email này.</p>
               </div>
               <div>
                  <label className="block text-gray-400 text-sm mb-2">Số điện thoại (Tùy chọn)</label>
                  <input type="tel" placeholder="0912..." className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-vtv-green outline-none"/>
               </div>
            </div>
          </div>

          {/* 2. Phương thức thanh toán */}
          <div className="bg-vtv-card border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-vtv-green text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Phương thức thanh toán
            </h3>
            
            <div className="space-y-3">
               {/* Option 1: QR Code */}
               <label className="flex items-center justify-between bg-slate-800/50 border border-vtv-green p-4 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full border-4 border-vtv-green bg-white"></div>
                     <div className="flex items-center gap-2 text-white font-bold">
                        <QrCode className="text-vtv-green"/> Chuyển khoản ngân hàng (VietQR)
                     </div>
                  </div>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">Khuyên dùng</span>
               </label>

               {/* Option 2: Ví Momo (Disabled demo) */}
               <label className="flex items-center justify-between bg-slate-900 border border-slate-700 p-4 rounded-lg opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full border border-gray-500"></div>
                     <div className="flex items-center gap-2 text-gray-400 font-bold">
                        <CreditCard/> Ví điện tử Momo / ZaloPay (Bảo trì)
                     </div>
                  </div>
               </label>
            </div>

            {/* Khu vực hiển thị QR Giả lập */}
            <div className="mt-6 bg-white p-4 rounded-xl max-w-sm mx-auto text-center">
               <p className="text-black font-bold mb-2">Quét mã để thanh toán</p>
               <div className="aspect-square bg-gray-200 flex items-center justify-center mb-2 rounded border-2 border-black">
                  <QrCode size={150} className="text-black"/> 
               </div>
               {/* Sửa lại nội dung chuyển khoản cho chuyên nghiệp: VTVKEY + Mã User */}
               <p className="text-sm text-gray-600">Nội dung: <strong className="text-blue-600">VTVKEY {user?.id?.slice(-5).toUpperCase() || 'CODE'}</strong></p>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: TỔNG KẾT --- */}
        <div className="lg:col-span-1">
          <div className="bg-vtv-card border border-slate-700 rounded-xl p-6 sticky top-24 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-4">Đơn hàng của bạn</h3>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
               {cart.map(item => (
                  <div key={item.cartItemId} className="flex justify-between items-start text-sm">
                     <div className="text-gray-300">
                        <span className="text-white font-bold">{item.quantity}x</span> {item.name}
                        <div className="text-xs text-gray-500">{item.selectedVariant?.name}</div>
                     </div>
                     <div className="text-white font-medium">
                        {formatCurrency((item.selectedVariant?.price || item.price) * item.quantity)}
                     </div>
                  </div>
               ))}
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-700">
               <span className="text-white font-bold text-lg">Tổng thanh toán:</span>
               <span className="text-2xl font-bold text-vtv-green">{formatCurrency(totalAmount)}</span>
            </div>

            <button 
               onClick={handlePayment}
               disabled={loading}
               className="w-full bg-vtv-green text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition shadow-lg shadow-green-500/20 mb-4 flex justify-center items-center gap-2"
            >
               {loading ? 'Đang xử lý...' : 'XÁC NHẬN THANH TOÁN'}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
               <ShieldCheck size={16} className="text-green-500"/> Bảo mật SSL 256-bit
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;