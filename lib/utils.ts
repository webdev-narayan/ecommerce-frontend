import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { mediaBaseUrl } from "@/lib/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mediaUrlGenerator(url?: string): string {
  if (!url) return "/placeholder.svg"
  return mediaBaseUrl + url
}


export const offPercentCalculator = (price: number, mrp: number): number => {
  if (mrp === 0) return 0; // prevent division by zero
  return ((mrp - price) / mrp) * 100;
};