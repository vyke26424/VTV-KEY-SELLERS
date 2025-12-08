import axios from 'axios';
import useAuthStore from '../store/useAuthStore'; // Import cái store bạn vừa đưa tôi

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000', // Đổi port nếu backend chạy port khác
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // QUAN TRỌNG: Để gửi kèm Cookie (RefreshToken)
});

// --- 1. REQUEST INTERCEPTOR (Gửi đi) ---
// Tự động gắn Token vào Header trước khi request bay đi
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ Store của bạn (lưu ý: bạn đặt tên biến là 'token')
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. RESPONSE INTERCEPTOR (Nhận về) ---
// Giúp bạn lấy data gọn hơn (bỏ qua bước .data của axios)
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu luôn, không cần gõ response.data ở nơi gọi
    return response.data;
  },
  async (error) => {
    // Xử lý lỗi chung (VD: Token hết hạn -> Logout)
    if (error.response && error.response.status === 401) {
        // Tùy chọn: Tự động logout nếu token hết hạn mà không refresh được
        // useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;