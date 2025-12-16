import React, { useEffect, useState } from 'react';
import { Save, User, Lock, Shield, CreditCard } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore'; 
import axiosClient from '../../../store/axiosClient';

const SettingsPage = () => {
  const { user, loginSuccess } = useAuthStore(); // loginSuccess để cập nhật lại store nếu đổi tên
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // --- STATE 1: PROFILE ---
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  // --- STATE 2: SYSTEM CONFIG ---
  const [config, setConfig] = useState({
    maintenanceMode: false,
    emailNotification: true,
    bankInfo: ''
  });

  // --- 1. LOAD CONFIG KHI MỞ TAB SYSTEM ---
  useEffect(() => {
    if (activeTab === 'system') {
        const fetchConfig = async () => {
            try {
                const res = await axiosClient.get('/admin/settings');
                setConfig(res);
            } catch (error) {
                console.error("Lỗi tải config:", error);
            }
        };
        fetchConfig();
    }
  }, [activeTab]);

  // --- 2. UPDATE PROFILE ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (profile.password && profile.password !== profile.confirmPassword) {
        return alert("Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);
    try {
        // Gọi API update user (Gửi fullName và password nếu có)
        await axiosClient.patch(`/admin/users/${user.id}`, {
            fullName: profile.fullName,
            password: profile.password || undefined // Nếu rỗng thì không gửi
        });

        // Cập nhật lại Auth Store (để hiển thị tên mới trên Sidebar ngay lập tức)
        // Lưu ý: Token giữ nguyên, chỉ update thông tin user
        const updatedUser = { ...user, fullName: profile.fullName };
        // Giả lập cập nhật store (cần check lại hàm loginSuccess của bạn hỗ trợ tham số nào)
        // Nếu loginSuccess cần token, bạn có thể lấy token cũ từ store
        const token = useAuthStore.getState().token;
        loginSuccess(updatedUser, token);

        alert("Cập nhật thông tin thành công!");
        setProfile(prev => ({...prev, password: '', confirmPassword: ''})); // Reset ô pass
    } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || "Không thể cập nhật."));
    } finally {
        setLoading(false);
    }
  };

  // --- 3. UPDATE SYSTEM CONFIG ---
  const handleConfigUpdate = async () => {
    setLoading(true);
    try {
        await axiosClient.patch('/admin/settings', config);
        alert("Đã lưu cấu hình hệ thống!");
    } catch (error) {
        alert("Lỗi lưu cấu hình.");
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
            {/* --- TAB PROFILE --- */}
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
                                    <input 
                                        type="password" 
                                        value={profile.password}
                                        onChange={e => setProfile({...profile, password: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-vtv-green outline-none"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Xác nhận mật khẩu</label>
                                    <input 
                                        type="password" 
                                        value={profile.confirmPassword}
                                        onChange={e => setProfile({...profile, confirmPassword: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-vtv-green outline-none"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button disabled={loading} className="bg-vtv-green text-black font-bold px-6 py-2.5 rounded-lg hover:bg-green-400 transition flex items-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50">
                                <Save size={20}/> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- TAB SYSTEM CONFIG --- */}
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
                            placeholder="Tên ngân hàng - Số TK - Chủ TK"
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
                        <button 
                            onClick={handleConfigUpdate}
                            disabled={loading}
                            className="bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
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