import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const followerRanges = {
  nano: "Nano 1,000 - 10,000 followers",
  micro: "Micro 10,000 - 50,000 followers",
  mid: "Mid 50,000 - 500,000 followers",
  macro: "Macro 500,000+ followers",
};

export const contentTypeCategories = [
  "Fashion",
  "Fitness",
  "Wellness",
  "Health",
  "Nutrition",
  "Lifestyle",
  "Parenting",
  "Family",
  "Home",
  "Interior Design",
  "Tech",
  "Gadgets",
  "Gaming",
  "Esports",
  "Music",
  "Performing Arts",
  "Art",
  "Design",
  "Illustration",
  "Education",
  "Study",
  "Learning",
  "Motivation",
  "Mindset",
  "Self-help",
  "Cars",
  "Motorsports",
  "Pets",
  "Animals",
  "Sustainability",
  "Eco-Living",
  "Entertainment",
  "Pop Culture",
  "Memes",
];

export const capitalize = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1);

