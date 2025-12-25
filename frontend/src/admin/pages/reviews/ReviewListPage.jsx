import React, { useEffect, useState } from 'react';
import { Star, Trash2, Search, MessageSquare, User, Package } from 'lucide-react';
import axiosClient from '../../../store/axiosClient';

const ReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPage: 1 });

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/reviews', { params: { page, limit: 10 } });
      if (res.data) {
        setReviews(res.data);
        setPagination({ page: res.meta.page, totalPage: res.meta.totalPage });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn ẩn đánh giá này?')) return;
    try {
      await axiosClient.delete(`/admin/reviews/${id}`);
      alert('Đã ẩn đánh giá!');
      fetchReviews(pagination.page);
    } catch (error) {
      alert('Lỗi xóa review');
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <MessageSquare className="text-vtv-green" /> Quản lý Đánh giá
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950 text-gray-400 text-sm border-b border-slate-800">
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Sản phẩm</th>
              <th className="p-4">Đánh giá</th>
              <th className="p-4">Nội dung</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Đang tải...</td></tr>
            ) : reviews.length > 0 ? (
              reviews.map((rv) => (
                <tr key={rv.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2 font-bold text-white">
                        <User size={14}/> {rv.user?.fullName}
                    </div>
                    <div className="text-xs text-gray-500 ml-5">{rv.user?.email}</div>
                  </td>
                  <td className="p-4 text-sm text-vtv-green font-medium">
                    <div className="flex items-center gap-2">
                        <Package size={14}/> {rv.product?.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rv.rating ? "currentColor" : "none"} className={i < rv.rating ? "" : "text-gray-700"} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300 max-w-xs truncate" title={rv.comment}>
                    {rv.comment}
                  </td>
                  <td className="p-4 text-center">
                    {rv.isDeleted ? (
                        <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded border border-red-500/20">Đã ẩn</span>
                    ) : (
                        <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/20">Hiển thị</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {!rv.isDeleted && (
                        <button onClick={() => handleDelete(rv.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition" title="Ẩn review này">
                        <Trash2 size={18} />
                        </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Chưa có đánh giá nào.</td></tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination đơn giản */}
        <div className="p-4 border-t border-slate-800 flex justify-center gap-2">
            <button disabled={pagination.page === 1} onClick={() => fetchReviews(pagination.page - 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50">Trước</button>
            <span className="px-3 py-1 text-white">{pagination.page} / {pagination.totalPage}</span>
            <button disabled={pagination.page === pagination.totalPage} onClick={() => fetchReviews(pagination.page + 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50">Sau</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewListPage;