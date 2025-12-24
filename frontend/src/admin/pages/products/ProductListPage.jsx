import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle,
  Package, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import axiosClient from '../../../store/axiosClient';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPage: 1,
    total: 0,
  });

  // --- 1. CALL API (ĐÃ NÂNG CẤP: Nhận thêm param search) ---
  const fetchProducts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const result = await axiosClient.get('/admin/product', {
        params: {
          page: page,
          limit: 10,
          search: search, // Gửi từ khóa lên Server
        },
      });

      if (result && Array.isArray(result.product)) {
        setProducts(result.product);
        if (result.meta) {
          setPagination((prev) => ({
            ...prev,
            page: Number(result.meta.page),
            totalPage: Number(result.meta.totalPage),
            total: Number(result.meta.total),
          }));
        }
      } else {
        setProducts([]);
        setPagination(prev => ({...prev, total: 0, totalPage: 1}));
      }
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LOGIC DEBOUNCE SEARCH (Chờ gõ xong 500ms mới gọi API) ---
  useEffect(() => {
      // Mỗi khi searchTerm thay đổi, đặt 1 cái hẹn 500ms
      const delayDebounceFn = setTimeout(() => {
          // Gọi API về trang 1 với từ khóa mới
          fetchProducts(1, searchTerm);
      }, 500);

      // Nếu người dùng gõ tiếp trong lúc đang chờ, hủy cái hẹn cũ đi
      return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Chạy lại khi searchTerm thay đổi

  // --- HÀM CHUYỂN TRANG ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPage) {
      // Khi chuyển trang, nhớ giữ nguyên từ khóa tìm kiếm hiện tại
      fetchProducts(newPage, searchTerm);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await axiosClient.delete(`/admin/product/${id}`);
        fetchProducts(pagination.page, searchTerm); // Load lại giữ nguyên trang & search
        alert('Đã xóa thành công!');
      } catch (error) {
        console.error('Xóa thất bại:', error);
        alert('Lỗi: Không thể xóa sản phẩm này.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-vtv-green" /> Quản lý sản phẩm
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Tổng cộng: <span className="text-white font-bold">{pagination.total}</span> sản phẩm 
            {searchTerm && ` phù hợp với "${searchTerm}"`}
          </p>
        </div>
        <Link
          to="/admin/products/create"
          className="bg-vtv-green text-black font-bold px-4 py-2 rounded-lg hover:bg-green-400 transition flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          <Plus size={20} /> Thêm sản phẩm
        </Link>
      </div>

      {/* Toolbar Tìm kiếm */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-gray-300 text-sm rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:border-vtv-green transition"
          />
          {/* Icon loading nhỏ trong ô search */}
          {loading && searchTerm && (
              <div className="absolute right-3 top-2.5">
                  <Loader2 size={16} className="animate-spin text-vtv-green"/>
              </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-gray-400 text-sm uppercase border-b border-slate-800">
                <th className="p-4 font-semibold">Sản phẩm</th>
                <th className="p-4 font-semibold">Danh mục</th>
                <th className="p-4 font-semibold text-center">Tồn kho</th>
                <th className="p-4 font-semibold">Giá bán (Min)</th>
                <th className="p-4 font-semibold text-center">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" /> Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                // Lặp trực tiếp products (vì server đã lọc rồi)
                products.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/50 transition duration-150 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600"><Package size={20} /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                        {product.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${product.totalStock > 0 ? 'text-vtv-green' : 'text-red-500'}`}>
                        {product.totalStock || 0}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-blue-300">
                      {product.variants && product.variants.length > 0 ? formatCurrency(product.variants[0].price) : <span className="text-gray-500 italic">--</span>}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {product.isHot && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded border border-red-500/50 font-bold">HOT</span>}
                        {!product.isDeleted ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-gray-500" />}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/product/${product.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg"><Eye size={18} /></Link>
                        <Link to={`/admin/products/edit/${product.id}`} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"><Edit size={18} /></Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

export default ProductListPage;