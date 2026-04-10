import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, period?: string) {
  return `${price.toLocaleString("fr-MA")} MAD${period ? `/${period}` : ""}`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-MA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function diffDays(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}
