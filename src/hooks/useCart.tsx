// import { useState, useEffect } from "react";
// import { userCartStore } from "@/store/cartStore";

// export const useCart = () => {
//   const [isHydrated, setIsHydrated] = useState(false);

//   const items = userCartStore((state) => state.items);
//   const addItem = userCartStore((state) => state.addItem);
//   const removeItem = userCartStore((state) => state.removeItem);

//   useEffect(() => {
//     const unsub = userCartStore.persist.onHydrate(() => {
//       setTimeout(() => setIsHydrated(true), 0);
//     });

//     if (userCartStore.persist.hasHydrated()) {
//       setTimeout(() => setIsHydrated(true), 0);
//     }

//     return () => unsub?.();
//   }, []);

//   return {
//     items: isHydrated ? items : [],
//     isHydrated,
//     addItem,
//     removeItem,
//     count: items.reduce((total, item) => total + (item.quantity || 1), 0),
//   };
// };
