"use client";

import CartItem from "@/components/CartItem";
import ContainerLayout from "@/components/ContainerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deliveryCost, useBasket } from "@/store/cartStore";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

function FieldInfo({ field }: { field: any }) {
  return (
    <>
      {field.state.meta.touchedError && (
        <em>{field.state.meta.touchedError}</em>
      )}
      {field.state.meta.isValidating && <em>Validating...</em>}
    </>
  );
}

const orderSchema = z.object({
  firstName: z.string().min(2, "Ім'я надто коротке").max(50),
  lastName: z.string().min(2, "Прізвище надто коротке"),
  mobilePhone: z
    .string()
    .regex(/^\+?[0-9]{10,12}$/, "Невірний формат телефону"),
  cityAdress: z.string().min(3, "Вкажіть місто та адресу"),
  novaPostNumber: z.string().min(1, "Вкажіть номер відділення"),
  comment: z.string().optional(),
});

export default function Page() {
  const {
    goods: items,
    getTotalCount,
    getTotalPrice,
  } = useBasket((state) => state);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobilePhone: "",
      cityAdress: "",
      novaPostNumber: "",
      comment: undefined,
    },
    validatorAdapter: zodValidator(),
    validators: { onChange: orderSchema },
  });

  return (
    <ContainerLayout>
      <h1 className="text-4xl xl:text-5xl mb-12 text-center">
        Оформити замовлення
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-2">
        <div className="min-w-full">
          <h2 className="text-xl mb-4 text-center">Товари</h2>

          <ul className="no-scrollbar min-w-full fustify-between overflow-y-auto py-3 flex flex-col gap-4">
            {items.map((product) => (
              <li key={uuidv4()}>{<CartItem product={product} />}</li>
            ))}
          </ul>
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
          <h2 className="text-xl mb-6">Особиста інформація</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="firstName">
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>{"Ім'я"}</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="lastName">
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Прізвище</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="mobilePhone">
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Телефон (+380...)</Label>
                  <Input
                    id={field.name}
                    placeholder="+380"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="cityAdress">
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Місто</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="novaPostNumber">
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>
                    Номер відділення Нової Пошти
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
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
                  disabled={!canSubmit}
                  className="mt-4 w-full"
                >
                  {isSubmitting ? "Відправка..." : "Підтвердити замовлення"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>
    </ContainerLayout>
  );
}
