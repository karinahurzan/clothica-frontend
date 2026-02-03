import axios, { type AxiosRequestConfig } from "axios";
import { handleAxiosError } from "@/lib/handleAxiosError";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
  fallbackMessage?: string,
): Promise<T> {
  try {
    const { data } = await apiClient.get<T>(url, config);
    return data;
  } catch (error) {
    handleAxiosError(error, fallbackMessage);
  }
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
  fallbackMessage?: string,
): Promise<T> {
  try {
    const { data } = await apiClient.post<T>(url, body, config);
    return data;
  } catch (error) {
    handleAxiosError(error, fallbackMessage);
  }
}
