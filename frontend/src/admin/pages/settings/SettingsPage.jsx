import React, { useEffect, useState } from 'react';
import { Save, User, Lock, Bell, Shield, CreditCard } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore'; // Lấy thông tin Admin đang login
import axiosClient from '../../../store/axiosClient';

const SettingsPage = () => {
  const { user } = useAuthStore(); // Lấy user từ Zustand store
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // State form profile
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  // State cấu hình (Mock)
  const [config, setConfig] = useState({
    maintenanceMode: false,
    emailNotification: true,
    bankInfo: 'MB Bank - 999999999 - NGUYEN VAN A'
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Gọi API update profile (Cần backend hỗ trợ route PATCH /me hoặc /users/:id)
        // Ở đây demo success
        await new Promise(r => setTimeout(r, 1000)); 
        alert("Cập nhật thông tin thành công!");
    } catch (error) {
        alert("Lỗi cập nhật.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Shield className="text-vtv-green"/> Cài đặt hệ thống
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Menu nhỏ */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 h-fit">
            <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab==='profile' ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <User size={18}/> Thông tin cá nhân
            </button>
            <button 
                onClick={() => setActiveTab('system')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab==='system' ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Lock size={18}/> Cấu hình hệ thống
            </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
            {activeTab === 'profile' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Thông tin tài khoản</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email (Không thể thay đổi)</label>
                            <input type="text" value={profile.email} disabled className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-gray-500 cursor-not-allowed"/>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Họ và tên</label>
                            <input 
                                type="text" 
                                value={profile.fullName} 
                                onChange={e => setProfile({...profile, fullName: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-vtv-green outline-none"
                            />
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Lock size={16}/> Đổi mật khẩu</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Mật khẩu mới</label>
                                    <input type="password" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-vtv-green outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Xác nhận mật khẩu</label>
                                    <input type="password" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-vtv-green outline-none"/>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button disabled={loading} className="bg-vtv-green text-black font-bold px-6 py-2.5 rounded-lg hover:bg-green-400 transition flex items-center gap-2 shadow-lg shadow-green-500/20">
                                <Save size={20}/> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'system' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                    <h2 className="text-lg font-bold text-white">Cấu hình chung</h2>
                    
                    {/* Bank Info */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2"><CreditCard size={16}/> Thông tin ngân hàng (Hiển thị cho khách)</label>
                        <textarea 
                            rows="3"
                            value={config.bankInfo}
                            onChange={e => setConfig({...config, bankInfo: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-vtv-green outline-none"
                        ></textarea>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                            <div>
                                <div className="text-white font-bold">Chế độ bảo trì</div>
                                <div className="text-xs text-gray-500">Tạm ngưng website để nâng cấp (Chỉ Admin truy cập được)</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={config.maintenanceMode} onChange={e => setConfig({...config, maintenanceMode: e.target.checked})} className="sr-only peer"/>
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vtv-green"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                            <div>
                                <div className="text-white font-bold">Thông báo qua Email</div>
                                <div className="text-xs text-gray-500">Nhận email khi có đơn hàng mới</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={config.emailNotification} onChange={e => setConfig({...config, emailNotification: e.target.checked})} className="sr-only peer"/>
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vtv-green"></div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button className="bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-slate-700 transition">
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;