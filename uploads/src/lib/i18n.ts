export const locales = ['cs', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'cs';

export const pathnames = {
  '/': '/',
  '/services': { cs: '/sluzby', en: '/services' },
  '/contact':  { cs: '/kontakt', en: '/contact' }
} as const;
