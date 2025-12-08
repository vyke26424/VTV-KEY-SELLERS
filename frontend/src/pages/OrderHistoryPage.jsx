import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, Clock, X, Copy, Check } from 'lucide-react'; // Thêm icon
import useAuthStore from '../store/useAuthStore';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const OrderHistoryPage = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Modal xem key
    const [selectedOrder, setSelectedOrder] = useState(null); // Lưu đơn hàng đang xem

    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:3000/orders/user/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    // Hàm copy key
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('Đã copy key!');
    };

    if (!user) return <div className="text-center text-white py-20">Vui lòng đăng nhập.</div>;
    
    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Package className="text-vtv-green" /> Lịch sử đơn hàng
            </h1>

            {loading ? (
                <div className="text-center text-gray-500">Đang tải...</div>
            ) : orders.length === 0 ? (
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
                                    <div className="text-white font-bold text-sm">#{order.code}</div>
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
                                        <img 
                                            src={item.variant?.product?.thumbnail} 
                                            className="w-10 h-10 rounded object-cover bg-slate-700" 
                                            alt=""
                                        />
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
                                    onClick={() => setSelectedOrder(order)} // Bấm vào thì set đơn hàng cần xem
                                    className="text-sm bg-vtv-green text-black px-4 py-2 rounded font-bold hover:bg-green-400 transition flex items-center gap-2 ml-auto"
                                >
                                    <Package size={16}/> Xem Key / Tài khoản
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL HIỂN THỊ KEY (Popup) --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
                        
                        {/* Header Modal */}
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                            <h3 className="text-white font-bold text-lg">Chi tiết đơn hàng #{selectedOrder.code}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                                <X size={24}/>
                            </button>
                        </div>

                        {/* Body Modal: Danh sách Key */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                                    <div className="flex gap-3 mb-3 border-b border-slate-800 pb-3">
                                        <img src={item.variant?.product?.thumbnail} className="w-12 h-12 rounded bg-slate-800 object-cover" alt=""/>
                                        <div>
                                            <h4 className="text-vtv-green font-bold text-sm">{item.variant?.product?.name}</h4>
                                            <p className="text-gray-400 text-xs">{item.variant?.name}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Mã kích hoạt / Tài khoản:</p>
                                        
                                        {/* Hiển thị Key */}
                                        {item.codes ? (
                                            item.codes.split('\n').map((code, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700 group">
                                                    <code className="flex-1 text-white font-mono text-sm break-all">
                                                        {code}
                                                    </code>
                                                    <button 
                                                        onClick={() => handleCopy(code)}
                                                        className="text-gray-400 hover:text-white p-1 rounded hover:bg-slate-700"
                                                        title="Copy"
                                                    >
                                                        <Copy size={16}/>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-yellow-500 text-sm flex items-center gap-2">
                                                <Clock size={16}/> Đang xử lý... (Vui lòng liên hệ Admin)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Footer Modal */}
                        <div className="p-4 border-t border-slate-700 bg-slate-800 text-center">
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200"
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