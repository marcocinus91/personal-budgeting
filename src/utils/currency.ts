const eurFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEUR(amount: number): string {
  return eurFormatter.format(amount);
}

export function parseEURInput(input: string): number | null {
  const cleaned = input.replace(/[^\d,.\-]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.round(num * 100) / 100;
}
