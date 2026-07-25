export type CurrencyCode = 'GBP' | 'INR' | 'USD' | 'EUR' | 'AED' | 'CAD' | 'AUD' | 'SGD' | 'NZD' | 'CHF' | 'JPY' | 'PKR';

export type Currency = {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
};

export const currencies: Currency[] = [
  { code: 'GBP', name: 'British pound', symbol: '£', locale: 'en-GB' },
  { code: 'INR', name: 'Indian rupee', symbol: '₹', locale: 'en-IN' },
  { code: 'USD', name: 'US dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'AED', name: 'UAE dirham', symbol: 'د.إ', locale: 'en-AE' },
  { code: 'CAD', name: 'Canadian dollar', symbol: '$', locale: 'en-CA' },
  { code: 'AUD', name: 'Australian dollar', symbol: '$', locale: 'en-AU' },
  { code: 'SGD', name: 'Singapore dollar', symbol: '$', locale: 'en-SG' },
  { code: 'NZD', name: 'New Zealand dollar', symbol: '$', locale: 'en-NZ' },
  { code: 'CHF', name: 'Swiss franc', symbol: 'CHF', locale: 'de-CH' },
  { code: 'JPY', name: 'Japanese yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'PKR', name: 'Pakistani rupee', symbol: '₨', locale: 'en-PK' },
];

export function getCurrency(code: CurrencyCode): Currency {
  const currency = currencies.find((item) => item.code === code);
  if (!currency) {
    throw new Error(`Unsupported currency: ${code}`);
  }
  return currency;
}
