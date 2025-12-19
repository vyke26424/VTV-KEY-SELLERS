import React from 'react';
import { TrendingUp, DollarSign, Package, Users } from 'lucide-react';

const DashboardPage = () => {
  // Mock data cards
  const stats = [
    {
      title: 'Doanh thu',
      value: '125.000.000đ',
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Đơn hàng',
      value: '1,234',
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Khách hàng',
      value: '856',
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Tăng trưởng',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Tổng quan Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-xs font-bold bg-slate-800 text-gray-400 px-2 py-1 rounded">
                +2.5%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-gray-500">
        Khu vực biểu đồ (Sẽ tích hợp Recharts sau)
      </div>
    </div>
  );
};

export default DashboardPage;
