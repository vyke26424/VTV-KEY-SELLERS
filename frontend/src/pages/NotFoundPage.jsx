// fileName: frontend/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Ghost } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0B1221] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vtv-green rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <Ghost size={100} className="text-gray-600 animate-bounce-slow" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/50 blur-md rounded-[100%]"></div>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400 select-none mb-2">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Oops! Lạc đường rồi...
        </h2>

        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị "bay màu". Hãy quay về
          trang chủ để tìm key game xịn nhé!
        </p>

        {/* Button */}
        <Link
          to="/"
          className="group flex items-center space-x-2 px-8 py-3 bg-vtv-green text-black font-bold rounded-xl transition-all hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-1"
        >
          <Home
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span>Về Trang Chủ</span>
        </Link>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-6 text-xs text-gray-600">
        Error Code: 404_NOT_FOUND
      </div>
    </div>
  );
};

export default NotFoundPage;
