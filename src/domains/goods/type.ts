export interface Price {
  value: number;
  currency: string;
}

export interface Good {
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
}

export interface GoodFilter {
  gender?: string;
  category_id?: string;
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  page: number;
  perPage: number;
}

export interface GoodsResponse {
  items: Good[];
  total_count: number;
  has_more: boolean;
  max_available_price: number;
}

export interface UseGoodsProps {
  gender?: string;
  category_id?: string;
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface GoodResponse {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  image: string;
  description: string;
  prevDescription: string;
  gender: string;
  size: string[];
  characteristics: string[];
  price: { value: string; currency: string };
}
