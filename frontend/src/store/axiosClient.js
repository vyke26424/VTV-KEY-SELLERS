import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Cấu hình Base URL chung
const baseURL = 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, 
});

// Request Interceptor
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

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response.data, 
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
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
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;