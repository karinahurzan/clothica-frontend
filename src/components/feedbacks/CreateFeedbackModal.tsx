"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader, Star } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useCreateFeedback } from "@/domains/feedbacks";

const feedbackSchema = z.object({
  author: z.string().min(2, "Ім'я занадто коротке"),
  description: z.string().min(10, "Відгук має бути інформативнішим"),
  rate: z.number().min(1).max(5),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function CreateFeedbackModal({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rate: 0, author: "", description: "" },
  });

  const session = useSession();
  const { token } = session?.data?.user || {};

  const { mutate, isPending } = useCreateFeedback();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
      setRating(0);
    }
  };

  const handleSelectRate = (star: number) => {
    setValue("rate", star);
    setRating(star);
  };

  const onSubmit = (data: FeedbackFormValues) => {
    if (!token) {
      alert("Ви повинні бути авторизовані");
      return;
    }

    mutate(
      {
        feedback: { ...data, product_id: productId },
        token,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
          setRating(0);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="whitespace-normal h-full text-center max-w-30 xxs:max-w-full"
          variant="secondary"
        >
          Залишити відгук
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full xl:min-w-3xl rounded-2xl py-10 px-5 md:px-16 xl:py-16">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl xl:text-5xl mb-12">
            Залишити відгук
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 flex gap-2 flex-col">
            <Label htmlFor="author">Ваше ім’я</Label>
            <Input
              id="author"
              placeholder="Ваше ім’я"
              className="rounded-xl border-gray-300 w-full"
              {...register("author")}
            />
            {errors.author && (
              <p className="text-red-500 text-sm">{errors.author.message}</p>
            )}
          </div>

          <div className="mb-6 flex gap-2 flex-col">
            <Label htmlFor="description">Відгук</Label>
            <Textarea
              id="description"
              placeholder="Ваш відгук"
              className="min-h-30 rounded-xl resize-none border-gray-300"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-6 h-6 cursor-pointer transition-colors",
                  star <= rating ? "fill-black text-black" : "text-gray-400",
                )}
                onClick={() => handleSelectRate(star)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isPending}
              variant="default"
              className="w-full md: max-w-30"
            >
              {isPending ? (
                <div className="flex items-center justify-center mt-10">
                  <Loader className="w-10 h-10 animate-spin" />
                </div>
              ) : (
                "Надіслати"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
