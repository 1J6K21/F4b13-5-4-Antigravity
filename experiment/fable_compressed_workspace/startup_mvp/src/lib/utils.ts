import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Analytics
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    console.log(`[Analytics Track] ${event}`, properties);
  },
  identify: (userId: string, traits?: Record<string, any>) => {
    console.log(`[Analytics Identify] ${userId}`, traits);
  }
};
