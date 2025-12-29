import React from 'react';
import { Link } from 'react-router-dom'; // <--- 1. NHỚ THÊM DÒNG NÀY
import { Facebook, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#0b0c10] pt-12 pb-8 text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-gray-400">
          {/* Cột 1 */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase">Về VTVKey</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-vtv-green transition">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-vtv-green transition">
                  Tin tức công nghệ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-vtv-green transition">
                  Hợp tác kinh doanh
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 2 - ĐÃ SỬA LINK Ở ĐÂY */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-2">
              <li>
                {/* Link tới trang Hướng dẫn */}
                <Link
                  to="/policy/guide"
                  className="hover:text-vtv-green transition"
                >
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                {/* Link tới trang Bảo hành */}
                <Link
                  to="/policy/warranty"
                  className="hover:text-vtv-green transition"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-vtv-green transition">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-vtv-green transition">
                  Liên hệ hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase">Thanh toán</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white text-blue-800 px-2 py-1 rounded font-bold text-xs">
                VISA
              </span>
              <span className="bg-pink-600 text-white px-2 py-1 rounded font-bold text-xs">
                MOMO
              </span>
              <span className="bg-green-600 text-white px-2 py-1 rounded font-bold text-xs">
                BANKING
              </span>
            </div>
          </div>

          {/* Cột 4 */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase">Kết nối</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
                className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© 2025 VTV Key Shop. Bản quyền thuộc về Vĩ Tứ Vũ.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>Điều khoản sử dụng</span>
            <span>Chính sách bảo mật</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
