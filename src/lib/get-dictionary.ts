import 'server-only';
export async function getDictionary(locale: string) {
  const dict = await import(`../messages/${locale}.json`).then(m => m.default);
  return dict;
}