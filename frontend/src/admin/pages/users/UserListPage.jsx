import React, { useEffect, useState } from 'react';
import { Search, Eye, Users, User, DollarSign, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosClient from '../../../store/axiosClient';

// Format tiền
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPage: 1, total: 0 });
    
    // State Modal Chi tiết
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch Data
    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/admin/users', {
                params: { page, limit: 10, search: searchTerm, role: 'USER' }
            });
            if (res && Array.isArray(res.data)) {
                setUsers(res.data);
                if (res.meta) setPagination({
                    page: Number(res.meta.page),
                    totalPage: Number(res.meta.totalPage),
                    total: Number(res.meta.total),
                    limit: Number(res.meta.limit)
                });
            }
        } catch (error) {
            console.error("Lỗi tải user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(1); }, []);

    // Xem chi tiết
    const handleViewDetail = async (id) => {
        try {
            const res = await axiosClient.get(`/admin/users/${id}`);
            setSelectedUser(res);
        } catch (error) {
            alert("Lỗi tải chi tiết");
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="text-vtv-green"/> Quản lý Người dùng</h1>
                    <p className="text-gray-400 text-sm mt-1">Tổng: {pagination.total} tài khoản</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    <input 
                        type="text" placeholder="Tìm theo email hoặc tên..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchUsers(1)}
                        className="w-full bg-slate-950 border border-slate-700 text-gray-300 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-vtv-green"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-950 text-gray-400 text-sm border-b border-slate-800">
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Vai trò</th>
                            <th className="p-4">Số dư ví</th>
                            <th className="p-4 text-center">Đơn hàng</th>
                            <th className="p-4">Ngày tham gia</th>
                            <th className="p-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Đang tải...</td></tr>
                        ) : users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-800/50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">
                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{user.fullName || 'Chưa đặt tên'}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold border 
                                            ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-blue-500/20 text-blue-500 border-blue-500/50'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-vtv-green">{formatCurrency(user.balance)}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-slate-800 px-2 py-1 rounded text-xs text-gray-300">{user._count?.orders || 0}</span>
                                    </td>
                                    <td className="p-4 text-xs text-gray-400">{formatDate(user.createdAt)}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleViewDetail(user.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition">
                                            <Eye size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy user nào.</td></tr>
                        )}
                    </tbody>
                </table>
                {/* Pagination (Giống các trang khác) */}
                <div className="p-4 border-t border-slate-800 flex justify-center gap-2">
                    <button disabled={pagination.page===1} onClick={() => fetchUsers(pagination.page-1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50">Trước</button>
                    <span className="px-3 py-1 text-white font-bold">{pagination.page} / {pagination.totalPage}</span>
                    <button disabled={pagination.page===pagination.totalPage} onClick={() => fetchUsers(pagination.page+1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50">Sau</button>
                </div>
            </div>

            {/* --- MODAL CHI TIẾT USER --- */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                        <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><Users size={24}/></button>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                {selectedUser.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedUser.fullName}</h2>
                                <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                                <div className="mt-1 flex gap-2">
                                    <span className="bg-vtv-green/20 text-vtv-green text-xs px-2 py-0.5 rounded border border-vtv-green/30">Số dư: {formatCurrency(selectedUser.balance)}</span>
                                    <span className="bg-slate-700 text-gray-300 text-xs px-2 py-0.5 rounded">ID: {selectedUser.id}</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Lịch sử đơn hàng gần đây</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedUser.orders?.length > 0 ? (
                                selectedUser.orders.map(order => (
                                    <div key={order.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                                        <div>
                                            <div className="font-mono text-white text-sm font-bold">{order.code || `#${order.id}`}</div>
                                            <div className="text-xs text-gray-500">{formatDate(order.createdAt)} • {order._count.items} món</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-vtv-green font-bold text-sm">{formatCurrency(order.totalAmount)}</div>
                                            <div className={`text-[10px] uppercase font-bold mt-1 ${order.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}`}>{order.status}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 py-4">Chưa có đơn hàng nào.</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserListPage;