export const LOCALE: string = 'cs-CZ';
export const CURRENCY_SYMBOL: string = 'Kč';

export function roundCurrency(value: number, digits: number = 1): string {
  const roundedValue: string = value.toLocaleString(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  return `${roundedValue} ${CURRENCY_SYMBOL}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
