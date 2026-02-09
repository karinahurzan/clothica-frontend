import type { Price } from "@/types";

export type OrderItemCreate = {
  product_id: string;
  quantity: number;
  price: Price;
  size?: string | null;
};

export type OrderCreate = {
  items: OrderItemCreate[];
  total_price: number;
};

export type OrderOut = OrderCreate & {
  id: string;
  status: string;
  created_at: string;
};

export type PlaceOrderResponse = {
  message: string;
  id: string;
};
