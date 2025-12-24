import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Copy, Clock, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('orderCode') || 'ORD-UNKNOWN';
  
  // Giả lập thông tin ngân hàng (Bạn thay thông tin thật vào đây)
  const BANK_INFO = {
    bankName: 'MB Bank (Quân Đội)',
    accountNum: '0368888888', // Số tk của bạn
    accountName: 'NGUYEN VAN A',
    amount: 'Theo đơn hàng',
    content: `VTVKEY ${orderCode.replace('#', '')}`
  };

  // Tạo link QR VietQR xịn sò (Tự động điền nội dung)
  // Format: https://img.vietqr.io/image/<BANK>-<ACC>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<CONTENT>
  // Ở đây mình để template compact, bạn có thể chỉnh amount nếu truyền được giá tiền sang đây
  const qrUrl = `https://img.vietqr.io/image/MB-${BANK_INFO.accountNum}-compact.png?addInfo=${BANK_INFO.content}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép: ' + text);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-vtv-card border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
      >
        {/* Hiệu ứng nền */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-vtv-green"></div>

        {/* CỘT TRÁI: THÔNG BÁO */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center text-center md:text-left border-b md:border-b-0 md:border-r border-slate-700">
            <div className="mb-4 flex justify-center md:justify-start">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-vtv-green" />
                </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-400 text-sm mb-6">
                Mã đơn hàng: <span className="text-white font-mono font-bold">{orderCode}</span>
            </p>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <Clock className="text-yellow-500 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                        <h3 className="text-yellow-500 font-bold text-sm">Đơn hàng đang chờ thanh toán</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            Vui lòng quét mã QR hoặc chuyển khoản theo thông tin bên cạnh để hệ thống xử lý.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mt-auto">
                <Link to="/orders" className="block w-full bg-slate-800 text-white font-bold py-3 text-center rounded-lg hover:bg-slate-700 transition border border-slate-600">
                    Xem trạng thái đơn hàng
                </Link>
                <Link to="/" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm py-2">
                    Tiếp tục mua sắm <ArrowRight size={14} />
                </Link>
            </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN THANH TOÁN */}
        <div className="p-8 md:w-1/2 bg-slate-900/50">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Smartphone size={18} className="text-vtv-green"/> Thông tin chuyển khoản
            </h3>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-xl mb-6 shadow-inner mx-auto max-w-[200px]">
                <img src={qrUrl} alt="VietQR" className="w-full h-full object-contain" />
            </div>

            {/* Chi tiết tài khoản */}
            <div className="space-y-4 text-sm">
                <div>
                    <span className="text-gray-500 block text-xs">Ngân hàng</span>
                    <span className="text-white font-bold">{BANK_INFO.bankName}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <div>
                        <span className="text-gray-500 block text-xs">Số tài khoản</span>
                        <span className="text-white font-mono font-bold text-lg">{BANK_INFO.accountNum}</span>
                    </div>
                    <button onClick={() => copyToClipboard(BANK_INFO.accountNum)} className="text-vtv-green hover:bg-slate-700 p-1.5 rounded transition">
                        <Copy size={16}/>
                    </button>
                </div>
                <div className="flex justify-between items-center bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <div>
                        <span className="text-gray-500 block text-xs">Nội dung chuyển khoản (Bắt buộc)</span>
                        <span className="text-yellow-400 font-mono font-bold">{BANK_INFO.content}</span>
                    </div>
                    <button onClick={() => copyToClipboard(BANK_INFO.content)} className="text-vtv-green hover:bg-slate-700 p-1.5 rounded transition">
                        <Copy size={16}/>
                    </button>
                </div>
                
                <p className="text-[10px] text-gray-500 text-center italic mt-4">
                    * Hệ thống sẽ tự động duyệt đơn sau khi nhận được tiền *
                    (thực ra là chờ Admin duyệt tay đó ).
                </p>
            </div>
        </div>

      </motion.div>
    </div>
  );
};

export default SuccessPage;