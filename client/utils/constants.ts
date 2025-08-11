// Centralized application configuration

export const APP_CONFIG = {
  name: "FindIt",
  description: "Campus Lost & Found Portal",
  maxImageSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"] as const,
  redirectDelay: 1500,
  collectionName: "lostFoundItems",
} as const;

export const CATEGORIES = [
  "All Categories", "Electronics", "Bags", "Keys", "Personal Items",
  "Clothing", "Books", "Sports Equipment", "Jewelry", "Other"
] as const;

export const ITEM_STATUS = { LOST: "lost", FOUND: "found" } as const;

export const VALIDATION = {
  maxTitleLength: 100,
  maxDescriptionLength: 500,
  maxLocationLength: 100,
  maxNameLength: 50,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneRegex: /^\+91\s\d{5}\s\d{5}$/,
} as const;

// Environment configuration
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;
