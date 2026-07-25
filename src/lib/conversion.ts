import type { CurrencyCode } from './currencies';
import type { NormalisedRate } from './exchangeRateProvider';

export type ConversionResult = {
  sourceAmount: number;
  convertedAmount: number;
  reverseRate: number;
  rate: NormalisedRate;
};

export function assertValidAmount(amount: number): void {
  if (!Number.isFinite(amount)) {
    throw new Error('Enter a valid number.');
  }
  if (amount <= 0) {
    throw new Error('Enter an amount greater than zero.');
  }
}

export function convertCurrency(amount: number, rate: NormalisedRate): ConversionResult {
  assertValidAmount(amount);
  return {
    sourceAmount: amount,
    convertedAmount: amount * rate.rate,
    reverseRate: 1 / rate.rate,
    rate,
  };
}

export function formatCurrency(amount: number, code: CurrencyCode, precision = 2): string {
  return new Intl.NumberFormat(code === 'INR' ? 'en-IN' : 'en-GB', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(amount);
}

export function formatRateTimestamp(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function isStaleRate(fetchedAt: string, ttlSeconds: number, now = new Date()): boolean {
  const ageMs = now.getTime() - new Date(fetchedAt).getTime();
  return ageMs > ttlSeconds * 1000;
}

export function buildConversionTable(amounts: number[], rate: NormalisedRate) {
  return amounts.map((amount) => ({
    amount,
    convertedAmount: convertCurrency(amount, rate).convertedAmount,
  }));
}
