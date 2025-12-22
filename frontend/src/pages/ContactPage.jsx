import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="py-12 text-gray-300">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Liên hệ hỗ trợ</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Info */}
            <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl h-fit">
                <h3 className="text-xl font-bold text-white mb-6">Thông tin liên lạc</h3>
                <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                        <div className="bg-vtv-green/10 p-3 rounded-full text-vtv-green border border-vtv-green/20"><Mail size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Email</p>
                            <p className="text-white font-medium">support@vtvkey.com</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-4">
                        <div className="bg-blue-500/10 p-3 rounded-full text-blue-500 border border-blue-500/20"><Phone size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Hotline</p>
                            <p className="text-white font-medium">0912.345.678</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-4">
                        <div className="bg-purple-500/10 p-3 rounded-full text-purple-500 border border-purple-500/20"><MapPin size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Địa chỉ</p>
                            <p className="text-white font-medium">Tòa nhà VTV, TP Hồ Chí Minh, Việt Nam</p>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Form */}
            <form className="bg-slate-900/80 border border-slate-700 p-8 rounded-xl space-y-4 shadow-lg backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-2">Gửi tin nhắn</h3>
                <input type="text" placeholder="Họ tên của bạn" className="w-full bg-slate-950 border border-slate-600 rounded-lg p-3 focus:border-vtv-green outline-none text-white"/>
                <input type="email" placeholder="Email liên hệ" className="w-full bg-slate-950 border border-slate-600 rounded-lg p-3 focus:border-vtv-green outline-none text-white"/>
                <textarea rows="4" placeholder="Nội dung cần hỗ trợ..." className="w-full bg-slate-950 border border-slate-600 rounded-lg p-3 focus:border-vtv-green outline-none text-white"></textarea>
                <button className="w-full bg-vtv-green text-black font-bold py-3 rounded-lg hover:bg-green-400 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                    <Send size={18}/> Gửi ngay
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;