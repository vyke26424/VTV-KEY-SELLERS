import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../store/axiosClient';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // ❌ ĐÃ XÓA DÒNG setError('') Ở ĐÂY ĐỂ TRÁNH MẤT LỖI TỰ ĐỘNG
  };

  // ✅ Thêm hàm này: Chỉ khi user chủ động click vào ô nhập thì mới tắt lỗi
  const handleFocus = () => {
      if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset lỗi cũ trước khi gọi mới
    setError('');

    // Validate sơ bộ
    if (!formData.email || !formData.password) {
        setError("Vui lòng nhập đầy đủ thông tin!");
        triggerShake();
        return;
    }

    setLoading(true);

    const endpoint = isLogin ? 'login' : 'signup';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } 
      : { email: formData.email, password: formData.password, fullName: formData.fullName };

    try {
      const data = await axiosClient.post(`/auth/${endpoint}`, payload);

      if (isLogin) {
        loginSuccess(data.user, data.accessToken);
        navigate('/');
      } else {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true); 
        setFormData({ ...formData, password: '' });
      }

    } catch (err) {
      console.error("Login Error:", err);
      
      let message = 'Có lỗi xảy ra, vui lòng thử lại.';
      
      if (err.response) {
          const status = err.response.status;
          if (status === 401) {
              message = 'Email hoặc mật khẩu không chính xác!';
          } else if (status === 409) {
              message = 'Email này đã được sử dụng!';
          } else if (err.response.data?.message) {
              message = Array.isArray(err.response.data.message) 
                  ? err.response.data.message[0] 
                  : err.response.data.message;
          }
      } else if (err.request) {
          message = "Không thể kết nối Server. Vui lòng kiểm tra mạng.";
      }

      setError(message);
      triggerShake(); // Rung lắc form

    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo hiệu ứng rung
  const triggerShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-20 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-vtv-green/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        
        <div className="flex bg-slate-900 p-1 rounded-full mb-8 border border-slate-800 shadow-xl">
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${isLogin ? 'bg-vtv-green text-black shadow-lg shadow-green-500/20' : 'text-gray-400 hover:text-white'}`}
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${!isLogin ? 'bg-vtv-green text-black shadow-lg shadow-green-500/20' : 'text-gray-400 hover:text-white'}`}
          >
            Đăng ký
          </button>
        </div>

        <motion.div 
          key={isLogin ? 'login' : 'signup'} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-gray-400 text-center mb-6 text-sm">
            {isLogin ? 'Nhập thông tin để tiếp tục truy cập' : 'Trở thành thành viên của chúng tôi ngay hôm nay'}
          </p>

          {/* Alert Error: Giờ nó sẽ không tự mất nữa */}
          {error && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 font-medium"
            >
              <AlertCircle size={18} className="shrink-0"/> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase ml-1">Họ và tên</label>
                <div className="relative group">
                  <input 
                    type="text" name="fullName" value={formData.fullName} 
                    onChange={handleChange} onFocus={handleFocus} // <--- Thêm onFocus
                    className="w-full bg-slate-950 border border-slate-700 group-hover:border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-vtv-green outline-none transition-all placeholder:text-slate-600"
                    placeholder="Nguyễn Văn A"
                  />
                  <User className="absolute left-3 top-3 text-slate-500 group-hover:text-slate-400 transition-colors" size={18}/>
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase ml-1">Email</label>
              <div className="relative group">
                <input 
                  type="email" name="email" value={formData.email} 
                  onChange={handleChange} onFocus={handleFocus} // <--- Thêm onFocus
                  className={`w-full bg-slate-950 border ${error && error.includes('Email') ? 'border-red-500' : 'border-slate-700'} group-hover:border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-vtv-green outline-none transition-all placeholder:text-slate-600`}
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-3 text-slate-500 group-hover:text-slate-400 transition-colors" size={18}/>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase ml-1">Mật khẩu</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" value={formData.password} 
                  onChange={handleChange} onFocus={handleFocus} // <--- Thêm onFocus
                  className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-700'} group-hover:border-slate-600 rounded-lg py-3 pl-10 pr-10 text-white focus:border-vtv-green outline-none transition-all placeholder:text-slate-600`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3 text-slate-500 group-hover:text-slate-400 transition-colors" size={18}/>
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-vtv-green text-black font-bold py-3 rounded-lg hover:bg-green-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-lg shadow-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
              ) : (
                  <>
                    {isLogin ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
                    <ArrowRight size={18}/>
                  </>
              )}
            </button>

          </form>

          {isLogin && (
             <div className="text-center mt-6">
                <a href="#" className="text-sm text-slate-400 hover:text-vtv-green transition underline decoration-transparent hover:decoration-vtv-green underline-offset-4">Quên mật khẩu?</a>
             </div>
          )}
        </motion.div>

        <div className="text-center mt-8">
           <Link to="/" className="text-slate-500 hover:text-white text-sm transition flex items-center justify-center gap-2 group">
             <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Quay lại trang chủ
           </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;