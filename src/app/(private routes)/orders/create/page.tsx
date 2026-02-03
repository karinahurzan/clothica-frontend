"use client";

import CartItem from "@/components/commerce/CartItem";
import ContainerLayout from "@/components/layout/ContainerLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deliveryCost, useBasket } from "@/store/cartStore";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { usePlaceOrder } from "@/domains/orders";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

type FieldInfoField = {
  state: {
    meta: {
      touchedError?: string;
      isValidating: boolean;
      errors?: (string | { message: string } | undefined)[];
    };
  };
};

function FieldInfo({ field }: { field: FieldInfoField }) {
  const error = field.state.meta.errors;
  return (
    <div className="min-h-4">
      {error ? (
        <em className="text-sm text-red not-italic">
          {typeof error[0] === "string" ? error[0] : error[0]?.message}
        </em>
      ) : null}
      {field.state.meta.isValidating ? (
        <em className="text-sm text-neutral-darkest-60 not-italic">
          Перевірка...
        </em>
      ) : null}
    </div>
  );
}

const orderSchema = z.object({
  firstName: z.string().min(2, "Ім'я надто коротке").max(50),
  lastName: z.string().min(2, "Прізвище надто коротке"),
  mobilePhone: z
    .string()
    .regex(/^\+?[0-9]{10,12}$/, "Невірний формат телефону"),
  cityAddress: z.string().min(3, "Вкажіть місто та адресу"),
  novaPostNumber: z.string().min(1, "Вкажіть номер відділення"),
  comment: z.string().optional(),
});

export default function Page() {
  const {
    goods: items,
    getTotalPrice,
    clearBasket,
  } = useBasket((state) => state);
  const isCartEmpty = items.length === 0;
  const { data: session } = useSession();
  const token = session?.user?.token;
  const placeOrderMutation = usePlaceOrder();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobilePhone: "",
      cityAddress: "",
      novaPostNumber: "",
      comment: "",
    },
    validatorAdapter: zodValidator(),
    validators: { onChange: orderSchema },
    onSubmit: async ({ value }) => {
      if (isCartEmpty) {
        toast.error("Кошик порожній", {
          description: "Додайте товари, щоб оформити замовлення.",
        });
        return;
      }

      const payload = {
        first_name: value.firstName,
        last_name: value.lastName,
        phone: value.mobilePhone,
        city_address: value.cityAddress,
        nova_post_number: value.novaPostNumber,
        comment: value.comment || undefined,
        items: items.map((item) => ({
          product_id: item.good.id,
          quantity: item.quantity,
          size: item.size,
          price: item.good.price.value,
        })),
        total_price: getTotalPrice() + deliveryCost,
      };

      await placeOrderMutation.mutateAsync(
        { order: payload, token },
        {
          onSuccess: () => {
            toast.success("Замовлення сформовано", {
              description: "Ми зв’яжемось з вами для підтвердження.",
            });
            clearBasket();
          },
        },
      );
    },
  });

  return (
    <ContainerLayout>
      <h1 className="text-4xl xl:text-5xl mb-12 text-center">
        Оформити замовлення
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="min-w-full">
          <h2 className="text-xl mb-4 text-center">Товари</h2>

          {isCartEmpty ? (
            <div className="bg-deco-light py-6 px-4 md:px-8 gap-4 rounded-2xl flex flex-col justify-between items-center">
              <p className="font-semibold text-lg text-center">
                Ваш кошик порожній. Додайте товари, щоб оформити замовлення.
              </p>
              <Link
                href="/goods"
                className={buttonVariants({ variant: "secondary" })}
              >
                Перейти до товарів
              </Link>
            </div>
          ) : (
            <ul className="no-scrollbar min-w-full justify-between overflow-y-auto py-3 flex flex-col gap-4">
              {items.map((product) => (
                <li key={product.key}>
                  <CartItem product={product} />
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col border-t border-scheme-1-border py-3 gap-2">
            <div className="flex flex-row justify-between gap-2">
              <span>Проміжний підсумок</span>
              <span>{getTotalPrice()} грн</span>
            </div>
            <div className="flex flex-row justify-between gap-2 mb-3">
              <span>Доставка</span>
              <span>{deliveryCost} грн</span>
            </div>
            <div className="flex flex-row justify-between gap-2 font-semibold mb-9">
              <span>Всього</span>
              <span>{getTotalPrice() + deliveryCost} грн</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-4 text-center">Особиста інформація</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <form.Field name="firstName">
                {(field) => (
                  <div>
                    <Label className="mb-2" htmlFor={field.name}>
                      {"Ім'я*"}
                    </Label>
                    <Input
                      className="w-full"
                      id={field.name}
                      autoComplete="given-name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ваше ім'я"
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="lastName">
                {(field) => (
                  <div>
                    <Label className="mb-2" htmlFor={field.name}>
                      Прізвище*
                    </Label>
                    <Input
                      className="w-full"
                      id={field.name}
                      autoComplete="family-name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ваше прізвище"
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="mobilePhone">
              {(field) => (
                <div>
                  <Label className="mb-2" htmlFor={field.name}>
                    Номер телефону*
                  </Label>
                  <Input
                    className="w-full"
                    id={field.name}
                    placeholder="+38 (0__) ___-__-__"
                    type="tel"
                    autoComplete="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <form.Field name="cityAddress">
                {(field) => (
                  <div>
                    <Label className="mb-2" htmlFor={field.name}>
                      Місто доставки*
                    </Label>
                    <Input
                      className="w-full"
                      id={field.name}
                      autoComplete="address-level2"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ваше місто"
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="novaPostNumber">
                {(field) => (
                  <div>
                    <Label className="mb-2" htmlFor={field.name}>
                      Номер відділення Нової Пошти*
                    </Label>
                    <Input
                      className="w-full"
                      id={field.name}
                      autoComplete="postal-code"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="1"
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="comment">
              {(field) => (
                <div>
                  <Label className="mb-2" htmlFor={field.name}>
                    Коментар
                  </Label>
                  <Textarea
                    className="w-full"
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Введіть ваш коментар"
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit || isCartEmpty || placeOrderMutation.isPending
                  }
                  className="mt-4 w-full"
                >
                  {isSubmitting || placeOrderMutation.isPending
                    ? "Відправка..."
                    : "Підтвердити замовлення"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>
    </ContainerLayout>
  );
}
