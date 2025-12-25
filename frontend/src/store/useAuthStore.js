import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosClient from './axiosClient';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, 
      isAuthenticated: false, 
      token: null, 

      // Hàm đăng nhập thành công
      loginSuccess: (userData, token) =>
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
        }),

      // Hàm đăng xuất
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      checkAuth: async () => {
        try {
          // Nếu backend là @Controller('users'), endpoint là /users/me
          const res = await axiosClient.get('/users/me'); 
          
          set({ 
            user: res, 
            isAuthenticated: true 
          });
          return res;
        } catch (error) {
          console.error("Lỗi xác thực lại:", error);
          // Nếu token hết hạn thì logout luôn cho an toàn
          // set({ user: null, token: null, isAuthenticated: false });
        }
      },

    }),
    {
      name: 'vtv-auth-storage', 
    },
  ),
);

export default useAuthStore;