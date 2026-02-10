"use client";

import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Suspense } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login } from "@/domains/auth";

const signUpSchema = z.object({
  email: z.string().email("Введіть коректну електронну адресу"),
  password: z.string().min(6, "Пароль має бути не менше 6 символів"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SignUpFormValues,
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      await login({
        email: value.email,
        password: value.password,
        callbackUrl,
      });
    },
  });

  const pathname = usePathname();

  const getLinkClassName = (href: string) => {
    return cn(
      pathname === href
        ? "border-b-2 border-scheme-1-border"
        : "border-b-2 border-transparent",
    );
  };

  return (
    <section className="px-5 max-h-full md:px-8 xl:px-16 pt-20 md:pt-30">
      <div className="min-w-60 md:min-w-120 w-full mx-0 my-auto flex flex-col justify-center items-center gap-8">
        <NavigationMenu>
          <NavigationMenuList className="grid grid-cols-2 min-w-60 sm:min-w-120 w-full gap-2">
            <NavigationMenuItem
              className={cn(
                getLinkClassName("/sign-up"),
                "flex justify-center items-center w-full",
              )}
            >
              <NavigationMenuLink asChild>
                <Link href="/sign-up">Реєстрація</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem
              className={cn(
                getLinkClassName("/login"),
                "flex justify-center items-center w-full",
              )}
            >
              <NavigationMenuLink asChild>
                <Link href="/login">Вхід</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <h1 className="text-scheme-1-text text-4xl">Вхід</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 w-full flex flex-col"
        >
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2 flex flex-col">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-normal text-black mb-2"
                >
                  Email*
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ваш email"
                  className="w-full"
                />
                {field.state.meta.errors ? (
                  <p className="text-red text-xs mt-1">
                    {field.state.meta.errors
                      .map((err) => err?.message)
                      .join(", ")}{" "}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2 flex flex-col">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-normal text-black mb-2"
                >
                  Пароль*
                </Label>
                <Input
                  id={field.name}
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="********"
                  className="w-full"
                />
                {field.state.meta.errors ? (
                  <p className="text-red text-xs mt-1">
                    {field.state.meta.errors
                      .map((err) => err?.message)
                      .join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <Button type="submit" variant="default" className="w-full mt-6">
            Увійти
          </Button>
        </form>
      </div>
    </section>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
