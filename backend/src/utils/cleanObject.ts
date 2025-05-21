export function cleanObj<T extends Record<string, any>>(object: T): Partial<T> {
  return Object.fromEntries(Object.entries(object).filter(([_, value]) => value != null)) as Partial<T>
}
