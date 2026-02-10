"use client";

import CartItem from "@/components/commerce/CartItem";
import ContainerLayout from "@/components/layout/ContainerLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser, useUpdateCurrentUser } from "@/domains/profile";
import { deliveryCost, useBasket } from "@/store/cartStore";
import { useForm } from "@tanstack/react-form";
import { usePlaceOrder } from "@/domains/orders";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { z } from "zod";

type FieldInfoField = {
  state: {
    meta: {
      touchedError?: string;
      isValidating: boolean;
      isBlurred: boolean;
      errors?: (string | { message: string } | undefined)[];
    };
  };
};

function FieldInfo({ field }: { field: FieldInfoField }) {
  const { errors, isBlurred, isValidating } = field.state.meta;
  const showError = isBlurred && errors;
  return (
    <div className="min-h-4">
      {showError ? (
        <em className="text-sm text-red not-italic">
          {typeof errors[0] === "string" ? errors[0] : errors[0]?.message}
        </em>
      ) : null}
      {isValidating ? (
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
  const items = useBasket((state) => state.goods);
  const totalPrice = useBasket((state) => state.getTotalPrice());
  const clearBasket = useBasket((state) => state.clearBasket);
  const isCartEmpty = items.length === 0;
  const { data: session } = useSession();
  const token = session?.user?.token;
  const { data: currentUser } = useCurrentUser(token);
  const updateUserMutation = useUpdateCurrentUser(token);
  const placeOrderMutation = usePlaceOrder();

  const {
    firstName: defaultFirstName,
    lastName: defaultLastName,
    mobilePhone: defaultMobilePhone,
    cityAddress: defaultCityAddress,
    novaPostNumber: defaultNovaPostNumber,
  } = useMemo(() => {
    const fullNameParts = (currentUser?.full_name ?? "")
      .split(" ")
      .filter(Boolean);
    const [firstName = "", ...lastNameParts] = fullNameParts;

    return {
      firstName,
      lastName: lastNameParts.join(" "),
      mobilePhone: currentUser?.phone_number ?? "",
      cityAddress: currentUser?.city ?? "",
      novaPostNumber: currentUser?.nova_post_number ?? "",
    };
  }, [currentUser]);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobilePhone: "",
      cityAddress: "",
      novaPostNumber: "",
      comment: "",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validators: { onBlur: orderSchema as any, onSubmit: orderSchema as any },
    onSubmit: async ({ value }) => {
      if (isCartEmpty) {
        toast.error("Кошик порожній", {
          description: "Додайте товари, щоб оформити замовлення.",
        });
        return;
      }

      if (!token) {
        toast.error("Не вдалося оформити замовлення", {
          description: "Увійдіть у свій акаунт та спробуйте ще раз.",
        });
        return;
      }

      const fullName = `${value.firstName} ${value.lastName}`.trim();
      const profilePayload = {
        full_name: fullName || null,
        phone_number: value.mobilePhone,
        city: value.cityAddress,
        nova_post_number: value.novaPostNumber,
      } as const;

      const hasProfileChanges = currentUser
        ? (fullName || null) !== (currentUser.full_name ?? null) ||
          value.mobilePhone !== (currentUser.phone_number ?? "") ||
          value.cityAddress !== (currentUser.city ?? "") ||
          value.novaPostNumber !== (currentUser.nova_post_number ?? "")
        : true;

      try {
        if (hasProfileChanges) {
          await updateUserMutation.mutateAsync(profilePayload);
        }
      } catch (error) {
        console.error("Update profile before order error", error);
        return;
      }

      const orderPayload = {
        items: items.map((item) => ({
          product_id: item.good.id,
          quantity: item.quantity,
          price: item.good.price,
          size: item.size ?? null,
        })),
        total_price: totalPrice + deliveryCost,
      };

      await placeOrderMutation.mutateAsync(
        { order: orderPayload, token },
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

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    form.setFieldValue("firstName", defaultFirstName, { dontUpdateMeta: true });
    form.setFieldValue("lastName", defaultLastName, { dontUpdateMeta: true });
    form.setFieldValue("mobilePhone", defaultMobilePhone, {
      dontUpdateMeta: true,
    });
    form.setFieldValue("cityAddress", defaultCityAddress, {
      dontUpdateMeta: true,
    });
    form.setFieldValue("novaPostNumber", defaultNovaPostNumber, {
      dontUpdateMeta: true,
    });
  }, [
    currentUser,
    defaultCityAddress,
    defaultFirstName,
    defaultLastName,
    defaultMobilePhone,
    defaultNovaPostNumber,
    form,
  ]);

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
              <span>{totalPrice} грн</span>
            </div>
            <div className="flex flex-row justify-between gap-2 mb-3">
              <span>Доставка</span>
              <span>{deliveryCost} грн</span>
            </div>
            <div className="flex flex-row justify-between gap-2 font-semibold mb-9">
              <span>Всього</span>
              <span>{totalPrice + deliveryCost} грн</span>
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
