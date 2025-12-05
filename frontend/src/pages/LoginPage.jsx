import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // true = Đăng nhập, false = Đăng ký
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Xóa lỗi khi người dùng gõ lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Xác định endpoint (Dựa trên DTO bạn cung cấp)
    const endpoint = isLogin ? 'login' : 'signup';
    
    // Chuẩn bị dữ liệu gửi đi (Khớp với DTO)
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } // LoginDto
      : { email: formData.email, password: formData.password, fullName: formData.fullName }; // SignupDto

    try {
      const res = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Hiển thị lỗi từ Backend (VD: Email không đúng định dạng, Password yếu...)
        throw new Error(data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }

      // Xử lý thành công
      if (isLogin) {
        // Giả sử Backend trả về { user: {...}, access_token: "..." }
        loginSuccess(data.user, data.accessToken);
        navigate('/'); // Về trang chủ
      } else {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true); // Chuyển sang tab đăng nhập
        setFormData({ ...formData, password: '' });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vtv-dark px-4 py-20">
      <div className="w-full max-w-md">
        
        {/* TAB SWITCHER */}
        <div className="flex bg-slate-800 p-1 rounded-full mb-8 border border-slate-700">
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${isLogin ? 'bg-vtv-green text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${!isLogin ? 'bg-vtv-green text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Đăng ký
          </button>
        </div>

        {/* FORM CONTAINER */}
        <motion.div 
          key={isLogin ? 'login' : 'signup'} // Để framer motion biết khi nào đổi form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vtv-card border border-slate-700 p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-gray-400 text-center mb-6 text-sm">
            {isLogin ? 'Nhập thông tin để tiếp tục mua sắm' : 'Trở thành thành viên của VTVKey ngay hôm nay'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* FULL NAME (Chỉ hiện khi Đăng ký) - Khớp SignupDto */}
            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase">Họ và tên</label>
                <div className="relative">
                  <input 
                    type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-vtv-green outline-none transition-colors"
                    placeholder="Nguyễn Văn A"
                  />
                  <User className="absolute left-3 top-3 text-gray-500" size={18}/>
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase">Email</label>
              <div className="relative">
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-vtv-green outline-none transition-colors"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-3 text-gray-500" size={18}/>
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase">Mật khẩu</label>
              <div className="relative">
                <input 
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-vtv-green outline-none transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3 text-gray-500" size={18}/>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-vtv-green text-black font-bold py-3 rounded-lg hover:bg-green-400 transition transform active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập ngay' : 'Đăng ký tài khoản')}
              {!loading && <ArrowRight size={18}/>}
            </button>

          </form>

          {isLogin && (
             <div className="text-center mt-4">
                <a href="#" className="text-sm text-gray-500 hover:text-vtv-green transition">Quên mật khẩu?</a>
             </div>
          )}
        </motion.div>

        <div className="text-center mt-6">
           <Link to="/" className="text-gray-500 hover:text-white text-sm transition">
             &larr; Quay lại trang chủ
           </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;