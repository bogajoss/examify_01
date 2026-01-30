import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function maskRollNumber(roll: string): string {
  if (!roll || roll.length < 3) return roll;
  return roll.slice(0, -2) + "**";
}
