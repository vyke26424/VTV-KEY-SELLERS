import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ProductCard = ({ product }) => {
  // Logic tìm variant giá thấp nhất
  const minVariant = product.variants?.length > 0 
    ? product.variants.reduce((prev, curr) => parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr) 
    : { price: 0, orginalPrice: 0 };

  const discountPercent = minVariant.orginalPrice > 0
    ? Math.round(((minVariant.orginalPrice - minVariant.price) / minVariant.orginalPrice) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div 
        whileHover={{ scale: 1.03, y: -5 }} 
        className="bg-vtv-card rounded-xl overflow-hidden border border-slate-700 hover:border-vtv-green transition-colors group relative flex flex-col h-full cursor-pointer hover:shadow-lg hover:shadow-green-500/10"
      >
        <div className="h-40 bg-slate-700/50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
          {product.thumbnail ? (
            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover"/> 
          ) : (
            <span>📦</span>
          )}
        </div>
        
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-vtv-red text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}
        
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-semibold text-white text-sm truncate mb-1" title={product.name}>
            {product.name}
          </h3>
          
          <div className="mt-auto pt-2">
            {parseFloat(minVariant.orginalPrice) > 0 && (
              <span className="text-gray-500 text-xs line-through block">
                {formatCurrency(minVariant.orginalPrice)}
              </span>
            )}
            <div className="flex justify-between items-center mt-1">
              <span className="text-vtv-green font-bold text-base">
                {formatCurrency(minVariant.price)}
              </span>
              <button className="bg-vtv-green hover:bg-green-500 text-black p-1.5 rounded-lg transition-colors">
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;