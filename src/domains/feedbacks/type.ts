export interface Feedback {
  id: string;
  author: string;
  description: string;
  rate: number;
  product_id: string;
  product_name?: string;
  date: string;
}

export interface FeedbackCreate {
  author: string;
  description: string;
  rate: number;
  product_id: string;
}
