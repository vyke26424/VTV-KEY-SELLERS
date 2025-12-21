/* FILE: frontend/src/pages/PolicyPage.jsx */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, HelpCircle, ArrowLeft, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

const PolicyPage = () => {
  const { type } = useParams();

  // Component con: Thẻ nội dung thống nhất (Đã nâng cấp)
  const PolicySection = ({ number, title, icon, children, colorClass = "text-vtv-green", isWarning = false }) => (
    <div className={`
        border rounded-xl p-6 transition-all duration-300
        ${isWarning 
            ? 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20' // Style cho box Cảnh báo (Nổi bật hơn)
            : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60 hover:border-slate-600'} // Style thường
    `}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-3 ${isWarning ? 'text-red-400' : 'text-white'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-sm
                ${isWarning ? 'bg-red-500 text-white' : 'bg-slate-700 ' + colorClass}
            `}>
                {number}
            </span>
            {title}
        </h3>
        {/* Nội dung bên trong: Nếu là Warning thì dùng màu trắng sáng (text-gray-100) để dễ đọc nhất */}
        <div className={`pl-11 leading-relaxed text-sm md:text-base space-y-2 ${isWarning ? 'text-gray-100' : 'text-gray-300'}`}>
            {children}
        </div>
    </div>
  );

  const contentMap = {
    'warranty': {
      title: 'Chính Sách Bảo Hành',
      icon: <ShieldCheck size={32} className="text-vtv-green" />,
      content: (
        <div className="grid gap-6">
            {/* Mục 1 */}
            <PolicySection number="1" title="Phạm vi bảo hành" icon={<CheckCircle2 />}>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Sản phẩm áp dụng:</strong> Tất cả các Key/Tài khoản được xuất ra từ hệ thống VTVKey.</li>
                    <li><strong>Thời hạn bảo hành:</strong> Tương ứng với tên và mô tả của gói dịch vụ khách đã mua (Ví dụ: Gói 1 năm bảo hành 1 năm).</li>
                </ul>
            </PolicySection>

            {/* Mục 2 */}
            <PolicySection number="2" title="Điều kiện bảo hành (1 đổi 1)" icon={<RefreshCw />}>
                <p className="mb-2 font-medium text-white">Sản phẩm sẽ được đổi mới ngay lập tức nếu:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Key/Tài khoản không thể kích hoạt được ngay tại thời điểm nhận hàng.</li>
                    <li>Key/Tài khoản bị khóa (Block) hoặc mất bản quyền trong thời gian sử dụng cam kết do lỗi từ nhà cung cấp.</li>
                    <li>Giao sai gói sản phẩm so với đơn đặt hàng.</li>
                </ul>
            </PolicySection>

            {/* Mục 3 - ĐÃ SỬA: Thêm prop isWarning={true} và icon Cảnh báo */}
            <PolicySection number="3" title="Từ chối bảo hành" isWarning={true} icon={<AlertTriangle />}>
                <ul className="list-disc pl-5 space-y-2 font-medium">
                    <li>Khách hàng chia sẻ tài khoản cho nhiều người, đổi mật khẩu trái phép (đối với tài khoản dùng chung).</li>
                    <li>Thiết bị của khách hàng bị lỗi phần cứng, virus không cài được phần mềm (đây là lỗi thiết bị, không phải lỗi Key).</li>
                    <li>Khách hàng muốn trả hàng vì lý do cá nhân (đổi ý) sau khi đã nhận Key (vì Key đã lộ, không thể thu hồi).</li>
                </ul>
            </PolicySection>

             {/* Mục 4 */}
             <PolicySection number="4" title="Quy trình xử lý" icon={<CheckCircle2 />}>
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <span className="font-bold text-vtv-green">B1.</span>
                        <p>Nhân viên kiểm tra hóa đơn và trạng thái Key trên hệ thống.</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="font-bold text-vtv-green">B2.</span>
                        <p>Nếu lỗi hợp lệ: Hệ thống thu hồi Key cũ <span className="text-vtv-green">→</span> Cấp ngay Key mới qua Email/Zalo cho khách hàng.</p>
                    </div>
                </div>
            </PolicySection>
        </div>
      )
    },
    'guide': {
      title: 'Hướng Dẫn Mua Hàng & Sử Dụng',
      icon: <BookOpen size={32} className="text-vtv-green" />,
      content: (
        <div className="space-y-8 text-gray-300 relative">
             {/* Đường kẻ dọc nối các bước */}
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-700 md:left-[15px]"></div>

            {/* Bước 1 */}
            <div className="relative pl-10 md:pl-12">
                <span className="absolute left-0 top-0 bg-vtv-green text-black font-bold w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm ring-4 ring-[#1e293b]">1</span>
                <h4 className="text-lg font-bold text-white mb-2 pt-0.5 md:pt-1">Lựa chọn Sản phẩm</h4>
                <p className="text-sm md:text-base">Truy cập trang chủ, tìm kiếm phần mềm cần mua (Ví dụ: Office 365, Windows 10...).</p>
            </div>

            {/* Bước 2 */}
            <div className="relative pl-10 md:pl-12">
                <span className="absolute left-0 top-0 bg-vtv-green text-black font-bold w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm ring-4 ring-[#1e293b]">2</span>
                <h4 className="text-lg font-bold text-white mb-2 pt-0.5 md:pt-1">Chọn Gói dịch vụ</h4>
                <p className="text-sm md:text-base mb-2">Chọn đúng nhu cầu (Ví dụ: "Gói 1 Năm" hoặc "Gói Vĩnh Viễn").</p>
                <div className="inline-block bg-yellow-500/10 text-yellow-500 px-3 py-2 rounded text-xs md:text-sm border border-yellow-500/20">
                    ⚠️ Lưu ý: Giá tiền sẽ thay đổi theo gói bạn chọn.
                </div>
            </div>

            {/* Bước 3 */}
            <div className="relative pl-10 md:pl-12">
                <span className="absolute left-0 top-0 bg-vtv-green text-black font-bold w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm ring-4 ring-[#1e293b]">3</span>
                <h4 className="text-lg font-bold text-white mb-2 pt-0.5 md:pt-1">Kiểm tra & Thanh toán</h4>
                <p className="text-sm md:text-base">Hệ thống tự động kiểm tra kho hàng. Sau khi thanh toán thành công qua QR Code, Key sẽ được gửi tự động.</p>
            </div>

            {/* Bước 4 */}
            <div className="relative pl-10 md:pl-12">
                <span className="absolute left-0 top-0 bg-vtv-green text-black font-bold w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm ring-4 ring-[#1e293b]">4</span>
                <h4 className="text-lg font-bold text-white mb-2 pt-0.5 md:pt-1">Nhận Key & Kích hoạt</h4>
                <p className="text-sm md:text-base">Kiểm tra Email hoặc mục "Lịch sử đơn hàng" để lấy Key. Nhập Key vào phần mềm để kích hoạt.</p>
            </div>
        </div>
      )
    }
  };

  const data = contentMap[type] || { 
      title: 'Thông báo', 
      icon: <HelpCircle size={40} className="text-gray-500" />, 
      content: 'Trang không tồn tại.' 
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl min-h-[70vh]">
        {/* Nút Back */}
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
        </Link>

        <div className="bg-vtv-card border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-600 shadow-inner">
                    {data.icon}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{data.title}</h1>
            </div>
            
            {/* Content Body */}
            <div>
                {data.content}
            </div>
        </div>
    </div>
  );
};

export default PolicyPage;