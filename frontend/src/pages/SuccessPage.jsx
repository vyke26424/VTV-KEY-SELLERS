import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-vtv-card border border-slate-700 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden"
      >
        {/* Hiệu ứng nền */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-vtv-green to-blue-500"></div>

        <div className="mb-6 flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle size={48} className="text-vtv-green" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Thanh toán thành công!
        </h1>
        <p className="text-gray-400 mb-6">Cảm ơn bạn đã tin tưởng VTVKey.</p>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700 text-left">
          <div className="flex items-start gap-3">
            <Mail className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-white font-bold text-sm">
                Kiểm tra Email ngay
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Mã Key/Tài khoản đã được hệ thống gửi tự động đến email của bạn.
                Vui lòng kiểm tra cả hộp thư Spam.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-vtv-green text-black font-bold py-3 rounded-lg hover:bg-green-400 transition"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm py-2"
          >
            Quay về trang chủ <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
