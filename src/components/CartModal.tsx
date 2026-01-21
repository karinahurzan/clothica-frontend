"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { v4 as uuidv4 } from "uuid";

import { X } from "lucide-react";
import { MdOutlineShoppingCart } from "react-icons/md";
import CartItem from "./CartItem";
import { useBasket } from "@/store/cartStore";

export function CartModal() {
  const { goods: items, getTotalCount } = useBasket((state) => state);

  console.log(items);

  // if (!isHydrated) {
  //   return (
  //     <Button className="relative p-0 h-9 w-9 rounded-full bg-neutral-darkest text-white">
  //       <MdOutlineShoppingCart className="h-8 w-8" />
  //     </Button>
  //   );
  // }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className="relative p-0 gap-0 hover:bg-neutral-darkest active:bg-neutral-darkest focus:bg-neutral-darkest h-9 w-9 rounded-full border-none bg-neutral-darkest text-white flex justify-center items-center cursor-pointer">
          <MdOutlineShoppingCart className="rounded-25 h-8 w-8 flex items-center justify-center bg-neutral-darkest-5" />

          {getTotalCount() > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red text-xs font-semibold text-white">
              {getTotalCount()}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pt-10 pr-16 pb-16 pl-8">
        <DrawerHeader className="flex items-end p-0 gap-6!">
          <DrawerClose asChild>
            <X className="cursor-pointer" />
          </DrawerClose>

          <DrawerTitle className="text-5xl text-center inline-block mx-auto">
            Ваш кошик
          </DrawerTitle>
        </DrawerHeader>
        {items.length === 0 ? (
          <div className="bg-deco-light py-6 px-4 md:px-8 xl:px-22 gap-4 rounded-2xl flex flex-col justify-between items-center w-full xl:max-w-190 self-start">
            <p className="font-semibold text-lg text-center">
              Тут поки що порожньо...
            </p>
          </div>
        ) : (
          <>
            <ul className="no-scrollbar overflow-y-auto py-6">
              {items.map((product) => (
                <li key={uuidv4()}>{/* <CartItem product={product} /> */}</li>
              ))}
            </ul>
            <DrawerFooter>
              <Button>Submit</Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
