import { format, startOfMonth, endOfMonth, parse } from 'date-fns';
import { it } from 'date-fns/locale';

export function formatTransactionDate(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'd MMMM yyyy', { locale: it });
}

export function formatDayHeader(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'EEEE d MMMM', { locale: it });
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: it });
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getMonthBounds(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  };
}

export function getCurrentMonthYear(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}
