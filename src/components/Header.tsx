"use client";

import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { logout } from "@/domains/auth";
import { CartModal } from "./CartModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Header() {
  const [open, setOpen] = useState(false);

  const { data: session, status } = useSession();
  const token = session?.user?.token;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const pathname = usePathname();

  const hiddenRoutes = ["/login", "/sign-up"];

  if (hiddenRoutes.includes(pathname)) {
    return (
      <header className="px-5 max-h-full md:px-8 xl:px-16 w-full">
        <div className="mx-auto my-0 py-4.5 md:py-8 flex flex-row w-full justify-between items-center">
          <Link className="leading-none" href={"/"}>
            <svg className="leading-none" width="84" height="17">
              <use href="/images/auth/logo.svg"></use>
            </svg>
          </Link>
        </div>
      </header>
    );
  }

  const getLinkClassName = (href: string) => {
    return cn(
      pathname === href
        ? "border-b-2 border-scheme-1-border"
        : "border-b-2 border-transparent",
    );
  };

  const closeMenu = () => setOpen(false);

  const logOut = async () => {
    if (status !== "authenticated" || !token) {
      console.warn("Logout skipped: no token");
      return;
    }

    await logout({ token });
  };

  return (
    <header className="px-5 max-h-full md:px-8 xl:px-16 bg-scheme-5-background w-full">
      <div className="mx-auto my-0 py-4.5 flex flex-row w-full justify-between items-center">
        <Link className="leading-none" href={"/"}>
          <svg className="leading-none" width="84" height="17">
            <use href="/images/auth/logo.svg"></use>
          </svg>
        </Link>

        <NavigationMenu className="hidden xs:block">
          <NavigationMenuList>
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

        <div className="flex flex-row justify-center items-center gap-4">
          {token ? (
            <ul className="flex flex-row gap-4">
              <Link
                href={"/profile"}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "rounded-full py-1 px-2.5 hidden md:flex items-center justify-center",
                )}
              >
                Кабінет
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="rounded-full py-1 px-2.5 hidden md:flex items-center justify-center"
                    variant="default"
                  >
                    Вийти
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Ви точно впевнені, що хочете вийти зі свого акаунту?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ми будемо за Вами сумувати.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="rounded-full py-1 px-2.5 hidden md:flex items-center justify-center"
                      variant="secondary"
                    >
                      Відмінити
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => logOut()}>
                      Вийти
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ul>
          ) : (
            <ul className="flex flex-row gap-4">
              <Link
                href={"/login"}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "rounded-full py-1 px-2.5 hidden md:flex items-center justify-center",
                )}
              >
                Вхід
              </Link>
              <Link
                href={"/sign-up"}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "rounded-full py-1 px-2.5 hidden md:flex items-center justify-center",
                )}
              >
                Реєстрація
              </Link>
            </ul>
          )}
          <Button
            className="border-none md:hidden"
            variant="secondary"
            size="icon"
            onClick={() => setOpen(!open)}
          >
            {open ? <RxCross1 /> : <RxHamburgerMenu />}
          </Button>

          <CartModal />
        </div>
      </div>

      {open && (
        <div className="mx-0 my-auto py-4.5 px-5 fixed inset-0 top-17.5 z-40 bg-scheme-5-background md:hidden flex flex-col items-center justify-center animate-in fade-in duration-200">
          <NavigationMenu className="xs:hidden">
            <NavigationMenuList className="flex-col pt-10 pb-16 gap-8">
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

          <div className="flex flex-col gap-4 w-full max-w-[320px]">
            {token ? (
              <>
                <Link
                  href={"/profile"}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full rounded-full py-6 text-lg border-none shadow-none",
                  )}
                >
                  Кабінет
                </Link>
                <Button
                  variant="default"
                  onClick={() => logOut()}
                  className="w-full rounded-full py-6 text-lg border-none shadow-none"
                >
                  Вийти
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full rounded-full py-6 text-lg border-none shadow-none",
                  )}
                >
                  Вхід
                </Link>
                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full rounded-full py-6 text-lg border-none text-black",
                  )}
                >
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
