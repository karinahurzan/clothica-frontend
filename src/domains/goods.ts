import api from "@/lib/axios";
import axios from "axios";

interface Price {
  value: number;
  currency: string;
}

export interface GoodFromBackend {
  id: string;
  name: string;
  category_id: string;
  image: string;
  price: Price;
  size: string[];
  description: string;
  prevDescription: string;
  gender: string;
  characteristics: string[];
}

export interface Good {
  id: string;
  name: string;
  category_id: string;
  image: string;
  price: Price;
  size: string[];
  description: string;
  prevDescription: string;
  gender: string;
  characteristics: string[];
}
export async function getGoods(): Promise<Good[]> {
  try {
    const { data } = await api.get("/goods");

    const goodsData: GoodFromBackend[] = data || [];

    if (!Array.isArray(goodsData)) {
      console.error("Неправильний формат відповіді:", data);
      throw new Error("Очікувався масив у полі 'goods'.");
    }

    return goodsData.map((item) => ({
      id: item.id,
      name: item.name,
      category_id: item.category_id,
      image: item.image,
      price: item.price,
      size: item.size,
      description: item.description,
      prevDescription: item.prevDescription,
      gender: item.gender,
      characteristics: item.characteristics,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios помилка:", error.response?.status, error.message);
    } else {
      console.error("Невідома помилка:", error);
    }
    throw new Error("Не вдалося завантажити список товарів");
  }
}
