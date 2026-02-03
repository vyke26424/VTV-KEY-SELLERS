import React from 'react';
import { ShieldCheck, Zap, Users, Globe } from 'lucide-react';

const AboutPage = () => {
  // Bỏ bg-slate-950, chỉ giữ lại padding
  return (
    <div className="py-12 text-gray-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-white mb-4">
            Về <span className="text-white mb-4">VTV</span>
            <span className="text-vtv-green">KEY</span>
          </h1>
          <p className="text-lg text-gray-400">
            Hệ thống cung cấp phần mềm bản quyền & giải pháp số hàng đầu Việt
            Nam.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-2xl mb-12 shadow-xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-4">
            Câu chuyện của chúng tôi
          </h2>
          <p className="mb-4 leading-relaxed">
            Được thành lập vào năm 2025, VTVKey ra
            đời nhằm xóa bỏ rào cản trong việc tiếp cận bản quyền phần mềm tại
            Việt Nam. Chúng tôi tin rằng việc sở hữu bản quyền Windows, Office
            hay các tài khoản giải trí như Netflix, ChatGPT không nên là một
            gánh nặng chi phí.
          </p>
          <p className="leading-relaxed">
            Tại VTVKey, mỗi sản phẩm trao tay khách hàng đều là lời cam kết trọn
            đời dựa trên triết lý Verified - Trust - Value: Chất lượng được xác
            thực, Niềm tin được khẳng định và Giá trị được lan tỏa.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Users, label: 'Khách hàng', val: '10.000+' },
            { icon: ShieldCheck, label: 'Uy tín', val: '100%' },
            { icon: Zap, label: 'Giao hàng', val: '5s' },
            { icon: Globe, label: 'Sản phẩm', val: '500+' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl text-center hover:bg-slate-800 transition"
            >
              <item.icon className="mx-auto mb-2 text-vtv-green" size={32} />
              <div className="text-2xl font-bold text-white">{item.val}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
