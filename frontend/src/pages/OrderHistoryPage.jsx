import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  X,
  Copy,
  Clock,
  Key,
  AlertCircle,
  Ban,
} from 'lucide-react';
import axiosClient from '../store/axiosClient';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    amount,
  );
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// --- CẤU HÌNH MÀU SẮC STATUS ---
const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ xử lý',
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    icon: Clock,
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: Key,
  },
  SUCCESS: {
    // Backend có thể trả về SUCCESS
    label: 'Hoàn thành',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: Key,
  },
  CANCELED: {
    label: 'Đã hủy',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    icon: Ban,
  },
  CANCELLED: {
    // Backend có thể trả về 2 chữ L
    label: 'Đã hủy',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    icon: Ban,
  },
  REFUNDED: {
    label: 'Hoàn tiền',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    icon: AlertCircle,
  },
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await axiosClient.get('/orders/my-orders');
        setOrders(data);
      } catch (err) {
        console.error('Lỗi tải đơn hàng:', err);
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

  if (loading)
    return (
      <div className="text-center text-white py-20">Đang tải dữ liệu...</div>
    );

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
          {orders.map((order) => {
            const statusKey = order.status?.toUpperCase();
            const statusInfo =
              STATUS_CONFIG[statusKey] || STATUS_CONFIG.PENDING;
            const StatusIcon = statusInfo.icon;

            // Helper checks
            const isCompleted =
              statusKey === 'COMPLETED' || statusKey === 'SUCCESS';
            const isCanceled =
              statusKey === 'CANCELED' ||
              statusKey === 'CANCELLED' ||
              statusKey === 'REFUNDED';
            const isPending = !isCompleted && !isCanceled;

            return (
              <div
                key={order.id}
                className="bg-vtv-card border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition"
              >
                {/* Header Card */}
                <div className="bg-slate-800/50 p-4 flex flex-wrap justify-between items-center border-b border-slate-700 gap-4">
                  <div>
                    <div className="text-white font-bold text-sm">
                      {order.code}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-vtv-green font-bold">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border flex items-center gap-1 ml-auto w-fit mt-1 ${statusInfo.color}`}
                    >
                      <StatusIcon size={10} /> {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Body Card */}
                <div className="p-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        {item.variant?.product?.thumbnail ? (
                          <img
                            src={item.variant.product.thumbnail}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <Package size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.variant?.product?.slug}`}
                          className="text-white text-sm font-medium hover:text-vtv-green transition"
                        >
                          {item.variant?.product?.name}
                        </Link>
                        <div className="text-gray-400 text-xs">
                          {item.variant?.name} x{item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-900/30 p-3 flex justify-end">
                  {isCompleted && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm bg-vtv-green text-black px-4 py-2 rounded font-bold hover:bg-green-400 transition flex items-center gap-2"
                    >
                      <Key size={16} /> Xem Key / Tài khoản
                    </button>
                  )}

                  {isPending && (
                    <button
                      disabled
                      className="text-sm bg-slate-800 text-yellow-500 px-4 py-2 rounded font-bold cursor-not-allowed flex items-center gap-2 border border-slate-700"
                    >
                      <Clock size={16} /> Đang xử lý
                    </button>
                  )}

                  {isCanceled && (
                    <button
                      disabled
                      className="text-sm bg-red-500/10 text-red-500 px-4 py-2 rounded font-bold cursor-not-allowed flex items-center gap-2 border border-red-500/20"
                    >
                      <Ban size={16} /> Đơn đã hủy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL CHI TIẾT --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 shrink-0">
              <h3 className="text-white font-bold text-lg">
                Chi tiết đơn hàng {selectedOrder.code}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
              {selectedOrder.items.map((item, index) => {
                // Check status lại lần nữa cho chắc
                const stKey = selectedOrder.status?.toUpperCase();
                const isDone = stKey === 'COMPLETED' || stKey === 'SUCCESS';
                const isFail =
                  stKey === 'CANCELED' ||
                  stKey === 'CANCELLED' ||
                  stKey === 'REFUNDED';

                return (
                  <div
                    key={index}
                    className="bg-slate-950 rounded-xl p-4 border border-slate-800"
                  >
                    <div className="flex gap-3 mb-3 border-b border-slate-800 pb-3">
                      <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        {item.variant?.product?.thumbnail ? (
                          <img
                            src={item.variant.product.thumbnail}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <Package size={24} className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <Link
                          to={`/product/${item.variant?.product?.slug}`}
                          className="text-vtv-green font-bold text-sm line-clamp-1 hover:underline"
                        >
                          {item.variant?.product?.name}
                        </Link>
                        <p className="text-gray-400 text-xs">
                          {item.variant?.name}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1">
                        <Key size={12} /> Mã kích hoạt / Tài khoản:
                      </p>

                      {/* --- LOGIC HIỂN THỊ QUAN TRỌNG --- */}
                      {isDone ? (
                        // 1. Nếu đơn đã xong -> Hiện list Key
                        item.stockItems && item.stockItems.length > 0 ? (
                          item.stockItems.map((stock, idx) => (
                            <div
                              key={stock.id || idx}
                              className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700 group"
                            >
                              <code className="flex-1 text-white font-mono text-sm break-all">
                                {stock.credential || '********'}
                              </code>
                              {stock.credential && (
                                <button
                                  onClick={() => handleCopy(stock.credential)}
                                  className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-slate-700 transition"
                                  title="Copy"
                                >
                                  <Copy size={16} />
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-red-500 text-sm">
                            Lỗi: Không tìm thấy key nào.
                          </div>
                        )
                      ) : (
                        // 2. Nếu đơn chưa xong (Pending/Cancel) -> Hiện thông báo
                        <div
                          className={`text-sm flex items-center gap-2 p-3 rounded-lg border ${
                            isFail
                              ? 'bg-red-500/10 text-red-500 border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          }`}
                        >
                          {isFail ? (
                            <>
                              <Ban size={20} />
                              <span className="font-medium">
                                Đơn hàng này đã bị hủy.
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock size={20} />
                              <span className="font-medium">
                                Hệ thống đang xử lý... (Vui lòng chờ Admin
                                duyệt)
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

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
