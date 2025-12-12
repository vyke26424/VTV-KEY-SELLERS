import React, { useEffect, useState } from 'react';
import { Package, Calendar, X, Copy, Clock, Key } from 'lucide-react'; // Thêm icon Key cho đẹp
import axiosClient from '../store/axiosClient'; // Sửa lại đường dẫn import cho đúng thư mục api

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Gọi API lấy lịch sử (đã được giải mã từ backend)
                const data = await axiosClient.get('/orders/my-orders');
                setOrders(data);
            } catch (err) {
                console.error("Lỗi tải đơn hàng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('Đã copy key!');
    };

    if (loading) return <div className="text-center text-white py-20">Đang tải dữ liệu...</div>;
    
    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Package className="text-vtv-green" /> Lịch sử đơn hàng
            </h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-400 bg-slate-800/50 p-10 rounded-xl border border-dashed border-slate-700">
                    Bạn chưa có đơn hàng nào.
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-vtv-card border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition">
                            
                            {/* Header Đơn Hàng */}
                            <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-slate-700">
                                <div>
                                    <div className="text-white font-bold text-sm">{order.code}</div>
                                    <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                        <Calendar size={12}/> {formatDate(order.createdAt)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-vtv-green font-bold">{formatCurrency(order.totalAmount)}</div>
                                    <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full uppercase font-bold">
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm (Tóm tắt) */}
                            <div className="p-4 space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center overflow-hidden">
                                            {item.variant?.product?.thumbnail ? (
                                                <img src={item.variant.product.thumbnail} className="w-full h-full object-cover" alt=""/>
                                            ) : (
                                                <Package size={20} className="text-gray-500"/>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white text-sm font-medium">{item.variant?.product?.name}</div>
                                            <div className="text-gray-400 text-xs">{item.variant?.name} x{item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Nút Xem Key */}
                            <div className="bg-slate-900/30 p-3 text-right">
                                <button 
                                    onClick={() => setSelectedOrder(order)} 
                                    className="text-sm bg-vtv-green text-black px-4 py-2 rounded font-bold hover:bg-green-400 transition flex items-center gap-2 ml-auto"
                                >
                                    <Key size={16}/> Xem Key / Tài khoản
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL HIỂN THỊ KEY (Popup) --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
                        
                        {/* Header Modal */}
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 shrink-0">
                            <h3 className="text-white font-bold text-lg">Chi tiết đơn hàng {selectedOrder.code}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                                <X size={24}/>
                            </button>
                        </div>

                        {/* Body Modal: Danh sách Key (Có cuộn) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                                    
                                    {/* Info sản phẩm */}
                                    <div className="flex gap-3 mb-3 border-b border-slate-800 pb-3">
                                        <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                            {item.variant?.product?.thumbnail ? (
                                                <img src={item.variant.product.thumbnail} className="w-full h-full object-cover" alt=""/>
                                            ) : (
                                                <Package size={24} className="text-gray-500"/>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-vtv-green font-bold text-sm line-clamp-1">{item.variant?.product?.name}</h4>
                                            <p className="text-gray-400 text-xs">{item.variant?.name}</p>
                                        </div>
                                    </div>

                                    {/* Danh sách Key */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1">
                                            <Key size={12}/> Mã kích hoạt / Tài khoản:
                                        </p>
                                        
                                        {/* --- LOGIC MỚI: DUYỆT QUA MẢNG STOCKITEMS --- */}
                                        {item.stockItems && item.stockItems.length > 0 ? (
                                            item.stockItems.map((stock, idx) => (
                                                <div key={stock.id || idx} className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700 group">
                                                    <code className="flex-1 text-white font-mono text-sm break-all">
                                                        {/* Hiển thị credential đã giải mã */}
                                                        {stock.credential}
                                                    </code>
                                                    <button 
                                                        onClick={() => handleCopy(stock.credential)}
                                                        className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-slate-700 transition"
                                                        title="Copy"
                                                    >
                                                        <Copy size={16}/>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-yellow-500 text-sm flex items-center gap-2 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                                                <Clock size={16}/> Đang xử lý... (Vui lòng liên hệ Admin)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Footer Modal */}
                        <div className="p-4 border-t border-slate-700 bg-slate-800 text-center shrink-0">
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200 transition w-full sm:w-auto"
                            >
                                Đóng
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;