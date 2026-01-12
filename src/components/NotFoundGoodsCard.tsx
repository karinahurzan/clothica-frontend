import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

export interface NotFoundGoodsCardProps {
  onClick?: () => void;
  isLoading?: boolean;
  type?: "functional" | "static";
}

export default function NotFoundGoodsCard({
  onClick,
  isLoading,
  type = "static",
}: NotFoundGoodsCardProps) {
  if (type === "functional") {
    return (
      <div className="bg-deco-light py-6 px-4 md:px-8 xl:px-22 gap-4 max-h-65 md:max-h-40 rounded-2xl flex flex-col justify-between items-center">
        <p className="font-semibold text-lg text-center">
          За вашим запитом не знайдено жодних товарів, спробуйте змінити
          фільтри, або скинути їх
        </p>
        <Button onClick={onClick} className="md:w-40" variant="default">
          {isLoading ? (
            <Loader className="w-10 h-10 animate-spin" />
          ) : (
            "Скинути фільтри"
          )}
        </Button>
      </div>
    );
  } else {
    return (
      <div className="bg-deco-light py-6 px-4 md:px-8 xl:px-22 gap-4 rounded-2xl flex flex-col justify-between items-center">
        <p className="font-semibold text-lg text-center">
          На жаль, на сервері виникла помилка під час завантаження товарів. Будь
          ласка, спробуйте пізніше
        </p>
      </div>
    );
  }
}
