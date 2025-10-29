declare module 'clsx' {
  export type ClassValue = string | number | boolean | undefined | null | ClassValue[] | { [key: string]: any };
  export function clsx(...inputs: ClassValue[]): string;
  export default clsx;
}
