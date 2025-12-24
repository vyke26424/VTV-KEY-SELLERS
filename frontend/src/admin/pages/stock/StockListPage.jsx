import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Edit,
  Key,
  Package,
  X,
} from 'lucide-react';
import axiosClient from '../../../store/axiosClient';

// --- TIỆN ÍCH ---
const STATUS_COLORS = {
  AVAILABLE: 'bg-green-500/20 text-green-500 border-green-500/50',
  SOLD: 'bg-blue-500/20 text-blue-500 border-blue-500/50',
  LOCKED: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
};

const StockListPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPage: 1,
    total: 0,
  });

  // Filter State
  const [activeStatus, setActiveStatus] = useState(''); // '' = ALL

  // Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);

  // Fetch Data
  const fetchStocks = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/stocks', {
        params: {
          page,
          limit: 20,
          status: activeStatus || undefined,
        },
      });

      if (res && Array.isArray(res.data)) {
        setStocks(res.data);
        if (res.meta)
          setPagination({
            page: Number(res.meta.page),
            totalPage: Number(res.meta.totalPage),
            total: Number(res.meta.total),
            limit: Number(res.meta.limit),
          });
      }
    } catch (error) {
      console.error('Lỗi tải kho:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reload khi đổi filter
  useEffect(() => {
    fetchStocks(1);
  }, [activeStatus]);

  // --- XÓA KEY ---
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa Key này không?')) return;
    try {
      await axiosClient.delete(`/admin/stocks/${id}`);
      alert('Đã xóa thành công!');
      fetchStocks(pagination.page);
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể xóa key này');
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-vtv-green" /> Quản lý Kho Key
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Tổng: {pagination.total} key trong hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowImportModal(true)}
          className="bg-vtv-green text-black font-bold px-4 py-2 rounded-lg hover:bg-green-400 flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          <Plus size={20} /> Nhập kho
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <span className="text-gray-400 text-sm font-bold">
            Lọc trạng thái:
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveStatus('')}
            className={`px-3 py-1 text-xs font-bold rounded border ${activeStatus === '' ? 'bg-white text-black border-white' : 'bg-slate-800 text-gray-400 border-slate-700'}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveStatus('AVAILABLE')}
            className={`px-3 py-1 text-xs font-bold rounded border transition ${
              activeStatus === 'AVAILABLE' 
                ? 'bg-green-500 text-black border-green-500' 
                : 'bg-slate-800 text-green-500 border-slate-700 hover:border-green-500/50'
            }`}
          >
            Chưa bán
          </button>
          <button
            onClick={() => setActiveStatus('LOCKED')}
            className={`px-3 py-1 text-xs font-bold rounded border transition ${
              activeStatus === 'LOCKED'
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'bg-slate-800 text-yellow-500 border-slate-700 hover:border-yellow-500/50'
            }`}
          >
            Đang giữ
          </button>
          <button
            onClick={() => setActiveStatus('SOLD')}
            className={`px-3 py-1 text-xs font-bold rounded border transition ${
              activeStatus === 'SOLD' 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-slate-800 text-blue-500 border-slate-700 hover:border-blue-500/50'
            }`}
          >
            Đã bán
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950 text-gray-400 text-sm border-b border-slate-800">
              <th className="p-4">Sản phẩm / Gói</th>
              <th className="p-4">Key (Mã hóa)</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4">Người mua</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : stocks.length > 0 ? (
              stocks.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">
                      {item.productName || 'Unknown Product'}
                    </div>
                    <div className="text-xs text-vtv-green mt-0.5">
                      {item.variantName || 'Unknown Variant'}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-gray-400 text-sm tracking-widest">
                    {item.credential}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold border ${STATUS_COLORS[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {item.status === 'SOLD' ? (
                      <div className="text-xs">
                        <span className="block text-white">
                          Đơn: #{item.orderCode}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs italic">--</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'AVAILABLE' && (
                      <div className="flex justify-end gap-2">
                        {/* Nút sửa (Tạm thời chưa làm modal sửa) */}
                        {/* <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit size={16}/></button> */}

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Kho đang trống hoặc không tìm thấy.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 flex justify-center gap-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => fetchStocks(pagination.page - 1)}
            className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-3 py-1 text-white font-bold">
            {pagination.page} / {pagination.totalPage}
          </span>
          <button
            disabled={pagination.page === pagination.totalPage}
            onClick={() => fetchStocks(pagination.page + 1)}
            className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {/* --- MODAL NHẬP KHO (ImportModal) --- */}
      {showImportModal && (
        <ImportStockModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            fetchStocks(1);
            setShowImportModal(false);
          }}
        />
      )}
    </div>
  );
};

// --- COMPONENT CON: Modal Nhập Kho ---
const ImportStockModal = ({ onClose, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [rawKeys, setRawKeys] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Load danh sách sản phẩm để chọn
  useEffect(() => {
    const fetchProds = async () => {
      // Gọi API lấy list sản phẩm (Lấy 100 cái mới nhất để chọn)
      const res = await axiosClient.get('/admin/product', {
        params: { limit: 100 },
      });
      if (res && res.product) setProducts(res.product);
    };
    fetchProds();
  }, []);

  // 2. Khi chọn sản phẩm -> Load variants của nó
  useEffect(() => {
    if (selectedProduct) {
      const prod = products.find((p) => p.id === Number(selectedProduct));
      setVariants(prod?.variants || []);
      setSelectedVariantId('');
    }
  }, [selectedProduct]);

  // 3. Submit
  const handleSubmit = async () => {
    if (!selectedVariantId || !rawKeys.trim())
      return alert('Vui lòng chọn gói và nhập key!');

    // Tách dòng thành mảng key
    const keysArray = rawKeys.split('\n').filter((k) => k.trim() !== '');

    try {
      setLoading(true);
      await axiosClient.post('/admin/stocks', {
        variantId: Number(selectedVariantId),
        credentials: keysArray,
        metadata: {},
      });
      alert(`Đã nhập thành công ${keysArray.length} key!`);
      onSuccess();
    } catch (error) {
      alert('Lỗi nhập kho: ' + (error.response?.data?.message || 'Lỗi server'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus size={20} className="text-vtv-green" /> Nhập kho hàng loạt
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Chọn Sản phẩm */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              1. Chọn Sản phẩm
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-vtv-green"
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn Variant */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              2. Chọn Gói (Variant)
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-vtv-green"
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              disabled={!selectedProduct}
            >
              <option value="">-- Chọn gói --</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} - {v.price}đ
                </option>
              ))}
            </select>
          </div>

          {/* Nhập Key */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              3. Danh sách Key (Mỗi key 1 dòng)
            </label>
            <textarea
              rows="6"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white font-mono text-sm outline-none focus:border-vtv-green"
              placeholder="user|pass&#10;user2|pass2&#10;AAAA-BBBB-CCCC-DDDD"
              value={rawKeys}
              onChange={(e) => setRawKeys(e.target.value)}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1 text-right">
              Đang nhập: {rawKeys.split('\n').filter((k) => k.trim()).length}{' '}
              key
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedVariantId || !rawKeys.trim()}
            className="w-full bg-vtv-green text-black font-bold py-3 rounded-lg hover:bg-green-400 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận Nhập kho'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockListPage;
