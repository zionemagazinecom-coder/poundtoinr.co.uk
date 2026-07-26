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

export class ServerExchangeRateProvider implements ExchangeRateProvider {
  name = 'Server exchange-rate proxy';

  async getCurrentRate(base: CurrencyCode, quote: CurrencyCode): Promise<NormalisedRate> {
    const response = await fetch(`/api/rates/current?base=${base}&quote=${quote}`, {
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Rate proxy returned ${response.status}`);
    }

    return normaliseServerRate(await response.json(), base, quote);
  }
}

function normaliseServerRate(payload: unknown, base: CurrencyCode, quote: CurrencyCode): NormalisedRate {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid rate response.');
  }

  const value = payload as Record<string, unknown>;
  const rate = Number(value.rate);
  const providerTimestamp = typeof value.providerTimestamp === 'string' ? value.providerTimestamp : String(value.fetchedAt);
  const fetchedAt = typeof value.fetchedAt === 'string' ? value.fetchedAt : new Date().toISOString();
  const status = value.status === 'live' || value.status === 'delayed' || value.status === 'cached' ? value.status : undefined;

  if (!Number.isFinite(rate) || rate <= 0 || !status) {
    throw new Error('Invalid live rate response.');
  }

  return {
    base,
    quote,
    rate,
    providerName: String(value.providerName ?? 'ExchangeRate-API'),
    providerTimestamp,
    fetchedAt,
    status,
    dailyHigh: typeof value.dailyHigh === 'number' ? value.dailyHigh : undefined,
    dailyLow: typeof value.dailyLow === 'number' ? value.dailyLow : undefined,
    movementPercent: typeof value.movementPercent === 'number' ? value.movementPercent : undefined,
  };
}

export const exchangeRateProvider = new ServerExchangeRateProvider();
