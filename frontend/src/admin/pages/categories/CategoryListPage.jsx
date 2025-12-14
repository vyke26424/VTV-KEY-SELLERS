import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Edit, Trash2, FolderTree, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import axiosClient from '../../../store/axiosClient';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State phân trang
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, totalPage: 1, total: 0
  });

  // --- 1. GỌI API LẤY DANH MỤC ---
  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/categories', {
        params: { page, limit: 10, search: searchTerm }
      });

      console.log("Categories Data:", res);

      // Map dữ liệu (Lưu ý backend trả về { data: [], metadata: {} })
      if (res && Array.isArray(res.data)) {
        setCategories(res.data);
        if (res.metadata) {
            setPagination({
                page: Number(res.metadata.page),
                limit: Number(res.metadata.limit),
                totalPage: Number(res.metadata.totalPage),
                total: Number(res.metadata.total)
            });
        }
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1);
  }, []); // Reload khi mount

  // Debounce search (đợi user ngừng gõ mới gọi API)
  useEffect(() => {
      const delaySearch = setTimeout(() => {
          fetchCategories(1);
      }, 500);
      return () => clearTimeout(delaySearch);
  }, [searchTerm]);


  // --- 2. XÓA DANH MỤC ---
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await axiosClient.delete(`/admin/categories/${id}`);
        fetchCategories(pagination.page); // Reload lại trang
        alert('Đã xóa thành công!');
      } catch (error) {
        console.error("Xóa lỗi:", error);
        alert('Không thể xóa danh mục này (Có thể đang chứa sản phẩm).');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FolderTree className="text-vtv-green"/> Quản lý Danh mục
            </h1>
            <p className="text-gray-400 text-sm mt-1">Tổng: {pagination.total} danh mục</p>
        </div>
        <Link 
            to="/admin/categories/create"
            className="bg-vtv-green text-black font-bold px-4 py-2 rounded-lg hover:bg-green-400 flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
            <Plus size={20}/> Thêm danh mục
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18}/>
            <input 
                type="text" placeholder="Tìm kiếm danh mục..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-gray-300 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-vtv-green"
            />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
            <thead>
                <tr className="bg-slate-950 text-gray-400 text-sm border-b border-slate-800">
                    <th className="p-4">ID</th>
                    <th className="p-4">Tên danh mục</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4 text-center">Số sản phẩm</th>
                    <th className="p-4 text-right">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Đang tải...</td></tr>
                ) : categories.length > 0 ? (
                    categories.map(cat => (
                        <tr key={cat.id} className="hover:bg-slate-800/50 transition group">
                            <td className="p-4 text-gray-500">#{cat.id}</td>
                            <td className="p-4 font-bold text-white">{cat.name}</td>
                            <td className="p-4 text-gray-400 text-sm font-mono">{cat.slug}</td>
                            <td className="p-4 text-center">
                                <span className="bg-slate-800 px-2 py-1 rounded text-xs text-white border border-slate-700">
                                    {cat._count?.products || 0} SP
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <Link to={`/admin/categories/edit/${cat.id}`} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                                        <Edit size={18}/>
                                    </Link>
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Không tìm thấy dữ liệu.</td></tr>
                )}
            </tbody>
        </table>
        
        {/* Pagination Simple */}
        <div className="p-4 border-t border-slate-800 flex justify-center gap-2">
            <button 
                disabled={pagination.page === 1}
                onClick={() => fetchCategories(pagination.page - 1)}
                className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-slate-700"
            >Trước</button>
            <span className="px-3 py-1 text-white font-bold">{pagination.page} / {pagination.totalPage}</span>
            <button 
                disabled={pagination.page === pagination.totalPage}
                onClick={() => fetchCategories(pagination.page + 1)}
                className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-slate-700"
            >Sau</button>
        </div>
      </div>

    </div>
  );
};

export default CategoryListPage;