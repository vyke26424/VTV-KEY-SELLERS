import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react';
import ProductCard from '../components/ProductCard'; // Import card ở trên
//import axiosClient from '../store/axiosClient';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // Lấy từ khóa từ URL (?q=...)

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance'); // relevance, price-asc, price-desc

  // --- DỮ LIỆU MOCK ĐỂ TEST GIAO DIỆN (Sau này xóa đi) ---
  const mockDatabase = [
    { id: 1, name: 'Netflix Premium 4K', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg', isHot: true, variants: [{price: 65000}] },
    { id: 2, name: 'Spotify Premium', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', isHot: false, variants: [{price: 290000}] },
    { id: 3, name: 'YouTube Premium', thumbnail: null, isHot: true, variants: [{price: 25000}] },
    { id: 4, name: 'Windows 11 Pro', thumbnail: null, isHot: false, variants: [{price: 150000}] },
    { id: 5, name: 'ChatGPT Plus', thumbnail: null, isHot: true, variants: [{price: 450000}] },
  ];

  useEffect(() => {
    // Giả lập gọi API tìm kiếm
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // --- TODO: SAU NÀY BẠN THAY BẰNG GỌI API THẬT ---
        // const { data } = await axiosClient.get(`/products?search=${query}&sort=${sortBy}`);
        // setProducts(data);
        // ------------------------------------------------

        // Logic Mock tạm thời: Lọc theo tên
        await new Promise(resolve => setTimeout(resolve, 800)); // Delay giả 0.8s cho giống thật
        
        const filtered = mockDatabase.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);

      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, sortBy]); // Chạy lại khi từ khóa hoặc sort thay đổi

  return (
    <div className="min-h-screen bg-vtv-dark pb-20">
      
      {/* Header kết quả */}
      <div className="bg-slate-900 border-b border-slate-800 pt-8 pb-8 px-4">
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-gray-400 text-sm mb-1">Kết quả tìm kiếm cho:</p>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Search className="text-vtv-green" size={32}/> 
                        "{query}"
                    </h1>
                </div>
                <div className="text-gray-400 text-sm">
                    Tìm thấy <span className="text-white font-bold">{products.length}</span> sản phẩm
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Toolbar: Bộ lọc & Sắp xếp */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-vtv-card p-4 rounded-xl border border-slate-700">
            {/* Bộ lọc nhanh (UI Only) */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
                <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 whitespace-nowrap border border-slate-600">
                    <SlidersHorizontal size={16}/> Bộ lọc
                </button>
                <button className="bg-vtv-green/10 text-vtv-green border border-vtv-green px-4 py-2 rounded-lg text-sm whitespace-nowrap font-medium">
                    Tất cả
                </button>
                <button className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap transition">
                    Giải trí
                </button>
                <button className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap transition">
                    Làm việc
                </button>
            </div>

            {/* Sắp xếp */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-gray-400 text-sm hidden sm:block">Sắp xếp:</span>
                <div className="relative flex-1 sm:flex-none">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-48 appearance-none bg-slate-900 border border-slate-600 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-vtv-green cursor-pointer text-sm"
                    >
                        <option value="relevance">Liên quan nhất</option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                        <option value="newest">Mới nhất</option>
                    </select>
                    <ArrowDownWideNarrow size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none"/>
                </div>
            </div>
        </div>

        {/* --- GRID SẢN PHẨM --- */}
        {loading ? (
            // Skeleton Loading (Hiệu ứng đang tải)
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-slate-800/50 rounded-xl h-80 animate-pulse"></div>
                ))}
            </div>
        ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            // Trạng thái RỖNG (Không tìm thấy)
            <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                <div className="inline-block p-6 bg-slate-800 rounded-full mb-4">
                    <Search size={48} className="text-gray-600"/>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy kết quả nào</h2>
                <p className="text-gray-400 mb-6">Hãy thử tìm với từ khóa khác hoặc xem các danh mục phổ biến.</p>
                <Link to="/" className="bg-vtv-green text-black font-bold px-6 py-3 rounded-full hover:bg-green-400 transition">
                    Về trang chủ
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;