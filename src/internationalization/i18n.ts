export const locales = ["en", "cs", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
