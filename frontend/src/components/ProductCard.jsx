import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    amount,
  );

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const minVariant =
    product.variants?.length > 0
      ? product.variants.reduce((prev, curr) =>
          parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr,
        )
      : { price: 0, orginalPrice: 0 };

  const discountPercent =
    minVariant.orginalPrice > minVariant.price
      ? Math.round(
          ((minVariant.orginalPrice - minVariant.price) /
            minVariant.orginalPrice) *
            100,
        )
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, minVariant);
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block h-full">
      {/* Container Chính: Đã bỏ padding p-3, giữ lại bo góc và border */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl h-full flex flex-col justify-between transition-all duration-300 hover:border-vtv-green hover:-translate-y-1 hover:shadow-xl hover:shadow-vtv-green/10 overflow-hidden relative shadow-md">
        {/* --- HEADER: Chứa Ảnh, Tên và Nền Ambient Mới (Khu vực mũi tên chỉ) --- */}
        <div className="relative overflow-hidden p-3">
          {' '}
          {/* Thêm padding p-3 vào đây */}
          {product.thumbnail && (
            <>
              {/* LỚP AMBIENT HEADER: Nền mờ ảo lan tỏa từ ảnh thumbnail */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center blur-xl scale-150 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
                style={{ backgroundImage: `url(${product.thumbnail})` }}
              ></div>
              {/* Lớp phủ tối nhẹ để làm nổi bật chữ và icon trên nền mờ */}
              <div className="absolute inset-0 bg-black/20"></div>
            </>
          )}
          {/* Nội dung Header (Được đẩy nổi lên trên nền mờ) */}
          <div className="flex gap-3 relative z-10">
            {/* KHU VỰC ẢNH ICON (Giữ nguyên hiệu ứng ambient cũ của nó làm điểm nhấn kép) */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg relative border border-slate-700/50 overflow-hidden shadow-sm">
              {product.thumbnail ? (
                <>
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center blur-md scale-150 opacity-60"
                    style={{ backgroundImage: `url(${product.thumbnail})` }}
                  ></div>
                  <div className="absolute inset-0 rounded-lg overflow-hidden z-10">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl bg-slate-800 text-slate-500 rounded-lg">
                  📦
                </div>
              )}
            </div>

            {/* Tên & Danh mục */}
            <div className="flex-1 min-w-0 flex flex-col justify-center drop-shadow-sm">
              <h3
                className="text-white font-bold text-sm leading-tight truncate group-hover:text-vtv-green transition-colors mb-1"
                title={product.name}
              >
                {product.name}
              </h3>
              <p className="text-slate-300 text-[10px] sm:text-xs uppercase tracking-wide truncate font-medium">
                {product.category?.name || 'VTV Key'}
              </p>
            </div>
          </div>
        </div>

        {/* --- FOOTER: Chứa Giá & Action (Nền tối sạch sẽ) --- */}
        {/* Thêm p-3 để bù lại padding đã xóa ở container chính. Thêm nền tối mờ để tách biệt. */}
        <div className="flex items-end justify-between p-3 border-t border-slate-700/50 relative z-10 bg-slate-900/50 backdrop-blur-sm">
          <div className="hidden sm:block bg-slate-800 text-[#a3e635] text-[10px] font-bold px-2 py-1 rounded border border-slate-700">
            KHUYẾN MÃI
          </div>

          <div className="flex items-end gap-3 flex-1 justify-end">
            <div className="text-right">
              {parseFloat(minVariant.orginalPrice) >
                parseFloat(minVariant.price) && (
                <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mb-0.5">
                  <span className="line-through">
                    {formatCurrency(minVariant.orginalPrice)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-red-500 font-bold">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              )}
              <div className="text-white font-bold text-sm sm:text-base leading-none">
                {formatCurrency(minVariant.price)}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:border-vtv-green hover:bg-vtv-green/10 transition-all active:scale-95 bg-slate-900"
              title="Thêm vào giỏ"
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
