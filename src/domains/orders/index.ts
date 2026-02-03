import { useMutation, useQuery } from "@tanstack/react-query";
import { getMyOrders, placeOrder } from "./service";
import { type OrderCreate } from "./type";

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: ({
      order,
      token,
    }: {
      order: OrderCreate;
      token?: string;
    }) => placeOrder(order, token),
  });
};

export const useMyOrders = (token?: string) => {
  return useQuery({
    queryKey: ["orders", "my"],
    queryFn: () => getMyOrders(token as string),
    enabled: !!token,
  });
};
