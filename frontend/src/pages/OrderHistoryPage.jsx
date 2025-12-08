import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

// Hàm format tiền
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Hàm format ngày tháng
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

    if (!user) return <div className="text-center text-white py-20">Vui lòng đăng nhập để xem đơn hàng.</div>;
    if (loading) return <div className="text-center text-gray-500 py-20">Đang tải lịch sử đơn hàng...</div>;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Package className="text-vtv-green" /> Lịch sử đơn hàng
            </h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-400 bg-slate-800/50 p-10 rounded-xl">
                    Bạn chưa có đơn hàng nào. <Link to="/" className="text-vtv-green hover:underline">Mua sắm ngay</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-vtv-card border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition">
                            
                            {/* Header của mỗi đơn hàng */}
                            <div className="bg-slate-800/50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700">
                                <div>
                                    <div className="text-white font-bold text-sm flex items-center gap-2">
                                        {order.code}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                                        }`}>
                                            {order.status === 'PENDING' ? 'Đang xử lý' : 'Hoàn thành'}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                                        <Calendar size={12}/> {formatDate(order.createdAt)}
                                    </div>
                                </div>
                                <div className="text-vtv-green font-bold text-lg">
                                    {formatCurrency(order.totalAmount)}
                                </div>
                            </div>

                            {/* Danh sách sản phẩm trong đơn */}
                            <div className="p-4 space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                                            {/* Lấy ảnh từ Product gốc */}
                                            <img 
                                                src={item.variant?.product?.thumbnail || 'https://placehold.co/50'} 
                                                alt="" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white text-sm font-medium">
                                                {item.variant?.product?.name || 'Sản phẩm'}
                                            </h4>
                                            <div className="text-gray-400 text-xs">
                                                Phân loại: {item.variant?.name} | x{item.quantity}
                                            </div>
                                        </div>
                                        <div className="text-white text-sm">
                                            {formatCurrency(item.price)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer đơn hàng */}
                            <div className="bg-slate-900/30 p-3 text-right">
                                {order.status === 'COMPLETED' ? (
                                    <button className="text-sm bg-vtv-green text-black px-4 py-2 rounded font-bold hover:bg-green-400">
                                        Xem Key / Tài khoản
                                    </button>
                                ) : (
                                    <span className="text-xs text-yellow-500 flex items-center justify-end gap-1">
                                        <Clock size={14}/> Hệ thống đang chuẩn bị key...
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;