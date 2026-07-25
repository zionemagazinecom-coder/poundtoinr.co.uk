import { describe, expect, it } from 'vitest';
import { calculateExchangeRateMarkup, calculateTravelBudget } from './calculators';
import { buildConversionTable, convertCurrency, formatCurrency, isStaleRate } from './conversion';
import type { NormalisedRate } from './exchangeRateProvider';

const rate: NormalisedRate = {
  base: 'GBP',
  quote: 'INR',
  rate: 100,
  providerName: 'Test',
  providerTimestamp: '2026-07-25T12:00:00.000Z',
  fetchedAt: '2026-07-25T12:00:00.000Z',
  status: 'mock',
};

describe('currency conversion', () => {
  it('converts GBP to INR', () => {
    expect(convertCurrency(10, rate).convertedAmount).toBe(1000);
  });

  it('calculates reverse rate', () => {
    expect(convertCurrency(1, rate).reverseRate).toBe(0.01);
  });

  it('rejects zero and negative amounts', () => {
    expect(() => convertCurrency(0, rate)).toThrow('greater than zero');
    expect(() => convertCurrency(-1, rate)).toThrow('greater than zero');
  });

  it('formats INR with the correct currency code', () => {
    expect(formatCurrency(1234.5, 'INR')).toContain('₹');
  });

  it('detects stale rates', () => {
    expect(isStaleRate(rate.fetchedAt, 60, new Date('2026-07-25T12:02:00.000Z'))).toBe(true);
  });

  it('builds conversion tables from the active rate', () => {
    expect(buildConversionTable([1, 5], rate)).toEqual([
      { amount: 1, convertedAmount: 100 },
      { amount: 5, convertedAmount: 500 },
    ]);
  });
});

describe('financial calculators', () => {
  it('calculates exchange-rate markup', () => {
    const result = calculateExchangeRateMarkup({
      referenceRate: 100,
      providerRate: 98,
      sendingAmount: 100,
      transferFee: 5,
    });

    expect(result.markupPercent).toBe(2);
    expect(result.amountLostToMarkup).toBe(200);
    expect(result.estimatedTotalCost).toBe(205);
  });

  it('calculates travel budget totals', () => {
    const result = calculateTravelBudget({
      accommodation: 50,
      food: 20,
      transport: 10,
      activities: 10,
      shopping: 10,
      travellers: 2,
      days: 3,
      emergencyBufferPercent: 10,
      referenceRate: 100,
    });

    expect(result.totalBudget).toBe(660);
    expect(result.convertedBudget).toBe(66000);
  });
});
