export type OrderItemCreate = {
  product_id: string;
  quantity: number;
  size?: string;
};

export type OrderCreate = {
  first_name: string;
  last_name: string;
  phone: string;
  city_address: string;
  nova_post_number: string;
  comment?: string;
  items: OrderItemCreate[];
  total_price: number;
} & Record<string, unknown>;

export type OrderOut = {
  id: number;
  status?: string;
  created_at?: string;
  items?: OrderItemCreate[];
  total_price?: number;
} & Record<string, unknown>;

export type PlaceOrderResponse = {
  message: string;
  id: number;
};
