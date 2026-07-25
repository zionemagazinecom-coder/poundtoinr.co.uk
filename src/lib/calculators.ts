export type MarkupInput = {
  referenceRate: number;
  providerRate: number;
  sendingAmount: number;
  transferFee: number;
};

export function calculateExchangeRateMarkup(input: MarkupInput) {
  const { referenceRate, providerRate, sendingAmount, transferFee } = input;
  if (referenceRate <= 0 || providerRate <= 0 || sendingAmount <= 0 || transferFee < 0) {
    throw new Error('Calculator values must be positive, and fees cannot be negative.');
  }

  const referenceConvertedAmount = sendingAmount * referenceRate;
  const providerConvertedAmount = sendingAmount * providerRate;
  const markupPercent = ((referenceRate - providerRate) / referenceRate) * 100;
  const amountLostToMarkup = referenceConvertedAmount - providerConvertedAmount;

  return {
    referenceConvertedAmount,
    providerConvertedAmount,
    markupPercent,
    amountLostToMarkup,
    explicitFee: transferFee,
    estimatedTotalCost: amountLostToMarkup + transferFee,
  };
}

export type TravelBudgetInput = {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  shopping: number;
  travellers: number;
  days: number;
  emergencyBufferPercent: number;
  referenceRate: number;
};

export function calculateTravelBudget(input: TravelBudgetInput) {
  const dailyBase = input.accommodation + input.food + input.transport + input.activities + input.shopping;
  const tripBase = dailyBase * input.travellers * input.days;
  const emergencyReserve = tripBase * (input.emergencyBufferPercent / 100);
  const totalBudget = tripBase + emergencyReserve;

  return {
    dailyBudget: dailyBase,
    perPersonAmount: totalBudget / input.travellers,
    emergencyReserve,
    totalBudget,
    convertedBudget: totalBudget * input.referenceRate,
  };
}
