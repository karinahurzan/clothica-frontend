"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname();

  const getLinkClassName = (href: string) => {
    return cn(
      pathname === href
        ? "border-b-2 border-scheme-1-border"
        : "border-b-2 border-transparent"
    );
  };

  const hiddenRoutes = ["/login", "/sign-up"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <footer className="px-5 max-h-full md:px-8 xl:px-16 bg-scheme-6-background w-full">
      <div className="mx-auto my-0 py-12 xl:py-20 flex flex-col w-full justify-between items-center">
        <div className="w-full flex flex-col justify-center items-center md:flex-row md:items-start md:justify-between">
          <Link className="leading-none mb-10 md:m-0" href={"/"}>
            <svg className="leading-none" width="84" height="17">
              <use href="/images/auth/logo.svg"></use>
            </svg>
          </Link>

          <div className="mb-8 md:m-0">
            <h3 className="text-center font-semibold mb-4">Меню</h3>
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col">
                <NavigationMenuItem className={getLinkClassName("/")}>
                  <NavigationMenuLink asChild>
                    <Link href="/">Головна</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className={getLinkClassName("/goods")}>
                  <NavigationMenuLink asChild>
                    <Link href="/goods">Товари</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className={getLinkClassName("/categories")}>
                  <NavigationMenuLink asChild>
                    <Link href="/categories">Категорії</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="max-w-100">
            <h3 className="font-semibold mb-4">Підписатися</h3>
            <p className="mb-6">
              Приєднуйтесь до нашої розсилки, щоб бути в курсі новин та акцій.
            </p>

            <div className="flex flex-row gap-4 justify-center items-center">
              <Input
                type="email"
                className="w-full"
                placeholder="Введіть ваш email"
              ></Input>
              <Button variant="secondary">Підписатися</Button>
            </div>
          </div>
        </div>

        <Separator className="mt-10 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <p className="text-center">
            © {new Date().getFullYear()} Clothica. Всі права захищені.
          </p>

          <ul className="flex flex-row justify-center items-center gap-3">
            <li>
              <Link href="https://www.facebook.com/">
                <FaFacebook className="size-8" />
              </Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/">
                <FaInstagram className="size-8" />
              </Link>
            </li>
            <li>
              <Link href="https://x.com/">
                <FaXTwitter className="size-8" />
              </Link>
            </li>
            <li>
              <Link href="https://www.youtube.com/">
                <FaYoutube className="size-8" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
