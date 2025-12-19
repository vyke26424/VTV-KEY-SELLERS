import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star, Zap } from 'lucide-react';

// 1. CẤU HÌNH DANH SÁCH BANNER
const SLIDES = [
  {
    id: 1,
    title: "Spotify Premium",
    subtitle: "NGHE NHẠC KHÔNG GIỚI HẠN",
    desc: "Nâng cấp chính chủ, bảo hành trọn đời. Tận hưởng âm nhạc chất lượng cao không quảng cáo.",
    price: "Chỉ từ 19k/tháng",
    color: "from-green-900 via-green-800 to-slate-900", // Màu nền Gradient
    highlightColor: "text-green-400", // Màu chữ điểm nhấn
    btnColor: "bg-green-500 hover:bg-green-400 text-black",
    icon: "🎵" // Có thể thay bằng link ảnh
  },
  {
    id: 2,
    title: "Netflix Ultra HD",
    subtitle: "RẠP PHIM TẠI GIA",
    desc: "Xem phim 4K HDR sắc nét. Tài khoản dùng riêng, không chung đụng, hỗ trợ mọi thiết bị.",
    price: "Giảm 75% hôm nay",
    color: "from-red-900 via-red-800 to-slate-900",
    highlightColor: "text-red-500",
    btnColor: "bg-red-600 hover:bg-red-500 text-white",
    icon: "🎬"
  },
  {
    id: 3,
    title: "ChatGPT Plus & AI",
    subtitle: "TRỢ LÝ ẢO THÔNG MINH",
    desc: "Mở khóa sức mạnh GPT-4, Gemini Advanced. Tăng tốc công việc của bạn gấp 10 lần.",
    price: "Gói Pro chỉ 450k",
    color: "from-blue-900 via-purple-900 to-slate-900",
    highlightColor: "text-blue-400",
    btnColor: "bg-blue-500 hover:bg-blue-400 text-white",
    icon: "🤖"
  }
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  // Tự động chuyển slide mỗi 10s
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 10000); 
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  return (
    <div className="container mx-auto px-4 mt-6">
      {/* Khung chứa Banner: Chiều cao cố định để không bị giật layout */}
      <div className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 group">
        
        <AnimatePresence mode='wait'>
          <motion.div
            key={SLIDES[current].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-r ${SLIDES[current].color} flex items-center`}
          >
            {/* Họa tiết trang trí nền (Glow Effect) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="container mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 items-center relative z-10">
              
              {/* NỘI DUNG CHỮ (Bên Trái) */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className={`px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider ${SLIDES[current].highlightColor}`}>
                    <Star size={12} className="inline mr-1 mb-0.5"/> Sản phẩm nổi bật
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-black text-white leading-tight"
                >
                  {SLIDES[current].title}
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-gray-200 text-lg md:text-xl max-w-lg"
                >
                  {SLIDES[current].desc}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex items-center gap-4 pt-2"
                >
                  <button className={`${SLIDES[current].btnColor} px-8 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all flex items-center gap-2`}>
                    <Play size={18} fill="currentColor" /> MUA NGAY
                  </button>
                  <span className="text-white font-semibold text-lg">{SLIDES[current].price}</span>
                </motion.div>
              </div>

              {/* HÌNH ẢNH MINH HỌA (Bên Phải) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: 50 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }} 
                transition={{ delay: 0.4, type: "spring" }}
                className="hidden md:flex justify-center items-center"
              >
                {/* Ở đây bạn có thể thay bằng thẻ <img /> thật */}
                <div className="w-80 h-80 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-9xl shadow-2xl relative">
                   {SLIDES[current].icon}
                   {/* Icon bay bay trang trí */}
                   <motion.div 
                      animate={{ y: [0, -20, 0] }} 
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute -top-4 -right-4 bg-white text-slate-900 p-3 rounded-xl shadow-lg"
                   >
                     <Zap size={24} fill="orange" className="text-orange-500"/>
                   </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* NÚT ĐIỀU HƯỚNG (Mũi tên trái phải) */}
        <button 
          onClick={prevSlide}
          className="absolute z-20 left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute z-20 right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={24} />
        </button>

        {/* DOTS (Chấm tròn bên dưới) */}
        <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === index ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Banner;