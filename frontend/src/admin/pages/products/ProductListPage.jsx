import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Edit, Trash2, Eye,
  CheckCircle, XCircle, Package,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import đúng đường dẫn của bạn
import axiosClient from '../../../store/axiosClient'; 

// Hàm format tiền tệ
const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Gọi API lấy sản phẩm
      // result chính là dữ liệu từ backend trả về (vì axiosClient đã .data rồi)
      const result = await axiosClient.get('/admin/product', {
        params: { page: 1, limit: 100 },
      });

      console.log("Dữ liệu API trả về:", result); // Debug xem nó ra gì

      // --- LOGIC KIỂM TRA DỮ LIỆU AN TOÀN ---
      if (result && Array.isArray(result.product)) {
        // Trường hợp 1: Backend trả về dạng phân trang { product: [...], meta: ... }
        setProducts(result.product);
      } else if (Array.isArray(result)) {
        // Trường hợp 2: Backend trả về mảng trực tiếp [...]
        setProducts(result);
      } else {
        // Trường hợp 3: Không có dữ liệu hoặc sai định dạng -> Set rỗng để không lỗi map
        setProducts([]);
      }

    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
      // Nếu lỗi 403 (Cấm truy cập)
      if (error.response && error.response.status === 403) {
          alert("Tài khoản không có quyền Admin!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await axiosClient.delete(`/admin/product/${id}`);
        setProducts(products.filter((p) => p.id !== id));
        alert('Đã xóa thành công!');
      } catch (error) {
        console.error('Xóa thất bại:', error);
        alert('Lỗi: Không thể xóa sản phẩm này.');
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-vtv-green" /> Quản lý sản phẩm
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Danh sách tất cả sản phẩm đang có trong hệ thống.
          </p>
        </div>
        <Link
          to="/admin/products/create"
          className="bg-vtv-green text-black font-bold px-4 py-2 rounded-lg hover:bg-green-400 transition flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          <Plus size={20} /> Thêm sản phẩm
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-gray-300 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-vtv-green transition"
          />
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
              {loading ? (
                // Loading Skeleton
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/50 transition duration-150 group"
                  >
                    {/* 1. Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600"><Package size={20}/></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Category */}
                    <td className="p-4 text-sm text-gray-300">
                      <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                        {product.category?.name || 'N/A'}
                      </span>
                    </td>

                    {/* 3. Stock */}
                    <td className="p-4 text-center">
                      <span className={`font-bold ${product.totalStock > 0 ? 'text-vtv-green' : 'text-red-500'}`}>
                        {product.totalStock || 0}
                      </span>
                    </td>

                    {/* 4. Price */}
                    <td className="p-4 text-sm font-medium text-blue-300">
                      {product.variants && product.variants.length > 0
                        ? formatCurrency(product.variants[0].price)
                        : <span className="text-gray-500 italic">--</span>}
                    </td>

                    {/* 5. Status */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {product.isHot && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded border border-red-500/50 font-bold">HOT</span>}
                        {!product.isDeleted ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-gray-500" />}
                      </div>
                    </td>

                    {/* 6. Action */}
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
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;