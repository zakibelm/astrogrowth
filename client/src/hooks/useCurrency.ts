import { useState, useEffect } from "react";
import { CURRENCIES } from "@/../../shared/countries";

// Exchange rates relative to CAD (base currency in DB)
const EXCHANGE_RATES: Record<string, number> = {
  CAD: 1.0,
  USD: 0.72,
  EUR: 0.67,
  GBP: 0.57,
  AED: 2.64,
  SAR: 2.70,
  CHF: 0.63,
  AUD: 1.10,
  JPY: 105.0,
  CNY: 5.20,
  MAD: 7.20,
  DZD: 97.0,
  TND: 2.25,
  EGP: 35.0,
};

export function useCurrency() {
  // Always use USD
  const selectedCurrency = "USD";

  // No conversion needed - prices are in USD
  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD;
  };

  // Format price with USD symbol
  const formatPrice = (priceInUSD: number): string => {
    return `$${priceInUSD.toFixed(2)}`;
  };

  return {
    selectedCurrency,
    convertPrice,
    formatPrice,
  };
}
