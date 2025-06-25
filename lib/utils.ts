import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {mediaBaseUrl} from "@/lib/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export  function mediaUrlGenerator(url?: string): string {
  if (!url) return  "/placeholder.svg"
  return mediaBaseUrl + url
}
