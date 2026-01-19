export interface Price {
  value: number;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  category_id: string;
  image: string;
  price: Price;
  size: string[];
  description: string;
  prevDescription: string;
  gender: string;
  characteristics: string[];
  feedbacks_average: number;
  feedbacks_count: number;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_admin: boolean;
  token?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
