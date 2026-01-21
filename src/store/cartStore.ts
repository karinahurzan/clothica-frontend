import { Good } from "@/domains/goods/type";
import { Price } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type BasketSelectors = {
  getTotalCount: () => number;
  getTotalPrice: () => number;
};
// 1. Unified the Good type to include the unique key
export type StoreGood = {
  key: string; // Generated ID (id + size + color)
  good: Good;
  quantity: number;
  price: Price;
};

type BasketState = {
  goods: StoreGood[];
  addGood: (good: Good, quantity?: number) => void;
  removeGood: (key: string) => void;
  decrementGood: (key: string) => void;
  updateGoodQuantity: (key: string, quantity: number) => void;
  clearBasket: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
};

export const useBasket = create<BasketState>()(
  persist(
    (set, get) => {
      // Helper to generate unique keys for items with variations
      const buildGoodKey = (g: Good) =>
        `${g.id}_${g.size || "nosize"}_${"nocolor"}`;

      return {
        goods: [],

        getTotalCount: () => {
          return get().goods.reduce((sum, item) => sum + item.quantity, 0);
        },

        // Бонус: загальна вартість кошика
        getTotalPrice: () => {
          return get().goods.reduce(
            (sum, item) => sum + item.price.value * item.quantity,
            0,
          );
        },

        addGood: (good, quantity = 1) =>
          set((state) => {
            const key = buildGoodKey(good);
            const existingIndex = state.goods.findIndex((g) => g.key === key);

            if (existingIndex !== -1) {
              const newGoods = [...state.goods];
              newGoods[existingIndex].quantity += quantity;
              return { goods: newGoods };
            }

            return {
              goods: [
                ...state.goods,
                {
                  key,
                  good,
                  quantity,
                  price: good.price, // Assuming price exists on Good type
                },
              ],
            };
          }),

        decrementGood: (key) =>
          set((state) => ({
            goods: state.goods
              .map((g) =>
                g.key === key ? { ...g, quantity: g.quantity - 1 } : g,
              )
              .filter((g) => g.quantity > 0),
          })),

        updateGoodQuantity: (key, quantity) =>
          set((state) => ({
            goods: state.goods.map((g) =>
              g.key === key ? { ...g, quantity: Math.max(0, quantity) } : g,
            ),
          })),

        removeGood: (key) =>
          set((state) => ({
            goods: state.goods.filter((g) => g.key !== key),
          })),

        clearBasket: () => set({ goods: [] }),
      };
    },
    {
      name: "basket-storage", // Key for LocalStorage
    },
  ),
);
