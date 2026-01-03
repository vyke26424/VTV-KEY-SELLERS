import React, { useEffect, useState } from 'react';
import {
  Plus,
  Filter,
  Trash2,
  Package,
  X,
  FileSpreadsheet,
  Key,
  Search,
} from 'lucide-react';
import axiosClient from '../../../store/axiosClient';
import * as XLSX from 'xlsx'; // Import thư viện đọc Excel

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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

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
          search: debouncedSearchTerm || undefined,
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reload khi đổi filter hoặc search
  useEffect(() => {
    fetchStocks(1);
  }, [activeStatus, debouncedSearchTerm]);

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
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 shrink-0">
          <Filter size={18} className="text-gray-500" />
          <span className="text-gray-400 text-sm font-bold">
            Lọc trạng thái:
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveStatus('')}
            className={`px-3 py-1 text-xs font-bold rounded border ${
              activeStatus === ''
                ? 'bg-white text-black border-white'
                : 'bg-slate-800 text-gray-400 border-slate-700'
            }`}
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

        <div className="flex-grow h-px bg-slate-800 hidden md:block"></div>

        {/* Search Input */}
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tra cứu key, sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-vtv-green w-full sm:w-64"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950 text-gray-400 text-sm border-b border-slate-800">
              <th className="p-4">Sản phẩm / Gói</th>
              <th className="p-4">Key (Credential)</th>
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
                  <td
                    className="p-4 font-mono text-gray-400 text-sm tracking-widest max-w-xs truncate"
                    title={item.credential}
                  >
                    {item.credential}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold border ${
                        STATUS_COLORS[item.status]
                      }`}
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

  // State quản lý nhập liệu
  const [rawKeys, setRawKeys] = useState(''); // Dùng cho nhập tay
  const [fileKeys, setFileKeys] = useState([]); // Dùng cho file (Lưu ngầm)
  const [fileName, setFileName] = useState(''); // Tên file đã upload
  const [inputMode, setInputMode] = useState('MANUAL'); // 'MANUAL' hoặc 'FILE'

  const [loading, setLoading] = useState(false);

  // 1. Load danh sách sản phẩm
  useEffect(() => {
    const fetchProds = async () => {
      const res = await axiosClient.get('/admin/product', {
        params: { limit: 100 },
      });
      if (res && res.product) setProducts(res.product);
    };
    fetchProds();
  }, []);

  // 2. Load variants
  useEffect(() => {
    if (selectedProduct) {
      const prod = products.find((p) => p.id === Number(selectedProduct));
      setVariants(prod?.variants || []);
      setSelectedVariantId('');
    }
  }, [selectedProduct]);

  // 3. Xử lý Upload Excel (BLIND READ)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset lại để nhập mới
    setRawKeys('');
    setFileKeys([]);
    setFileName(file.name);
    setInputMode('FILE'); // Chuyển sang chế độ File

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Lọc lấy key, loại bỏ dòng trống
        const keysFromFile = data
          .map((row) => row[0])
          .filter(
            (item) => item && typeof item === 'string' && item.trim() !== '',
          );

        // LƯU NGẦM VÀO BIẾN fileKeys, KHÔNG SHOW RA UI
        setFileKeys(keysFromFile);

        // Reset input file để chọn lại được file cũ nếu muốn
        e.target.value = null;
      } catch (error) {
        alert('Lỗi đọc file Excel.');
        setInputMode('MANUAL');
      }
    };
    reader.readAsBinaryString(file);
  };

  // 4. Submit
  const handleSubmit = async () => {
    // Xác định nguồn key dựa trên chế độ
    let finalKeys = [];
    if (inputMode === 'FILE') {
      finalKeys = fileKeys;
    } else {
      finalKeys = rawKeys.split('\n').filter((k) => k.trim() !== '');
    }

    if (!selectedVariantId || finalKeys.length === 0)
      return alert('Vui lòng chọn gói và nhập ít nhất 1 key!');

    try {
      setLoading(true);
      await axiosClient.post('/admin/stocks', {
        variantId: Number(selectedVariantId),
        credentials: finalKeys, // Gửi mảng key lên server
        metadata: {},
      });
      alert(`Đã nhập kho thành công ${finalKeys.length} key!`);
      onSuccess();
    } catch (error) {
      alert('Lỗi nhập kho: ' + (error.response?.data?.message || 'Lỗi server'));
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi lại nhập tay
  const switchToManual = () => {
    setInputMode('MANUAL');
    setFileKeys([]);
    setFileName('');
    setRawKeys('');
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
          {/* Chọn Sản phẩm & Gói (Giữ nguyên) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                1. Sản phẩm
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-vtv-green"
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">-- Chọn --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">2. Gói</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-vtv-green"
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                disabled={!selectedProduct}
              >
                <option value="">-- Chọn --</option>
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} - {v.price}đ
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Khu vực Nhập Key */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-400">
                3. Nguồn dữ liệu
              </label>

              {/* Nút Upload */}
              <label className="flex items-center gap-1 text-xs bg-vtv-green/10 hover:bg-vtv-green/20 text-vtv-green px-3 py-1.5 rounded cursor-pointer border border-vtv-green/30 transition font-bold">
                <FileSpreadsheet size={16} />
                <span>Tải file Excel/CSV</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {/* LOGIC HIỂN THỊ DỰA TRÊN CHẾ ĐỘ */}
            {inputMode === 'FILE' ? (
              // --- CHẾ ĐỘ FILE: ẨN NỘI DUNG ---
              <div className="w-full h-40 bg-slate-950 border border-dashed border-vtv-green rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-vtv-green/5 animate-pulse"></div>
                <FileSpreadsheet size={40} className="text-vtv-green mb-2" />
                <p className="text-white font-bold">{fileName}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Đã đọc an toàn{' '}
                  <span className="text-vtv-green font-bold text-lg">
                    {fileKeys.length}
                  </span>{' '}
                  key
                </p>
                <p className="text-gray-500 text-[10px] mt-2 italic flex items-center gap-1">
                  <Key size={10} /> Nội dung đã được ẩn để bảo mật
                </p>

                <button
                  onClick={switchToManual}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-1"
                  title="Hủy file"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              // --- CHẾ ĐỘ NHẬP TAY: HIỆN TEXTAREA ---
              <div className="relative">
                <textarea
                  rows="6"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white font-mono text-sm outline-none focus:border-vtv-green"
                  placeholder="Dán key vào đây nếu nhập thủ công..."
                  value={rawKeys}
                  onChange={(e) => setRawKeys(e.target.value)}
                ></textarea>
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-slate-900 px-2 rounded">
                  {rawKeys
                    ? rawKeys.split('\n').filter((k) => k.trim()).length
                    : 0}{' '}
                  dòng
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !selectedVariantId ||
              (inputMode === 'FILE'
                ? fileKeys.length === 0
                : !rawKeys.trim())
            }
            className="w-full bg-vtv-green text-black font-bold py-3 rounded-lg hover:bg-green-400 transition disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-green-500/20"
          >
            {loading ? 'Đang mã hóa & Lưu...' : 'Xác nhận Nhập kho'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockListPage;
