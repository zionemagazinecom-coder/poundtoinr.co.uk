import { ArrowLeftRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { currencies, type CurrencyCode } from '../lib/currencies';
import { convertCurrency } from '../lib/conversion';
import { exchangeRateProvider, type NormalisedRate } from '../lib/exchangeRateProvider';

const quickAmounts = [100, 500, 1000, 5000, 10000];

export function Converter() {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState<CurrencyCode>('GBP');
  const [to, setTo] = useState<CurrencyCode>('INR');
  const [rate, setRate] = useState<NormalisedRate | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setError('');
    exchangeRateProvider
      .getCurrentRate(from, to)
      .then((nextRate) => {
        if (active) setRate(nextRate);
      })
      .catch(() => {
        if (active) setError('The rate service is unavailable. No live rate is being shown.');
      });

    return () => {
      active = false;
    };
  }, [from, to]);

  const result = useMemo(() => {
    if (!rate) return null;
    try {
      return convertCurrency(amount, rate);
    } catch {
      return null;
    }
  }, [amount, rate]);

  const validationError = useMemo(() => {
    if (!rate) return '';
    try {
      convertCurrency(amount, rate);
      return '';
    } catch (conversionError) {
      return conversionError instanceof Error ? conversionError.message : 'Check the amount and try again.';
    }
  }, [amount, rate]);

  const rateLabel = rate ? `Live mid-market rate - ${formatDateTime(rate.fetchedAt)}` : 'Live mid-market rate unavailable';
  const statusLabel = rate ? rate.status : 'offline';

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
  }

  return (
    <section className="converter-card">
      <div className="converter-topline">
        <span><i /> {rateLabel}</span>
        <strong>{statusLabel}</strong>
      </div>

      <div className="converter-grid">
        <label className="amount-box">
          <span>You send</span>
          <div className="field-row">
            <b>{from === 'GBP' ? '\u00a3' : from}</b>
            <input
              inputMode="decimal"
              min="0"
              type="number"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              aria-label="Amount to send"
            />
            <select value={from} onChange={(event) => setFrom(event.target.value as CurrencyCode)} aria-label="From currency">
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>{currency.code}</option>
              ))}
            </select>
          </div>
        </label>

        <button className="swap-button" type="button" onClick={swapCurrencies} aria-label="Swap currencies" title="Swap currencies">
          <ArrowLeftRight aria-hidden="true" size={18} />
        </button>

        <label className="amount-box">
          <span>They receive</span>
          <div className="field-row">
            <b>{to === 'INR' ? '\u20b9' : to}</b>
            <input
              readOnly
              value={result ? compactNumber(result.convertedAmount) : ''}
              aria-label="Converted amount"
            />
            <select value={to} onChange={(event) => setTo(event.target.value as CurrencyCode)} aria-label="To currency">
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>{currency.code}</option>
              ))}
            </select>
          </div>
        </label>
      </div>

      {error || validationError ? <p className="converter-error">{error || validationError}</p> : null}

      {result ? (
        <div className="rate-summary" aria-live="polite">
          <p>1 {from} = <strong>{result.rate.rate.toFixed(2)} {to}</strong></p>
          <span>Providers usually apply a margin of 0.3%-4% on top of this rate.</span>
        </div>
      ) : null}

      <div className="quick-amounts">
        {quickAmounts.map((value) => (
          <button type="button" key={value} onClick={() => setAmount(value)}>
            {'\u00a3'}{value.toLocaleString('en-GB')}
          </button>
        ))}
      </div>

    </section>
  );
}

function compactNumber(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: value >= 1000 ? 0 : 1,
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZoneName: 'short',
  }).format(new Date(value));
}
