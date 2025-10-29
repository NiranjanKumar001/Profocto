declare module 'tailwind-merge' {
  import type { ClassValue } from 'clsx';
  export function twMerge(...classes: ClassValue[]): string;
  export default twMerge;
}
