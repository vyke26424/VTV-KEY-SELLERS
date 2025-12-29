import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. CẤU HÌNH DANH SÁCH BANNER FULL OPTION (9 SẢN PHẨM)
const SLIDES = [
  // 1. Spotify
  {
    id: 1,
    title: 'Spotify Premium',
    subtitle: 'NGHE NHẠC KHÔNG GIỚI HẠN',
    desc: 'Nâng cấp chính chủ, bảo hành trọn đời. Tận hưởng âm nhạc chất lượng cao không quảng cáo.',
    price: 'Chỉ từ 35k/tháng',
    color: 'from-green-900 via-green-950 to-black',
    highlightColor: 'text-green-400',
    btnColor: 'bg-green-500 hover:bg-green-400 text-black shadow-green-500/50',
    image:
      'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673506/spotify_qe10by.png',
    url: '/product/spotify-premium',
    features: ['Không quảng cáo', 'Nghe Offline', 'Âm thanh 320kbps'],
  },
  // 2. Netflix
  {
    id: 2,
    title: 'Netflix Ultra HD',
    subtitle: 'RẠP PHIM TẠI GIA',
    desc: 'Xem phim 4K HDR sắc nét. Tài khoản dùng riêng, không chung đụng, hỗ trợ mọi thiết bị.',
    price: 'Giảm 67% hôm nay',
    color: 'from-red-900 via-red-950 to-black',
    highlightColor: 'text-red-500',
    btnColor: 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/50',
    image:
      'https://res.cloudinary.com/diap7lvcv/image/upload/v1767000120/netflixpremium_uwk2y5.webp',
    url: '/product/netflix-premium',
    features: ['Chất lượng 4K HDR', 'Profile riêng', 'Việt Sub chuẩn'],
  },
  // 3. ChatGPT
  {
    id: 3,
    title: 'ChatGPT Plus (GPT-4o)',
    subtitle: 'TRỢ LÝ AI SỐ 1 THẾ GIỚI',
    desc: 'Mở khóa sức mạnh GPT-4o, DALL-E 3. Tăng tốc công việc của bạn gấp 10 lần với AI.',
    price: 'Chỉ 140k/tháng',
    color: 'from-emerald-900 via-teal-900 to-black',
    highlightColor: 'text-teal-400',
    btnColor: 'bg-teal-500 hover:bg-teal-400 text-black shadow-teal-500/50',
    image:
      'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673043/vtv-key-products/qbrup4dilo4zppo9dnuz.png',
    url: '/product/chatgpt-plus',
    features: ['Model GPT-4o', 'Vẽ tranh DALL-E 3', 'Phân tích dữ liệu'],
  },
  // 4. Office 365
  {
    id: 4,
    title: 'Office 365 Family',
    subtitle: 'GIẢI PHÁP VĂN PHÒNG',
    desc: 'Full bộ Office bản quyền (Word, Excel, PowerPoint) + 1TB OneDrive lưu trữ an toàn.',
    price: 'Chỉ 45k/tháng',
    color: 'from-orange-900 via-red-900 to-black',
    highlightColor: 'text-orange-400',
    btnColor:
      'bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/50',
    image:
      'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673865/familyoffice_yefir8.png',
    url: '/product/office-365',
    features: ['1TB OneDrive', 'Chia sẻ 5 thiết bị', 'Bản quyền mới nhất'],
  },
  // 5. Windows 11
  {
    id: 5,
    title: 'Windows 11 Pro',
    subtitle: 'HIỆU SUẤT & BẢO MẬT',
    desc: 'Hệ điều hành hiện đại nhất. Giao diện mượt mà, bảo mật BitLocker, tối ưu cho Gaming và Work.',
    price: 'Chỉ 150k/key vĩnh viễn',
    color: 'from-blue-800 via-sky-900 to-black',
    highlightColor: 'text-sky-400',
    btnColor: 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/50',
    image:
      'https://keyoff.net/wp-content/uploads/2021/10/Key-Windows-11-gia-re.jpg',
    url: '/product/windows-11-pro',
    features: ['Key vĩnh viễn', 'Update chính hãng', 'Kích hoạt Online'],
  },
  // 6. Envato
  {
    id: 6,
    title: 'Envato Elements',
    subtitle: 'KHO TÀI NGUYÊN VÔ TẬN',
    desc: 'Tải xuống không giới hạn hơn 6 triệu tài nguyên: Theme Web, Video Template, Nhạc, Đồ họa 3D.',
    price: 'Chỉ 150k/tháng',
    color: 'from-lime-900 via-green-800 to-black',
    highlightColor: 'text-lime-400',
    btnColor: 'bg-lime-500 hover:bg-lime-400 text-black shadow-lime-500/50',
    image:
      'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676218/evanto_eqqg80.png',
    url: '/product/envato-elements-premium',
    features: [
      'Download Unlimited',
      'Giấy phép thương mại',
      'Update hàng ngày',
    ],
  },
  // 7. CapCut
  {
    id: 7,
    title: 'CapCut Pro',
    subtitle: 'DỰNG VIDEO CHUYÊN NGHIỆP',
    desc: 'Mở khóa full tính năng AI: Xóa phông, làm nét, phụ đề tự động. Đồng bộ PC & Mobile.',
    price: 'Chỉ 350k/năm',
    color: 'from-gray-900 via-slate-800 to-black',
    highlightColor: 'text-cyan-400',
    btnColor: 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/50',
    image:
      'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675822/capcut_mfyyni.png',
    url: '/product/capcut-pro-full',
    features: ['Xóa logo', 'Hiệu ứng VIP', 'AI Smart Features'],
  },
  // 8. Adobe
  {
    id: 8,
    title: 'Adobe All Apps',
    subtitle: 'SÁNG TẠO KHÔNG GIỚI HẠN',
    desc: 'Trọn bộ 20+ App bản quyền: Photoshop, Illustrator, Premiere... Kèm 100GB Cloud & AI Firefly.',
    price: 'Tiết kiệm 68%',
    color: 'from-purple-900 via-fuchsia-900 to-black',
    highlightColor: 'text-fuchsia-400',
    btnColor:
      'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/50',
    image:
      'https://res.cloudinary.com/diap7lvcv/image/upload/v1767000637/ADOBE_pobkrt.png',
    url: '/product/adobe-all-apps',
    features: ['20+ Ứng dụng', 'AI Generative Fill', '100GB Cloud'],
  },
  // 9. Gemini
  {
    id: 9,
    title: 'Gemini Advanced',
    subtitle: 'ĐỈNH CAO AI CỦA GOOGLE',
    desc: 'Sử dụng model Ultra 1.0 mạnh nhất. Tích hợp sâu vào Google Docs, Gmail. Tặng 2TB Google One.',
    price: 'Chỉ 90k/tháng',
    color: 'from-blue-900 via-indigo-800 to-black',
    highlightColor: 'text-blue-300',
    btnColor: 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/50',
    image:
      'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673121/google-gemini-icon_o6inzu.png',
    url: '/product/gemini-advanced',
    features: ['Model Ultra 1.0', 'Tặng 2TB Storage', 'Tích hợp Workspace'],
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
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
      <div className="relative h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={SLIDES[current].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-br ${SLIDES[current].color} flex items-center`}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            ></div>
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

            <div className="container mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 items-center relative z-10 gap-8">
              {/* --- CỘT TRÁI: NỘI DUNG CHỮ --- */}
              <div className="space-y-6 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm"
                >
                  <Star
                    size={14}
                    className="text-yellow-400 fill-yellow-400 animate-spin-slow"
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${SLIDES[current].highlightColor}`}
                  >
                    {SLIDES[current].subtitle}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg"
                >
                  {SLIDES[current].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 text-sm md:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed line-clamp-2 md:line-clamp-3"
                >
                  {SLIDES[current].desc}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center md:justify-start gap-3"
                >
                  {SLIDES[current].features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 text-xs text-gray-300 bg-black/20 px-2 py-1 rounded border border-white/5 whitespace-nowrap"
                    >
                      <ShieldCheck size={12} className="text-vtv-green" />{' '}
                      {feat}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col md:flex-row items-center gap-5 pt-4"
                >
                  <Link
                    to={SLIDES[current].url}
                    className={`${SLIDES[current].btnColor} px-8 py-4 rounded-xl font-bold shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group/btn`}
                  >
                    MUA NGAY{' '}
                    <ArrowRight
                      size={20}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Link>

                  <div className="text-center md:text-left">
                    <p className="text-gray-400 text-xs font-medium uppercase">
                      Giá khuyến mãi
                    </p>
                    <p className="text-white font-bold text-xl md:text-2xl">
                      {SLIDES[current].price}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* --- CỘT PHẢI: HÌNH ẢNH 3D (ĐÃ BO TRÒN GÓC) --- */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                className="hidden md:flex justify-center items-center relative"
              >
                {/* Vòng tròn nền */}
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl transform scale-90"></div>

                {/* Ảnh sản phẩm */}
                <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                  <img
                    src={SLIDES[current].image}
                    alt={SLIDES[current].title}
                    className="w-full h-full object-cover rounded-3xl shadow-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500 ease-out border-4 border-white/10"
                  />

                  {/* Floating Badge */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: 'easeInOut',
                    }}
                    className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl flex items-center gap-2"
                  >
                    <Zap
                      size={20}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <div>
                      <p className="text-[10px] text-gray-300 font-bold uppercase">
                        Bán chạy
                      </p>
                      <p className="text-white font-bold text-xs">Top #1</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute z-20 left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute z-20 right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/5 overflow-x-auto max-w-[90%] hide-scrollbar">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                current === index
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
