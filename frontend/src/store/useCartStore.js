import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // 1. Thêm sản phẩm vào giỏ
      addToCart: (product, variant = null) => {
        const { cart } = get();
        
        // Nếu không chọn variant (ở trang Home), lấy variant đầu tiên làm mặc định
        const selectedVariant = variant || (product.variants && product.variants[0]) || {};
        
        // Tạo ID duy nhất cho sản phẩm trong giỏ (ID sản phẩm + ID variant)
        const cartItemId = `${product.id}-${selectedVariant.id || 'default'}`;

        // Kiểm tra xem món này đã có trong giỏ chưa
        const existingItem = cart.find((item) => item.cartItemId === cartItemId);

        if (existingItem) {
          // Có rồi -> Tăng số lượng lên 1
          set({
            cart: cart.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Chưa có -> Thêm mới
          set({
            cart: [
              ...cart,
              {
                ...product,
                cartItemId,
                selectedVariant,
                quantity: 1, // Mặc định là 1
              },
            ],
          });
        }
        
        // Thông báo nhẹ (Optional)
        // alert("Đã thêm vào giỏ hàng!"); 
      },

      // 2. Xóa sản phẩm
      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      // 3. Tăng giảm số lượng
      updateQuantity: (cartItemId, action) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.cartItemId === cartItemId) {
              const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
              return { ...item, quantity: Math.max(1, newQuantity) }; // Không cho nhỏ hơn 1
            }
            return item;
          }),
        }));
      },

      // 4. Xóa sạch giỏ (sau khi thanh toán)
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'vtv-cart-storage', // Tên key lưu trong LocalStorage
    }
  )
);

export default useCartStore;