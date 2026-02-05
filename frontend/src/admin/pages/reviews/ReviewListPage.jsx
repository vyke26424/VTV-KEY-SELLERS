import React, { useEffect, useState } from 'react';
import { Star, Trash2, Search, MessageSquare, User, Package, ChevronLeft, ChevronRight } from 'lucide-react';
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
        // Lọc bỏ các review đã bị xóa (nếu backend trả về soft-delete)
        setReviews(res.data.filter(r => !r.isDeleted));
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
    if (!window.confirm('Bạn chắc chắn muốn xóa vĩnh viễn đánh giá này?')) return;
    try {
      await axiosClient.delete(`/admin/reviews/${id}`);
      alert('Đã xóa đánh giá!');
      fetchReviews(pagination.page);
    } catch (error) {
      alert('Lỗi xóa review');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPage) {
      fetchReviews(newPage);
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
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(rv.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition" title="Xóa review này">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Chưa có đánh giá nào.</td></tr>
            )}
          </tbody>
        </table>
        
        {/* Thanh Phân Trang */}
        {pagination.totalPage > 1 && (
            <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900">
            <span className="text-sm text-gray-400">
                Trang <span className="text-white font-bold">{pagination.page}</span> / {pagination.totalPage}
            </span>
            <div className="flex items-center gap-2">
                <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition"><ChevronLeft size={20} /></button>
                
                <div className="flex gap-1">
                {Array.from({ length: pagination.totalPage }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPage || Math.abs(p - pagination.page) <= 2)
                    .map((pageNum, index, array) => {
                        const isGap = index > 0 && pageNum - array[index - 1] > 1;
                        return (
                            <React.Fragment key={pageNum}>
                            {isGap && <span className="px-2 text-gray-600">...</span>}
                            <button 
                                onClick={() => handlePageChange(pageNum)} 
                                className={`w-9 h-9 rounded-lg text-sm font-bold transition ${pagination.page === pageNum ? 'bg-vtv-green text-black shadow-lg shadow-green-500/20' : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white border border-slate-700'}`}
                            >
                                {pageNum}
                            </button>
                            </React.Fragment>
                        );
                    })}
                </div>

                <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPage || loading} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition"><ChevronRight size={20} /></button>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReviewListPage;