import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const followerRanges = {
  nano: "Nano 1,000 - 10,000 followers",
  micro: "Micro 10,000 - 50,000 followers",
  mid: "Mid 50,000 - 500,000 followers",
  macro: "Macro 500,000+ followers"
};
