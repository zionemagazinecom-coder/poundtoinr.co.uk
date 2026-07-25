import type { CurrencyCode } from './currencies';

export type RateStatus = 'live' | 'delayed' | 'cached' | 'mock';

export type NormalisedRate = {
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  providerName: string;
  providerTimestamp: string;
  fetchedAt: string;
  status: RateStatus;
  dailyHigh?: number;
  dailyLow?: number;
  movementPercent?: number;
};

export type ExchangeRateProvider = {
  name: string;
  getCurrentRate(base: CurrencyCode, quote: CurrencyCode): Promise<NormalisedRate>;
};

const mockRates: Record<string, number> = {
  'GBP-INR': 128.66,
  'INR-GBP': 1 / 128.66,
  'GBP-USD': 1.29,
  'GBP-EUR': 1.18,
  'GBP-AED': 4.74,
  'USD-INR': 87.16,
  'EUR-INR': 95.3,
  'AED-INR': 23.72,
};

export class MockExchangeRateProvider implements ExchangeRateProvider {
  name = 'Mock reference provider';

  async getCurrentRate(base: CurrencyCode, quote: CurrencyCode): Promise<NormalisedRate> {
    const direct = mockRates[`${base}-${quote}`];
    const inverse = mockRates[`${quote}-${base}`];
    const rate = direct ?? (inverse ? 1 / inverse : undefined);

    if (!rate) {
      throw new Error(`No mock rate configured for ${base}/${quote}`);
    }

    const now = new Date('2026-07-25T12:00:00.000Z').toISOString();
    return {
      base,
      quote,
      rate,
      providerName: this.name,
      providerTimestamp: now,
      fetchedAt: now,
      status: 'mock',
      dailyHigh: rate * 1.006,
      dailyLow: rate * 0.994,
      movementPercent: 0.18,
    };
  }
}

export class ServerExchangeRateProvider implements ExchangeRateProvider {
  name = 'Server exchange-rate proxy';
  private fallback = new MockExchangeRateProvider();

  async getCurrentRate(base: CurrencyCode, quote: CurrencyCode): Promise<NormalisedRate> {
    try {
      const response = await fetch(`/api/rates/current?base=${base}&quote=${quote}`, {
        headers: { accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Rate proxy returned ${response.status}`);
      }

      return normaliseServerRate(await response.json(), base, quote);
    } catch {
      return this.fallback.getCurrentRate(base, quote);
    }
  }
}

function normaliseServerRate(payload: unknown, base: CurrencyCode, quote: CurrencyCode): NormalisedRate {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid rate response.');
  }

  const value = payload as Record<string, unknown>;
  return {
    base,
    quote,
    rate: Number(value.rate),
    providerName: String(value.providerName ?? 'ExchangeRate-API'),
    providerTimestamp: String(value.providerTimestamp),
    fetchedAt: String(value.fetchedAt),
    status: value.status === 'live' || value.status === 'delayed' || value.status === 'cached' ? value.status : 'live',
    dailyHigh: typeof value.dailyHigh === 'number' ? value.dailyHigh : undefined,
    dailyLow: typeof value.dailyLow === 'number' ? value.dailyLow : undefined,
    movementPercent: typeof value.movementPercent === 'number' ? value.movementPercent : undefined,
  };
}

export const exchangeRateProvider = new ServerExchangeRateProvider();
