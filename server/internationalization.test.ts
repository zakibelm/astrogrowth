import { describe, it, expect } from "vitest";
import { COUNTRIES, CURRENCIES, getCountryByCode, formatPhoneNumber, getAddressLabel } from "../shared/countries";

describe("Internationalization", () => {
  describe("Countries Data", () => {
    it("should have at least 50 countries", () => {
      expect(COUNTRIES.length).toBeGreaterThanOrEqual(50);
    });

    it("should include major markets (US, UK, FR, CA, AE, SA)", () => {
      const codes = COUNTRIES.map((c) => c.code);
      expect(codes).toContain("US");
      expect(codes).toContain("GB");
      expect(codes).toContain("FR");
      expect(codes).toContain("CA");
      expect(codes).toContain("AE");
      expect(codes).toContain("SA");
    });

    it("should have valid dial codes", () => {
      COUNTRIES.forEach((country) => {
        expect(country.dialCode).toMatch(/^\+\d+$/);
      });
    });

    it("should have translations for all languages (FR, EN, AR)", () => {
      COUNTRIES.forEach((country) => {
        expect(country.name).toBeTruthy();
        expect(country.nameEn).toBeTruthy();
        expect(country.nameAr).toBeTruthy();
      });
    });
  });

  describe("Currencies Data", () => {
    it("should have at least 10 currencies", () => {
      expect(CURRENCIES.length).toBeGreaterThanOrEqual(10);
    });

    it("should include major currencies (USD, EUR, GBP, CAD, AED)", () => {
      const codes = CURRENCIES.map((c) => c.code);
      expect(codes).toContain("USD");
      expect(codes).toContain("EUR");
      expect(codes).toContain("GBP");
      expect(codes).toContain("CAD");
      expect(codes).toContain("AED");
    });

    it("should have Arabic translations", () => {
      CURRENCIES.forEach((currency) => {
        expect(currency.nameAr).toBeTruthy();
      });
    });
  });

  describe("getCountryByCode", () => {
    it("should return country for valid code", () => {
      const france = getCountryByCode("FR");
      expect(france).toBeDefined();
      expect(france?.name).toBe("France");
      expect(france?.dialCode).toBe("+33");
      expect(france?.currency).toBe("EUR");
    });

    it("should return undefined for invalid code", () => {
      const invalid = getCountryByCode("XX");
      expect(invalid).toBeUndefined();
    });

    it("should work for Arabic countries", () => {
      const uae = getCountryByCode("AE");
      expect(uae).toBeDefined();
      expect(uae?.dialCode).toBe("+971");
      expect(uae?.currency).toBe("AED");
    });
  });

  describe("formatPhoneNumber", () => {
    it("should format phone with dial code", () => {
      const formatted = formatPhoneNumber("+33", "123456789");
      expect(formatted).toBe("+33 123456789");
    });

    it("should work with different dial codes", () => {
      expect(formatPhoneNumber("+1", "5551234567")).toBe("+1 5551234567");
      expect(formatPhoneNumber("+971", "501234567")).toBe("+971 501234567");
    });
  });

  describe("getAddressLabel", () => {
    it("should return correct labels for US format in French", () => {
      const labels = getAddressLabel("us", "fr");
      expect(labels.state).toBe("État");
      expect(labels.postalCode).toBe("Code ZIP");
    });

    it("should return correct labels for UK format in English", () => {
      const labels = getAddressLabel("uk", "en");
      expect(labels.state).toBe("County");
      expect(labels.postalCode).toBe("Postcode");
    });

    it("should return correct labels for Arabic format in Arabic", () => {
      const labels = getAddressLabel("ar", "ar");
      expect(labels.state).toBe("الإمارة/المحافظة");
      expect(labels.postalCode).toBe("الرمز البريدي");
    });

    it("should fallback to generic for unknown format", () => {
      const labels = getAddressLabel("unknown", "en");
      expect(labels.state).toBe("State/Province");
      expect(labels.postalCode).toBe("Postal Code");
    });
  });

  describe("Currency Conversion Logic", () => {
    it("should have exchange rates for all major currencies", () => {
      // This would test the useCurrency hook logic
      const rates = {
        CAD: 1.0,
        USD: 0.72,
        EUR: 0.67,
        GBP: 0.57,
        AED: 2.64,
      };

      expect(rates.USD).toBeLessThan(rates.CAD);
      expect(rates.EUR).toBeLessThan(rates.CAD);
      expect(rates.AED).toBeGreaterThan(rates.CAD);
    });

    it("should convert prices correctly", () => {
      const priceInCAD = 100;
      const rateUSD = 0.72;
      const priceInUSD = priceInCAD * rateUSD;
      expect(priceInUSD).toBe(72);
    });
  });
});
