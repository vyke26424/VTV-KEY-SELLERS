import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,         // Thông tin user (tên, email, role...)
      isAuthenticated: false, // Trạng thái đăng nhập
      token: null,        // JWT Token để gọi API sau này

      // Hàm đăng nhập thành công thì lưu lại
      loginSuccess: (userData, token) => set({ 
        user: userData, 
        token: token,
        isAuthenticated: true 
      }),

      // Hàm đăng xuất
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'vtv-auth-storage', // Lưu vào LocalStorage
    }
  )
);

export default useAuthStore;