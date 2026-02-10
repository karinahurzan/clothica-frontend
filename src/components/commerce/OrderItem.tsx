"use client";

import { OrderOut } from "@/domains/orders/type";
import { formatDateToDayMonthYear } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface OrderItemProps {
  order?: OrderOut;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Прийнято",
  complacting: "Комплектується",
  ready: "Готове",
  canceled: "Скасовано",
};

export default function OrderItem({ order }: OrderItemProps) {
  const handleCopyId = async () => {
    if (!order?.id) {
      return;
    }

    try {
      if (!("clipboard" in navigator)) {
        throw new Error("Clipboard API is not available");
      }

      await navigator.clipboard.writeText(order.id);
      toast.success("Номер замовлення скопійовано");
    } catch (error) {
      console.error("Copy order id failed", error);
      toast.error("Не вдалося скопіювати номер замовлення");
    }
  };

  const formattedDate = order?.created_at
    ? formatDateToDayMonthYear(order.created_at) || "-"
    : "-";
  const maskedId = order?.id ? `${order.id.slice(0, 7)}••••` : "-";
  const totalPrice =
    order?.total_price !== undefined ? `${order.total_price} грн` : "-";
  const status = order?.status ?? "";
  const statusLabel = STATUS_LABELS[status] ?? "Невідомо";

  return (
    <div className="flex flex-row justify-between w-full gap-3">
      <div className="flex flex-col gap-1">
        <span>{formattedDate}</span>

        <Button
          onClick={handleCopyId}
          variant="ghost"
          className="h-auto p-0 text-left font-semibold text-sm sm:text-base"
        >
          №{maskedId}
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-semibold">Сума</span>
        <span>{totalPrice}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Статус</span>
        <span>{statusLabel}</span>
      </div>
    </div>
  );
}
