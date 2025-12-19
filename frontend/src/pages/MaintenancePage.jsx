import React from 'react';
import { Settings, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MaintenancePage = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor (Hiệu ứng nền mờ ảo) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vtv-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center"
      >
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Settings size={80} className="text-slate-700" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Settings size={40} className="text-vtv-green" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-white mb-2">Hệ thống đang bảo trì</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Chúng tôi đang tiến hành nâng cấp hệ thống để mang lại trải nghiệm tốt hơn. 
          Vui lòng quay lại sau ít phút. Xin lỗi vì sự bất tiện này!
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleReload}
            className="w-full bg-vtv-green text-black font-bold py-3 rounded-xl hover:bg-green-400 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
          >
            <RefreshCw size={20}/> Tải lại trang
          </button>
          
          <div className="flex gap-3">
             {/* <Link to="/admin" className="flex-1">
                <button className="w-full bg-slate-800 text-white font-medium py-3 rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2 border border-slate-700">
                    <Settings size={18}/> Dành cho Admin
                </button>
             </Link> */}
             <a href="mailto:support@vtvkeys.com" className="flex-1">
                <button className="w-full bg-slate-800 text-white font-medium py-3 rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2 border border-slate-700">
                    <Mail size={18}/> Liên hệ hỗ trợ
                </button>
             </a>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-xs text-slate-600 font-mono">
          Error Code: 503_SERVICE_UNAVAILABLE
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;