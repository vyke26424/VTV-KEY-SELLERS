import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../store/axiosClient';

const HotTrend = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const autoPlayRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);

  const hotProducts = useMemo(() => {
    const filtered = products.filter(p => p.isHot === true);
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [products]);

  const itemsToShow = 5;
  const totalItems = hotProducts.length;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 5000);
  }, [totalItems]);

  const handleAddToCart = (e, product, variant) => {
    e.preventDefault();
    addToCart(product, variant);

    if (user?.id) {
      axiosClient
        .post('/interactions/log', {
          userId: user.id,
          productId: product.id,
          type: 'ADD_TO_CART',
        })
        .catch((err) => console.error('Log HotTrend AddToCart Error:', err));
    }
  };

  const handleManualNav = (direction) => {
    if (isCooldown || totalItems === 0) return;

    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);

    setIsCooldown(true);

    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 2) % totalItems);
    } else {
      setCurrentIndex((prev) => (prev - 2 + totalItems) % totalItems);
    }

    cooldownTimerRef.current = setTimeout(() => {
      setIsCooldown(false);
    }, 800);

    resumeTimerRef.current = setTimeout(() => {
      startAutoPlay();
    }, 5000);
  };

  useEffect(() => {
    if (totalItems > 0) {
      startAutoPlay();
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, [startAutoPlay, totalItems]);

  if (totalItems === 0) return null;

  return (
    <section className="relative group bg-slate-900/40 rounded-3xl p-8 border border-white/5 shadow-2xl mb-12 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-vtv-green/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
            <Zap className="text-yellow-400 fill-yellow-400 animate-pulse" size={32} />
            XẢ KHO ĐÓN TẾT 2026
          </h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Mua ngay kẻo lỡ - Tết hết là tăng giá</p>
        </div>
        <Link to="/products" className="bg-slate-800 hover:bg-vtv-green hover:text-black transition-colors px-6 py-2 rounded-full font-bold text-sm text-white">
          Xem tất cả
        </Link>
      </div>

      <div className="relative px-2">
        <button 
          onClick={() => handleManualNav('prev')}
          disabled={isCooldown}
          className={`absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 backdrop-blur-md p-4 rounded-full text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all shadow-lg ${isCooldown ? 'cursor-not-allowed opacity-20' : 'hover:bg-vtv-green hover:text-black'}`}
        >
          <ChevronLeft size={28} />
        </button>
    
        <button 
          onClick={() => handleManualNav('next')}
          disabled={isCooldown}
          className={`absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 backdrop-blur-md p-4 rounded-full text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all shadow-lg ${isCooldown ? 'cursor-not-allowed opacity-20' : 'hover:bg-vtv-green hover:text-black'}`}
        >
          <ChevronRight size={28} />
        </button>

        <div className="overflow-hidden">
          <motion.div 
            className="flex gap-6"
            animate={{ 
              x: `calc(-${currentIndex * (100 / itemsToShow)}%)` 
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1] 
            }}
          >
            {hotProducts.map((product) => {
              const getDiscountPercent = (variant) => {
                if (variant && parseFloat(variant.orginalPrice) > parseFloat(variant.price)) {
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
                  ? product.variants.reduce((bestVariant, currentVariant) => {
                      const bestDiscount = getDiscountPercent(bestVariant);
                      const currentDiscount = getDiscountPercent(currentVariant);

                      if (currentDiscount > bestDiscount) {
                        return currentVariant;
                      }
                      if (currentDiscount === bestDiscount) {
                        return parseFloat(currentVariant.price) < parseFloat(bestVariant.price)
                          ? currentVariant
                          : bestVariant;
                      }
                      return bestVariant;
                    }, product.variants[0])
                  : { price: 0, orginalPrice: 0 };

              const discountPercent = getDiscountPercent(minVariant);

              return (
                <div
                  key={product.id}
                  className="min-w-[calc(20%-1.25rem)] max-w-[calc(20%-1.25rem)] flex-shrink-0 bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-full"
                >
                  <Link to={`/product/${product.slug}`} className="block relative w-full pt-[100%] bg-slate-900 overflow-hidden">
                    <img 
                      src={product.thumbnail} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    {/* Floating Hot Badge with Up and Down Animation */}
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg z-10 animate-[bounce_2s_infinite]">
                      HOT
                    </div>
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-4 h-10 overflow-hidden">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex flex-col">
                        {/* Original Price and Percentage Row */}
                        {parseFloat(minVariant.orginalPrice) > parseFloat(minVariant.price) && (
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] text-slate-500 line-through">
                              {formatCurrency(minVariant.orginalPrice)}
                            </span>
                            {discountPercent > 0 && (
                              <span className="text-[10px] text-red-500 font-bold">
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                        )}
                        <span className="text-vtv-green font-black text-lg lg:text-xl leading-none">
                          {formatCurrency(minVariant.price)}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product, minVariant)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-xl text-white hover:bg-vtv-green hover:text-black transition-all active:scale-90"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HotTrend;