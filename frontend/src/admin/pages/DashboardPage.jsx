import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, DollarSign, Package, Users, 
  ArrowUpRight, ShoppingCart, Clock, Crown, Zap 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import axiosClient from '../../store/axiosClient';

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu Dashboard
  const fetchDashboard = async () => {
    try {
      const res = await axiosClient.get('/admin/dashboard');
      setData(res);
    } catch (error) {
      console.error("Lỗi tải dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 2. Hàm Toggle HOT cho sản phẩm bán chạy
  const handleToggleHot = async (productId, currentStatus) => {
    if(!window.confirm(`Bạn có muốn ${currentStatus ? 'tắt' : 'bật'} HOT cho sản phẩm này?`)) return;
    try {
        await axiosClient.patch(`/admin/product/${productId}`, { isHot: !currentStatus });
        alert("Đã cập nhật trạng thái HOT!");
        fetchDashboard(); // Load lại để cập nhật UI
    } catch (error) {
        alert("Lỗi cập nhật: " + error.message);
    }
  };

  if (loading) return <div className="text-white text-center py-20">Đang tải dữ liệu thống kê...</div>;
  if (!data) return <div className="text-white">Không có dữ liệu.</div>;

  const { stats, chartData, recentOrders, bestSellers } = data;

  // Cấu hình Cards
  const statsConfig = [
    { title: 'Doanh thu', value: formatCurrency(stats.revenue), icon: DollarSign, color: 'text-vtv-green', bg: 'bg-green-500/10' },
    { title: 'Đơn hàng', value: stats.orders, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Khách hàng', value: stats.users, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Sản phẩm', value: stats.products, icon: ShoppingCart, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-white">Tổng quan Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Dữ liệu kinh doanh thời gian thực</p>
        </div>
      </div>

      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. BIỂU ĐỒ DOANH THU */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-vtv-green"/> Biểu đồ doanh thu (7 ngày)
             </h3>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* 3. ĐƠN HÀNG MỚI */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-500"/> Đơn mới nhất
             </h3>
             <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                        <div>
                            <div className="text-white font-bold text-sm truncate w-32">{order.user?.fullName || 'Khách lẻ'}</div>
                            <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleTimeString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-vtv-green font-bold text-sm">{formatCurrency(order.totalAmount)}</div>
                            <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">{order.status}</span>
                        </div>
                    </div>
                )) : <p className="text-gray-500 text-sm text-center">Chưa có đơn hàng nào.</p>}
             </div>
          </div>
      </div>

      {/* 4. TOP SẢN PHẨM BÁN CHẠY (Mới) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Crown size={20} className="text-yellow-400"/> Top sản phẩm bán chạy (Cần đẩy HOT 🔥)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-slate-950 text-xs uppercase font-bold text-gray-500">
                    <tr>
                        <th className="p-4">Sản phẩm</th>
                        <th className="p-4 text-center">Đã bán</th>
                        <th className="p-4 text-right">Doanh thu gói</th>
                        <th className="p-4 text-center">Trạng thái HOT</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {bestSellers.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50 transition">
                            <td className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                                    {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover"/> : '📦'}
                                </div>
                                <div>
                                    <div className="text-white font-bold">{item.productName}</div>
                                    <div className="text-xs text-blue-400">{item.variantName}</div>
                                </div>
                            </td>
                            <td className="p-4 text-center text-white font-bold">{item.sold}</td>
                            <td className="p-4 text-right text-vtv-green font-mono">{formatCurrency(item.revenue)}</td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => handleToggleHot(item.productId, item.isHot)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 mx-auto ${
                                        item.isHot 
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                                        : 'bg-slate-800 text-gray-500 border border-slate-700 hover:bg-slate-700'
                                    }`}
                                >
                                    {item.isHot ? <><Zap size={10} fill="currentColor"/> ĐANG HOT</> : 'Bình thường'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>

    </div>
  );
};

export default DashboardPage;