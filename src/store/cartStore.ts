import { Good } from "@/domains/goods/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StoreGood = {
  key: string;
  good: Good;
  quantity: number;
  size?: string;
};

type BasketState = {
  goods: StoreGood[];
  goodsByUser: Record<string, StoreGood[]>;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  addGood: (good: Good, quantity?: number, size?: string) => void;
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
      const buildGoodKey = (g: Good, size?: string) =>
        `${g.id}_${size || "nosize"}_${"nocolor"}`;
      const getUserKey = (userId?: string | null) =>
        userId && userId.length > 0 ? userId : "guest";

      return {
        goods: [],
        goodsByUser: { guest: [] },
        userId: null,

        setUserId: (userId) =>
          set((state) => {
            const userKey = getUserKey(userId);
            const nextGoods = [...(state.goodsByUser[userKey] ?? [])];

            return {
              userId,
              goods: nextGoods,
              goodsByUser: {
                ...state.goodsByUser,
                [userKey]: nextGoods,
              },
            };
          }),

        getTotalCount: () => {
          return get().goods.reduce((sum, item) => sum + item.quantity, 0);
        },

        getTotalPrice: () => {
          return get().goods.reduce(
            (sum, item) => sum + item.good.price.value * item.quantity,
            0,
          );
        },

        addGood: (good, quantity = 1, size) =>
          set((state) => {
            const key = buildGoodKey(good, size);
            const existingIndex = state.goods.findIndex((g) => g.key === key);
            const userKey = getUserKey(state.userId);

            if (existingIndex !== -1) {
              const newGoods = [...state.goods];
              newGoods[existingIndex].quantity += quantity;
              return {
                goods: newGoods,
                goodsByUser: {
                  ...state.goodsByUser,
                  [userKey]: newGoods,
                },
              };
            }

            const appendedGoods = [
              ...state.goods,
              {
                key,
                good,
                quantity,
                size,
              },
            ];

            return {
              goods: appendedGoods,
              goodsByUser: {
                ...state.goodsByUser,
                [userKey]: appendedGoods,
              },
            };
          }),

        decrementGood: (key) =>
          set((state) => {
            const userKey = getUserKey(state.userId);
            const updatedGoods = state.goods
              .map((g) =>
                g.key === key ? { ...g, quantity: g.quantity - 1 } : g,
              )
              .filter((g) => g.quantity > 0);

            return {
              goods: updatedGoods,
              goodsByUser: {
                ...state.goodsByUser,
                [userKey]: updatedGoods,
              },
            };
          }),

        updateGoodQuantity: (key, quantity) =>
          set((state) => {
            const userKey = getUserKey(state.userId);
            const updatedGoods = state.goods
              .map((g) =>
                g.key === key ? { ...g, quantity: Math.max(0, quantity) } : g,
              )
              .filter((g) => g.quantity > 0);

            return {
              goods: updatedGoods,
              goodsByUser: {
                ...state.goodsByUser,
                [userKey]: updatedGoods,
              },
            };
          }),

        removeGood: (key) =>
          set((state) => {
            const userKey = getUserKey(state.userId);
            const updatedGoods = state.goods.filter((g) => g.key !== key);

            return {
              goods: updatedGoods,
              goodsByUser: {
                ...state.goodsByUser,
                [userKey]: updatedGoods,
              },
            };
          }),

        clearBasket: () =>
          set((state) => {
            const userKey = getUserKey(state.userId);
            return {
              goods: [],
              goodsByUser: {
                ...state.goodsByUser,
                [userKey]: [],
              },
            };
          }),
      };
    },
    {
      name: "basket-storage",
      version: 1,
      merge: (persisted: any, current) => {
        if (!persisted) {
          return current;
        }

        const merged = { ...current, ...persisted };
        const userKey =
          merged.userId && merged.userId.length > 0 ? merged.userId : "guest";

        return {
          ...merged,
          goods: [...(merged.goodsByUser?.[userKey] ?? [])],
        };
      },
      partialize: (state) => ({
        goodsByUser: state.goodsByUser,
        userId: state.userId,
      }),
      migrate: (persistedState: any, version) => {
        if (!persistedState) {
          return persistedState;
        }

        if (version === 0) {
          const legacyGoods: StoreGood[] = persistedState.goods ?? [];
          return {
            goodsByUser: {
              guest: legacyGoods,
            },
            userId: null,
          };
        }

        return persistedState;
      },
    },
  ),
);

export const deliveryCost = 150;
