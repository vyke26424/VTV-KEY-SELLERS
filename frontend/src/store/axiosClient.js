import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Để gửi Cookie RefreshToken đi
});

// Request Interceptor: Gắn AccessToken
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Lấy AccessToken hiện tại
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý xoay vòng Token khi lỗi 401
axiosClient.interceptors.response.use(
  (response) => response.data, // Trả data gọn gàng
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) VÀ chưa từng thử retry request này
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu để không lặp vô tận

      try {
        console.log("⚠️ Token hết hạn! Đang gọi Refresh Token...");
        // 1. Gọi API Refresh để lấy AccessToken mới + Cookie RefreshToken mới
        // Lưu ý: Không cần truyền body, vì RefreshToken nằm trong HttpOnly Cookie rồi
        const res = await axiosClient.post('/auth/refresh');

        const newAccessToken = res.accessToken;


        console.log("✅ Đã lấy được Token mới:", newAccessToken);
        console.log("🔄 Đang thực hiện lại request cũ...");
        // 2. Lưu AccessToken mới vào Store (Zustand)
        // Lưu ý: user giữ nguyên, chỉ update token
        const currentUser = useAuthStore.getState().user;
        useAuthStore.getState().loginSuccess(currentUser, newAccessToken);

        // 3. Gắn Token mới vào Header của request bị lỗi lúc nãy
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 4. Gọi lại request cũ (Retry)
        return axiosClient(originalRequest);

      } catch (refreshError) {
        // Nếu Refresh cũng lỗi (Token hết hạn hẳn hoặc bị Revoked) -> Logout luôn
        console.error("Phiên đăng nhập hết hạn:", refreshError);
        useAuthStore.getState().logout();
        window.location.href = '/login'; // Đá về trang login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;