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
  const [selectedCurrency, setSelectedCurrency] = useState<string>("EUR"); // Default EUR for international

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("preferred_currency");
    if (saved && CURRENCIES.find((c) => c.code === saved)) {
      setSelectedCurrency(saved);
    }
  }, []);

  // Save to localStorage
  const setCurrency = (code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem("preferred_currency", code);
  };

  // Convert from CAD (base) to selected currency
  const convertPrice = (priceInCAD: number): number => {
    const rate = EXCHANGE_RATES[selectedCurrency] || 1.0;
    return priceInCAD * rate;
  };

  // Format price with currency symbol
  const formatPrice = (priceInCAD: number): string => {
    const currency = CURRENCIES.find((c) => c.code === selectedCurrency);
    if (!currency) return `${priceInCAD.toFixed(2)} CAD`;

    const convertedPrice = convertPrice(priceInCAD);
    const formatted = convertedPrice.toFixed(2);

    // Handle different currency symbol positions
    if (selectedCurrency === "USD" || selectedCurrency === "CAD" || selectedCurrency === "AUD") {
      return `${currency.symbol}${formatted}`;
    } else if (selectedCurrency === "EUR" || selectedCurrency === "GBP" || selectedCurrency === "CHF") {
      return `${formatted} ${currency.symbol}`;
    } else {
      // Arabic currencies (AED, SAR, etc.)
      return `${formatted} ${currency.symbol}`;
    }
  };

  return {
    selectedCurrency,
    setCurrency,
    convertPrice,
    formatPrice,
    availableCurrencies: CURRENCIES,
  };
}
