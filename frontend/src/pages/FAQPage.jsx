import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const faqs = [
    {
      q: 'Sau khi thanh toán bao lâu thì nhận được Key?',
      a: 'Hệ thống của VTVKey là tự động 100%. Bạn sẽ nhận được Key ngay lập tức qua Email và trong phần Lịch sử đơn hàng sau khi thanh toán thành công.',
    },
    {
      q: 'Chính sách bảo hành như thế nào?',
      a: "Chúng tôi bảo hành trọn đời cho các sản phẩm cam kết 'Vĩnh viễn' và bảo hành theo thời hạn cho các gói subscription (1 năm, 6 tháng). Lỗi 1 đổi 1 nếu Key bị chặn.",
    },
    {
      q: 'Tôi có thể hoàn tiền không?',
      a: 'VTVKey hỗ trợ hoàn tiền 100% nếu sản phẩm bị lỗi mà chúng tôi không thể khắc phục hoặc đổi mới trong vòng 24h.',
    },
    {
      q: 'Shop có xuất hóa đơn VAT không?',
      a: 'Hiện tại chúng tôi hỗ trợ xuất hóa đơn điện tử cho đơn hàng doanh nghiệp trên 2 triệu đồng.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="py-12 text-gray-300">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
          <HelpCircle className="text-vtv-green" size={32} /> Câu hỏi thường gặp
        </h1>
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden transition-all hover:border-slate-500"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-medium text-white"
              >
                <span>{item.q}</span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-vtv-green" />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {openIndex === index && (
                <div className="p-5 pt-0 text-gray-400 border-t border-slate-700/50 bg-slate-950/30">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
