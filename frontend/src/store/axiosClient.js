import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Cấu hình Base URL chung
const baseURL = 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, 
});

// Request Interceptor (Giữ nguyên)
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (SỬA ĐỔI)
axiosClient.interceptors.response.use(
  (response) => response.data, 
  async (error) => {
    const originalRequest = error.config;

    // --- 1. QUAN TRỌNG: NẾU LỖI TỪ API LOGIN THÌ BỎ QUA REFRESH ---
    // Nếu API đang gọi là /auth/login mà bị 401 (Sai pass), 
    // ta trả lỗi về ngay lập tức để LoginPage hiển thị thông báo.
    if (error.response?.status === 401 && originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
    }

    // --- 2. XỬ LÝ LỖI 503 (BẢO TRÌ) ---
    if (error.response && error.response.status === 503) {
        if (window.location.pathname !== '/maintenance') {
             window.location.href = '/maintenance';
        }
        // Trả về promise treo để UI không hiện lỗi đỏ
        return new Promise(() => {});
    }

    // --- 3. XỬ LÝ REFRESH TOKEN (CHO CÁC API KHÁC) ---
    // Chỉ chạy khi lỗi 401 VÀ KHÔNG PHẢI là API Login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("⚠️ Token hết hạn! Đang gọi Refresh Token...");
        
        // Dùng axios gốc để tránh vòng lặp interceptor
        const res = await axios.post(`${baseURL}/auth/refresh`, {}, {
            withCredentials: true 
        });

        const newAccessToken = res.data.accessToken; 
        console.log("✅ Đã lấy được Token mới:", newAccessToken);

        // Lưu vào store
        const currentUser = useAuthStore.getState().user;
        useAuthStore.getState().loginSuccess(currentUser, newAccessToken);

        // Gắn token mới vào header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Gọi lại request cũ
        return axiosClient(originalRequest);

      } catch (refreshError) {
        console.error("Phiên đăng nhập hết hạn hẳn:", refreshError);
        useAuthStore.getState().logout();
        
        // Chỉ redirect về login nếu đang không ở trang login
        if (window.location.pathname !== '/login') {
             window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;