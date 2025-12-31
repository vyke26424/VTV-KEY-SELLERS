import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart, Zap } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../store/axiosClient';

// --- COMPONENT CARD RIÊNG BIỆT ---
const ContextAwareCard = ({ product, handleAddToCart, formatCurrency }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const contentOffsetX = e.clientX - rect.left - rect.width / 2;
    const contentOffsetY = e.clientY - rect.top - rect.height / 2;
    x.set(contentOffsetX / 2);
    y.set(contentOffsetY / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Logic tính giá
  const getDiscountPercent = (variant) => {
    if (
      variant &&
      parseFloat(variant.orginalPrice) > parseFloat(variant.price)
    ) {
      return Math.round(
        ((parseFloat(variant.orginalPrice) - parseFloat(variant.price)) /
          parseFloat(variant.orginalPrice)) *
          100,
      );
    }
    return 0;
  };

  const minVariant =
    product.variants?.length > 0
      ? product.variants.reduce((best, curr) => {
          const bestDisc = getDiscountPercent(best);
          const currDisc = getDiscountPercent(curr);
          return currDisc > bestDisc
            ? curr
            : currDisc === bestDisc &&
                parseFloat(curr.price) < parseFloat(best.price)
              ? curr
              : best;
        }, product.variants[0])
      : { price: 0, orginalPrice: 0 };

  const discountPercent = getDiscountPercent(minVariant);

  return (
    <div className="min-w-[20%] max-w-[20%] p-3 h-full relative z-0 hover:z-50 transition-all duration-300">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group/card relative h-full bg-slate-800/80 backdrop-blur-sm border-2 border-slate-600 rounded-2xl overflow-hidden flex flex-col hover:scale-105 hover:border-vtv-green hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
      >
        {/* Context Aware Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-2xl">
          <motion.div
            style={{ x: mouseX, y: mouseY }}
            className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
          >
            <img
              src={product.thumbnail}
              alt="Glow"
              className="w-full h-full object-cover blur-[50px] scale-150 opacity-40"
            />
          </motion.div>
        </div>

        {/* Nội dung Card */}
        <div className="relative z-10 flex flex-col h-full">
          <Link
            to={`/product/${product.slug}`}
            className="block relative w-full pt-[100%] bg-slate-900 overflow-hidden"
          >
            <img
              src={product.thumbnail}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
            />
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg z-10 animate-[bounce_2s_infinite]">
              HOT
            </div>
          </Link>

          <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-transparent to-slate-900/95">
            <h3
              className="text-white font-bold text-sm line-clamp-2 mb-3 h-10 overflow-hidden group-hover/card:text-vtv-green transition-colors"
              title={product.name}
            >
              {product.name}
            </h3>

            <div className="mt-auto flex justify-between items-end">
              <div className="flex flex-col">
                {parseFloat(minVariant.orginalPrice) >
                  parseFloat(minVariant.price) && (
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatCurrency(minVariant.orginalPrice)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-[10px] text-red-500 font-bold">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                )}
                <span className="text-vtv-green font-black text-lg leading-none">
                  {formatCurrency(minVariant.price)}
                </span>
              </div>

              <button
                onClick={(e) => handleAddToCart(e, product, minVariant)}
                className="w-9 h-9 flex items-center justify-center bg-slate-700 rounded-lg text-white hover:bg-vtv-green hover:text-black transition-all shadow-lg active:scale-90 border border-slate-600"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const HotTrend = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const autoPlayRef = useRef(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);

  const hotProducts = useMemo(() => {
    const filtered = products.filter((p) => p.isHot === true);
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [products]);

  const itemsToShow = 5;
  const totalItems = hotProducts.length;
  const maxIndex = totalItems > itemsToShow ? totalItems - itemsToShow : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
  }, [maxIndex]);

  const handleAddToCart = (e, product, variant) => {
    e.preventDefault();
    addToCart(product, variant);
    if (user?.id)
      axiosClient
        .post('/interactions/log', {
          userId: user.id,
          productId: product.id,
          type: 'ADD_TO_CART',
        })
        .catch(console.error);
  };

  const handleManualNav = (direction) => {
    if (isCooldown || totalItems === 0) return;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setIsCooldown(true);
    if (direction === 'next')
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    else {
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
    setTimeout(() => setIsCooldown(false), 500);
    setTimeout(() => startAutoPlay(), 5000);
  };

  useEffect(() => {
    if (totalItems > 0) startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoPlay, totalItems]);

  if (totalItems === 0) return null;

  return (
    <section className="relative group/section bg-slate-900/40 rounded-3xl p-6 border border-white/5 shadow-2xl mb-12 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-vtv-green/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10 px-2">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
            <Zap
              className="text-yellow-400 fill-yellow-400 animate-pulse"
              size={32}
            />
            XẢ KHO ĐÓN TẾT 2026
          </h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">
            Deal hời giá sốc - Số lượng có hạn
          </p>
        </div>
        <Link
          to="/products"
          className="bg-slate-800 hover:bg-vtv-green hover:text-black transition-colors px-5 py-2 rounded-full font-bold text-sm text-white border border-slate-700"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="relative">
        {/* Nút điều hướng*/}
        <button
          onClick={() => handleManualNav('prev')}
          disabled={isCooldown}
          className={`absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 backdrop-blur-md p-3 rounded-full text-white border border-white/10 transition-all shadow-xl hover:scale-110 hover:bg-vtv-green hover:text-black opacity-0 group-hover/section:opacity-100 ${isCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => handleManualNav('next')}
          disabled={isCooldown}
          className={`absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 backdrop-blur-md p-3 rounded-full text-white border border-white/10 transition-all shadow-xl hover:scale-110 hover:bg-vtv-green hover:text-black opacity-0 group-hover/section:opacity-100 ${isCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronRight size={24} />
        </button>

        {/* --- CAROUSEL CHÍNH --- */}
        <div className="overflow-hidden py-6 -my-6 -mx-3">
          <motion.div
            className="flex"
            animate={{ x: `calc(-${currentIndex * 20}%)` }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            {hotProducts.map((product) => (
              <ContextAwareCard
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
                formatCurrency={formatCurrency}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HotTrend;
