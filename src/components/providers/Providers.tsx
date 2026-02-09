"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useBasket } from "@/store/cartStore";
import QueryProvider from "./QueryProvider";

function BasketSessionSync() {
  const { data: session } = useSession();
  const setUserId = useBasket((state) => state.setUserId);
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    setUserId(userId);
  }, [userId, setUserId]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <BasketSessionSync />
        {children}
      </SessionProvider>
    </QueryProvider>
  );
}
