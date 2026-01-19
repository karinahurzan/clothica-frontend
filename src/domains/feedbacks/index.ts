import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFeedbacks, createFeedback, getLatestFeedbacks } from "./service";
import { FeedbackCreate } from "./type";

export const useFeedbacks = (productId?: string) => {
  return useQuery({
    queryKey: ["feedbacks", productId],
    queryFn: () => getFeedbacks(productId!),
    enabled: !!productId,
  });
};

export const useLatestFeedbacks = () => {
  return useQuery({
    queryKey: ["latest_feedbacks"],
    queryFn: () => getLatestFeedbacks(),
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      feedback,
      token,
    }: {
      feedback: FeedbackCreate;
      token: string;
    }) => createFeedback(feedback, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["feedbacks", variables.feedback.product_id],
      });
    },
  });
};
