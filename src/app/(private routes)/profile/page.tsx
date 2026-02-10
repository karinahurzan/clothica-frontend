"use client";

import OrderItem from "@/components/commerce/OrderItem";
import NoOrdersFoundCard from "@/components/common/NoOrdersFoundCard";
import ContainerLayout from "@/components/layout/ContainerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMyOrders } from "@/domains/orders";
import { useCurrentUser, useUpdateCurrentUser } from "@/domains/profile";
import { useForm } from "@tanstack/react-form";
import { Loader } from "lucide-react";
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

const profileSchema = z.object({
  firstName: z.string().min(2, "Ім'я надто коротке").max(50),
  lastName: z.string().min(2, "Прізвище надто коротке"),
  mobilePhone: z
    .string()
    .regex(/^\+?[0-9]{10,12}$/, "Невірний формат телефону"),
  cityAddress: z.string().min(3, "Вкажіть місто та адресу"),
  novaPostNumber: z.string().min(1, "Вкажіть номер відділення"),
});

export default function Page() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const { data: currentUser } = useCurrentUser(token);
  const updateUserMutation = useUpdateCurrentUser(token);

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
    },
    validators: { onBlur: profileSchema, onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Не вдалося оновити профіль", {
          description: "Повторіть вхід та спробуйте ще раз.",
        });
        return;
      }

      const fullName = `${value.firstName} ${value.lastName}`.trim();

      try {
        await updateUserMutation.mutateAsync({
          full_name: fullName || null,
          phone_number: value.mobilePhone,
          city: value.cityAddress,
          nova_post_number: value.novaPostNumber,
        });
      } catch (error) {
        console.error("Update profile error", error);
      }
    },
  });

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    form.setFieldValue("firstName", defaultFirstName, {
      dontUpdateMeta: true,
    });
    form.setFieldValue("lastName", defaultLastName, {
      dontUpdateMeta: true,
    });
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

  const { data: myOrders, isLoading: isMyOrdersLoading } = useMyOrders(token);

  return (
    <ContainerLayout>
      <h1 className="text-4xl xl:text-5xl mb-12 text-center">Кабінет</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="min-w-full">
          <h2 className="text-xl mb-4 text-center">Мої замовлення</h2>

          {isMyOrdersLoading ? (
            <div className="flex items-center justify-center mt-10">
              <Loader className="w-10 h-10 animate-spin" />
            </div>
          ) : myOrders?.length === 0 ? (
            <NoOrdersFoundCard />
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <ul className="flex min-w-[32rem] flex-col gap-4 pr-2">
                {myOrders?.map((order) => (
                  <li key={order.id}>
                    <OrderItem order={order} />
                  </li>
                ))}
              </ul>
            </div>
          )}
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

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || updateUserMutation.isPending}
                  className="mt-4 w-full"
                >
                  {isSubmitting || updateUserMutation.isPending
                    ? "Збереження..."
                    : "Зберегти зміни"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>
    </ContainerLayout>
  );
}
