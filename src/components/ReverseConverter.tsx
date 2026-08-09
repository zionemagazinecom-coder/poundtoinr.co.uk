import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { convertFromQuoteCurrency } from '../lib/conversion';
import { exchangeRateProvider, type NormalisedRate } from '../lib/exchangeRateProvider';

const quickAmounts = [10000, 50000, 100000, 500000, 1000000];

export function ReverseConverter() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState<NormalisedRate | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    exchangeRateProvider
      .getCurrentRate('GBP', 'INR')
      .then((nextRate) => {
        if (active) setRate(nextRate);
      })
      .catch(() => {
        if (active) setError('The live INR to GBP rate is unavailable right now.');
      });
    return () => {
      active = false;
    };
  }, []);

  const result = useMemo(() => {
    if (!rate) return null;
    try {
      return convertFromQuoteCurrency(amount, rate);
    } catch {
      return null;
    }
  }, [amount, rate]);

  return (
    <section className="reverse-converter" aria-labelledby="reverse-converter-title">
      <div className="reverse-converter__head">
        <div>
          <span>Live reference tool</span>
          <h2 id="reverse-converter-title">INR to GBP converter</h2>
        </div>
        <strong>{rate ? rate.status : error ? 'Unavailable' : 'Loading'}</strong>
      </div>
      <div className="reverse-converter__fields">
        <label>
          <span>Indian rupees</span>
          <div><b>{'\u20b9'}</b><input aria-label="Indian rupee amount" inputMode="decimal" min="0" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /><em>INR</em></div>
        </label>
        <ArrowRight aria-hidden="true" />
        <label>
          <span>British pounds</span>
          <div aria-live="polite"><b>{'\u00a3'}</b><input aria-label="British pound result" readOnly value={result === null ? '' : formatPounds(result)} /><em>GBP</em></div>
        </label>
      </div>
      {error ? <p className="converter-error">{error}</p> : null}
      {rate ? (
        <p className="reverse-converter__rate">
          1 INR = <strong>{(1 / rate.rate).toFixed(6)} GBP</strong>
          <span>Updated {formatDateTime(rate.fetchedAt)}. Reference rate only; provider quotes may differ.</span>
        </p>
      ) : null}
      <div className="reverse-converter__quick" aria-label="Quick rupee amounts">
        {quickAmounts.map((value) => <button key={value} type="button" onClick={() => setAmount(value)}>{formatRupees(value)}</button>)}
      </div>
    </section>
  );
}

function formatPounds(value: number) {
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);
}

function formatRupees(value: number) {
  return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value));
}
