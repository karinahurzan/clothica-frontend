import { CartItem, Product } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => void;
  getCartItemsForOrder: () => any[];
}

export const userCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "6877b9f116ae59c7b60d0107",
          name: "Світшот 'Minimal Black'",
          category_id: "690c9ce6a6276289c98fc00c",
          image:
            "https://ftp.goit.study/img/goods/6877b9f116ae59c7b60d0107.webp",
          price: {
            value: 1299,
            currency: "грн",
          },
          size: ["XL", "XS", "S", "M", "L", "XXL"],
          description:
            "Світшот Minimal Black — втілення стриманості та універсальності. Його дизайн побудований на простоті: глибокий чорний колір, акуратний круглий виріз і прямий крій. Тканина — м’який трикотаж із високим вмістом бавовни, що забезпечує комфорт у щоденному носінні. Завдяки універсальному стилю цей світшот легко поєднується як зі спортивним одягом, так і з джинсами чи навіть класичними брюками. Його можна використовувати як базовий шар під куртку або носити самостійно. Модель не має зайвих деталей, проте саме ця мінімалістичність робить її актуальною та довговічною. Minimal Black — це стильний вибір для тих, хто цінує простоту й практичність.",
          feedbacks: ["690ddbe1a6276289c98fd001", "690ddbe1a6276289c98fd002"],
          prevDescription:
            "Світшот 'Minimal Black' — втілення стриманості. Глибокий чорний колір, акуратний крій та м'яка тканина (трикотаж з високим вмістом бавовни) забезпечують комфорт. Ця базова річ універсальна: пасує до джинсів, спортивного одягу чи класичних брюк. Ідеальний вибір.",
          gender: "unisex",
          characteristics: [
            "Матеріал: 80% бавовна, 20% поліестер",
            "Крій: прямий",
            "Горловина: круглий виріз",
            "Сезон: Осінь/Зима/Весна",
          ],
          quantity: 1,
        },
      ],

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
          (total, item) => total + item.price.value * item.quantity,
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
