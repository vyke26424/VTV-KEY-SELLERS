import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck } from 'lucide-react';
import useCartStore from '../store/useCartStore';

// Format tiền tệ
const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    amount,
  );

const CartPage = () => {
  // Lấy dữ liệu và các hàm từ Store
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  // Tính tổng tiền
  const totalAmount = cart.reduce((total, item) => {
    // Giá item * số lượng
    return (
      total +
      parseFloat(item.selectedVariant?.price || item.price) * item.quantity
    );
  }, 0);

  // Giao diện khi giỏ hàng TRỐNG
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-slate-800/50 rounded-2xl p-10 max-w-2xl mx-auto border border-dashed border-slate-700">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Giỏ hàng đang trống
          </h2>
          <p className="text-gray-400 mb-6">
            Bạn chưa thêm sản phẩm nào. Hãy dạo một vòng xem sao nhé!
          </p>
          <Link
            to="/"
            className="bg-vtv-green text-black font-bold px-6 py-3 rounded-full hover:bg-green-400 transition inline-block"
          >
            Quay lại mua sắm
          </Link>
        </div>
      </div>
    );
  }

  // Giao diện khi CÓ HÀNG
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition"
        >
          <ArrowLeft size={20} className="text-gray-400" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white uppercase">
          Giỏ hàng của bạn ({cart.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-vtv-card border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center"
            >
              {/* Ảnh sản phẩm */}
              <div className="w-24 h-24 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    📦
                  </div>
                )}
              </div>

              {/* Thông tin */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-white font-bold text-lg">{item.name}</h3>
                <div className="text-sm text-vtv-green font-medium mb-1">
                  Phân loại: {item.selectedVariant?.name || 'Mặc định'}
                </div>
                <div className="text-gray-400 text-sm">
                  Đơn giá:{' '}
                  {formatCurrency(item.selectedVariant?.price || item.price)}
                </div>
              </div>

              {/* Bộ điều khiển số lượng */}
              <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1">
                <button
                  onClick={() => updateQuantity(item.cartItemId, 'decrease')}
                  className="p-1 hover:text-white text-gray-400 transition disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="text-white font-bold w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.cartItemId, 'increase')}
                  className="p-1 hover:text-white text-gray-400 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Thành tiền & Nút xóa */}
              <div className="flex flex-col items-end gap-2 min-w-[100px]">
                <span className="text-white font-bold text-lg">
                  {formatCurrency(
                    (item.selectedVariant?.price || item.price) * item.quantity,
                  )}
                </span>
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1 transition"
                >
                  <Trash2 size={14} /> Xóa
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-gray-500 hover:text-white text-sm underline mt-2"
          >
            Xóa tất cả sản phẩm
          </button>
        </div>

        {/* --- CỘT PHẢI: TỔNG KẾT --- */}
        <div className="lg:col-span-1">
          <div className="bg-vtv-card border border-slate-700 rounded-xl p-6 sticky top-24 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
              Tóm tắt đơn hàng
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Tạm tính:</span>
                <span className="text-white font-medium">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Giảm giá:</span>
                <span className="text-vtv-green font-medium">-0đ</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-700">
              <span className="text-white font-bold text-lg">Tổng cộng:</span>
              <span className="text-3xl font-bold text-vtv-green">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-vtv-green text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition shadow-lg shadow-green-500/20 mb-4 text-center"
            >
              THANH TOÁN NGAY
            </Link>

            <div className="flex items-start gap-3 text-xs text-gray-500 bg-slate-800 p-3 rounded-lg">
              <ShieldCheck size={20} className="text-green-500 flex-shrink-0" />
              <p>
                Đơn hàng được bảo vệ bởi chính sách hoàn tiền 100% nếu sản phẩm
                lỗi. Thanh toán an toàn và bảo mật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
