import React, { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  X,
  Package,
  Calendar,
  User,
  CreditCard,
} from 'lucide-react';
import { motion } from 'framer-motion';
import axiosClient from '../../../store/axiosClient';

// --- TIỆN ÍCH FORMAT ---
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    val,
  );
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const STATUS_COLORS = {
  PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
  COMPLETED: 'bg-green-500/20 text-green-500 border-green-500/50',
  CANCELED: 'bg-red-500/20 text-red-500 border-red-500/50',
  REFUNDED: 'bg-purple-500/20 text-purple-500 border-purple-500/50',
};

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPage: 1,
    total: 0,
  });

  // State cho Modal chi tiết
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- FETCH DATA ---
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/orders', {
        params: { page, limit: 10, search: searchTerm },
      });
      if (res && Array.isArray(res.data)) {
        setOrders(res.data);
        if (res.meta)
          setPagination({
            page: Number(res.meta.page),
            totalPage: Number(res.meta.totalPage),
            total: Number(res.meta.total),
            limit: Number(res.meta.limit),
          });
      }
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  // --- XEM CHI TIẾT ---
  const handleViewDetail = async (id) => {
    try {
      const res = await axiosClient.get(`/admin/orders/${id}`);
      setSelectedOrder(res);
    } catch (error) {
      alert('Không thể tải chi tiết đơn hàng');
    }
  };

  // --- CẬP NHẬT TRẠNG THÁI ---
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    if (!window.confirm(`Bạn có chắc muốn đổi trạng thái thành ${newStatus}?`))
      return;

    try {
      setIsUpdating(true);
      await axiosClient.patch(`/admin/orders/${selectedOrder.id}/status`, {
        status: newStatus,
      });

      // Cập nhật lại UI
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      fetchOrders(pagination.page); // Reload list bên ngoài
      alert('Cập nhật thành công!');
    } catch (error) {
      alert('Lỗi cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CreditCard className="text-vtv-green" /> Quản lý Đơn hàng
        </h1>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc email khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders(1)}
            className="w-full bg-slate-950 border border-slate-700 text-gray-300 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-vtv-green"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950 text-gray-400 text-sm border-b border-slate-800">
              <th className="p-4">Mã đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-4 font-mono font-bold text-white">
                    {order.code}
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    <div className="font-bold text-white">
                      {order.user?.fullName || 'Guest'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.user?.email}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-vtv-green">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="p-4 text-xs text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold border ${STATUS_COLORS[order.status] || 'text-gray-500'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleViewDetail(order.id)}
                      className="p-2 bg-slate-800 hover:bg-blue-500/20 text-blue-400 rounded-lg transition"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination (Tái sử dụng logic cũ) */}
        <div className="p-4 border-t border-slate-800 flex justify-center gap-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => fetchOrders(pagination.page - 1)}
            className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-3 py-1 text-white font-bold">
            {pagination.page} / {pagination.totalPage}
          </span>
          <button
            disabled={pagination.page === pagination.totalPage}
            onClick={() => fetchOrders(pagination.page + 1)}
            className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {/* --- MODAL CHI TIẾT --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="text-xl font-bold text-white">
                Chi tiết đơn {selectedOrder.code}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Info Khách */}
              <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Khách hàng
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-white">
                    <User size={16} /> {selectedOrder.user?.fullName}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 ml-6">
                    {selectedOrder.user?.email}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Ngày đặt
                  </p>
                  <p className="text-white mt-1 text-sm">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold border ${STATUS_COLORS[selectedOrder.status]}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">
                  Sản phẩm đã mua
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex gap-3"
                    >
                      <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center shrink-0">
                        {item.variant?.product?.thumbnail ? (
                          <img
                            src={item.variant.product.thumbnail}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Package size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">
                          {item.variant?.product?.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {item.variant?.name} x {item.quantity}
                        </div>
                        <div className="text-vtv-green font-mono text-sm mt-1">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                      {/* Hiển thị số lượng Key đã gửi (Admin ko xem key thật) */}
                      <div className="text-right">
                        <span className="text-xs bg-slate-800 text-gray-300 px-2 py-1 rounded border border-slate-700">
                          Đã gửi {item.stockItems?.length || 0} Key
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-gray-400 font-bold">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-vtv-green">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
              {/* Chỉ cho phép đổi trạng thái nếu chưa Completed/Canceled */}
              {selectedOrder.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus('CANCELED')}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold transition border border-red-500/20"
                  >
                    Hủy đơn
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-green-500 text-black hover:bg-green-400 rounded-lg font-bold transition shadow-lg shadow-green-500/20"
                  >
                    Xác nhận Hoàn thành
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
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

export default OrderListPage;
