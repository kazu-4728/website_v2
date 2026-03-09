import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatMinutes(minutes?: number | null) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes}分`;

  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  return remain === 0 ? `${hours}時間` : `${hours}時間${remain}分`;
}
