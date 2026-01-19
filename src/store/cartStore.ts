import { CartItem, Product } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => void;
  getCartItemsForOrder: () => {
    product_id: string;
    quantity: number;
    price: number;
  }[];
}

export const userCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((items) => items.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price.value) * item.quantity,
          0
        );
      },

      getCartItemsForOrder: () => {
        return get().items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price.value,
        }));
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
