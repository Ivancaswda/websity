import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateRandomFrameNumber =  () => {
    const num = Math.floor(Math.random() * 10000);
    console.log(num)
    return num!
}