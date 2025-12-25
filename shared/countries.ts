export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  nameEn: string;
  nameAr: string;
  dialCode: string;
  currency: string;
  currencySymbol: string;
  addressFormat: "us" | "uk" | "fr" | "ar" | "generic";
}

export const COUNTRIES: Country[] = [
  // Major markets first
  { code: "US", name: "États-Unis", nameEn: "United States", nameAr: "الولايات المتحدة", dialCode: "+1", currency: "USD", currencySymbol: "$", addressFormat: "us" },
  { code: "GB", name: "Royaume-Uni", nameEn: "United Kingdom", nameAr: "المملكة المتحدة", dialCode: "+44", currency: "GBP", currencySymbol: "£", addressFormat: "uk" },
  { code: "FR", name: "France", nameEn: "France", nameAr: "فرنسا", dialCode: "+33", currency: "EUR", currencySymbol: "€", addressFormat: "fr" },
  { code: "CA", name: "Canada", nameEn: "Canada", nameAr: "كندا", dialCode: "+1", currency: "CAD", currencySymbol: "$", addressFormat: "us" },
  { code: "DE", name: "Allemagne", nameEn: "Germany", nameAr: "ألمانيا", dialCode: "+49", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  { code: "AE", name: "Émirats Arabes Unis", nameEn: "United Arab Emirates", nameAr: "الإمارات العربية المتحدة", dialCode: "+971", currency: "AED", currencySymbol: "د.إ", addressFormat: "ar" },
  { code: "SA", name: "Arabie Saoudite", nameEn: "Saudi Arabia", nameAr: "المملكة العربية السعودية", dialCode: "+966", currency: "SAR", currencySymbol: "﷼", addressFormat: "ar" },
  
  // Europe
  { code: "ES", name: "Espagne", nameEn: "Spain", nameAr: "إسبانيا", dialCode: "+34", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  { code: "IT", name: "Italie", nameEn: "Italy", nameAr: "إيطاليا", dialCode: "+39", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  { code: "NL", name: "Pays-Bas", nameEn: "Netherlands", nameAr: "هولندا", dialCode: "+31", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  { code: "BE", name: "Belgique", nameEn: "Belgium", nameAr: "بلجيكا", dialCode: "+32", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  { code: "CH", name: "Suisse", nameEn: "Switzerland", nameAr: "سويسرا", dialCode: "+41", currency: "CHF", currencySymbol: "CHF", addressFormat: "generic" },
  { code: "SE", name: "Suède", nameEn: "Sweden", nameAr: "السويد", dialCode: "+46", currency: "SEK", currencySymbol: "kr", addressFormat: "generic" },
  { code: "NO", name: "Norvège", nameEn: "Norway", nameAr: "النرويج", dialCode: "+47", currency: "NOK", currencySymbol: "kr", addressFormat: "generic" },
  { code: "DK", name: "Danemark", nameEn: "Denmark", nameAr: "الدنمارك", dialCode: "+45", currency: "DKK", currencySymbol: "kr", addressFormat: "generic" },
  { code: "FI", name: "Finlande", nameEn: "Finland", nameAr: "فنلندا", dialCode: "+358", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  { code: "PL", name: "Pologne", nameEn: "Poland", nameAr: "بولندا", dialCode: "+48", currency: "PLN", currencySymbol: "zł", addressFormat: "generic" },
  { code: "PT", name: "Portugal", nameEn: "Portugal", nameAr: "البرتغال", dialCode: "+351", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  { code: "AT", name: "Autriche", nameEn: "Austria", nameAr: "النمسا", dialCode: "+43", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  { code: "IE", name: "Irlande", nameEn: "Ireland", nameAr: "أيرلندا", dialCode: "+353", currency: "EUR", currencySymbol: "€", addressFormat: "generic" },
  
  // Middle East & North Africa
  { code: "MA", name: "Maroc", nameEn: "Morocco", nameAr: "المغرب", dialCode: "+212", currency: "MAD", currencySymbol: "د.م.", addressFormat: "ar" },
  { code: "DZ", name: "Algérie", nameEn: "Algeria", nameAr: "الجزائر", dialCode: "+213", currency: "DZD", currencySymbol: "د.ج", addressFormat: "ar" },
  { code: "TN", name: "Tunisie", nameEn: "Tunisia", nameAr: "تونس", dialCode: "+216", currency: "TND", currencySymbol: "د.ت", addressFormat: "ar" },
  { code: "EG", name: "Égypte", nameEn: "Egypt", nameAr: "مصر", dialCode: "+20", currency: "EGP", currencySymbol: "£", addressFormat: "ar" },
  { code: "LB", name: "Liban", nameEn: "Lebanon", nameAr: "لبنان", dialCode: "+961", currency: "LBP", currencySymbol: "ل.ل", addressFormat: "ar" },
  { code: "JO", name: "Jordanie", nameEn: "Jordan", nameAr: "الأردن", dialCode: "+962", currency: "JOD", currencySymbol: "د.ا", addressFormat: "ar" },
  { code: "KW", name: "Koweït", nameEn: "Kuwait", nameAr: "الكويت", dialCode: "+965", currency: "KWD", currencySymbol: "د.ك", addressFormat: "ar" },
  { code: "QA", name: "Qatar", nameEn: "Qatar", nameAr: "قطر", dialCode: "+974", currency: "QAR", currencySymbol: "ر.ق", addressFormat: "ar" },
  { code: "BH", name: "Bahreïn", nameEn: "Bahrain", nameAr: "البحرين", dialCode: "+973", currency: "BHD", currencySymbol: "د.ب", addressFormat: "ar" },
  { code: "OM", name: "Oman", nameEn: "Oman", nameAr: "عمان", dialCode: "+968", currency: "OMR", currencySymbol: "ر.ع.", addressFormat: "ar" },
  
  // Asia-Pacific
  { code: "AU", name: "Australie", nameEn: "Australia", nameAr: "أستراليا", dialCode: "+61", currency: "AUD", currencySymbol: "$", addressFormat: "generic" },
  { code: "NZ", name: "Nouvelle-Zélande", nameEn: "New Zealand", nameAr: "نيوزيلندا", dialCode: "+64", currency: "NZD", currencySymbol: "$", addressFormat: "generic" },
  { code: "JP", name: "Japon", nameEn: "Japan", nameAr: "اليابان", dialCode: "+81", currency: "JPY", currencySymbol: "¥", addressFormat: "generic" },
  { code: "CN", name: "Chine", nameEn: "China", nameAr: "الصين", dialCode: "+86", currency: "CNY", currencySymbol: "¥", addressFormat: "generic" },
  { code: "KR", name: "Corée du Sud", nameEn: "South Korea", nameAr: "كوريا الجنوبية", dialCode: "+82", currency: "KRW", currencySymbol: "₩", addressFormat: "generic" },
  { code: "SG", name: "Singapour", nameEn: "Singapore", nameAr: "سنغافورة", dialCode: "+65", currency: "SGD", currencySymbol: "$", addressFormat: "generic" },
  { code: "HK", name: "Hong Kong", nameEn: "Hong Kong", nameAr: "هونغ كونغ", dialCode: "+852", currency: "HKD", currencySymbol: "$", addressFormat: "generic" },
  { code: "IN", name: "Inde", nameEn: "India", nameAr: "الهند", dialCode: "+91", currency: "INR", currencySymbol: "₹", addressFormat: "generic" },
  { code: "MY", name: "Malaisie", nameEn: "Malaysia", nameAr: "ماليزيا", dialCode: "+60", currency: "MYR", currencySymbol: "RM", addressFormat: "generic" },
  { code: "TH", name: "Thaïlande", nameEn: "Thailand", nameAr: "تايلاند", dialCode: "+66", currency: "THB", currencySymbol: "฿", addressFormat: "generic" },
  { code: "ID", name: "Indonésie", nameEn: "Indonesia", nameAr: "إندونيسيا", dialCode: "+62", currency: "IDR", currencySymbol: "Rp", addressFormat: "generic" },
  { code: "PH", name: "Philippines", nameEn: "Philippines", nameAr: "الفلبين", dialCode: "+63", currency: "PHP", currencySymbol: "₱", addressFormat: "generic" },
  { code: "VN", name: "Vietnam", nameEn: "Vietnam", nameAr: "فيتنام", dialCode: "+84", currency: "VND", currencySymbol: "₫", addressFormat: "generic" },
  
  // Latin America
  { code: "MX", name: "Mexique", nameEn: "Mexico", nameAr: "المكسيك", dialCode: "+52", currency: "MXN", currencySymbol: "$", addressFormat: "generic" },
  { code: "BR", name: "Brésil", nameEn: "Brazil", nameAr: "البرازيل", dialCode: "+55", currency: "BRL", currencySymbol: "R$", addressFormat: "generic" },
  { code: "AR", name: "Argentine", nameEn: "Argentina", nameAr: "الأرجنتين", dialCode: "+54", currency: "ARS", currencySymbol: "$", addressFormat: "generic" },
  { code: "CL", name: "Chili", nameEn: "Chile", nameAr: "تشيلي", dialCode: "+56", currency: "CLP", currencySymbol: "$", addressFormat: "generic" },
  { code: "CO", name: "Colombie", nameEn: "Colombia", nameAr: "كولومبيا", dialCode: "+57", currency: "COP", currencySymbol: "$", addressFormat: "generic" },
  { code: "PE", name: "Pérou", nameEn: "Peru", nameAr: "بيرو", dialCode: "+51", currency: "PEN", currencySymbol: "S/", addressFormat: "generic" },
  
  // Africa
  { code: "ZA", name: "Afrique du Sud", nameEn: "South Africa", nameAr: "جنوب أفريقيا", dialCode: "+27", currency: "ZAR", currencySymbol: "R", addressFormat: "generic" },
  { code: "NG", name: "Nigeria", nameEn: "Nigeria", nameAr: "نيجيريا", dialCode: "+234", currency: "NGN", currencySymbol: "₦", addressFormat: "generic" },
  { code: "KE", name: "Kenya", nameEn: "Kenya", nameAr: "كينيا", dialCode: "+254", currency: "KES", currencySymbol: "KSh", addressFormat: "generic" },
  { code: "GH", name: "Ghana", nameEn: "Ghana", nameAr: "غانا", dialCode: "+233", currency: "GHS", currencySymbol: "₵", addressFormat: "generic" },
  
  // Add more countries as needed (total 195+)
];

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", nameAr: "دولار أمريكي" },
  { code: "EUR", symbol: "€", name: "Euro", nameAr: "يورو" },
  { code: "GBP", symbol: "£", name: "British Pound", nameAr: "جنيه إسترليني" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar", nameAr: "دولار كندي" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", nameAr: "درهم إماراتي" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", nameAr: "ريال سعودي" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", nameAr: "فرنك سويسري" },
  { code: "AUD", symbol: "$", name: "Australian Dollar", nameAr: "دولار أسترالي" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", nameAr: "ين ياباني" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", nameAr: "يوان صيني" },
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function formatPhoneNumber(dialCode: string, number: string): string {
  return `${dialCode} ${number}`;
}

export function getAddressLabel(format: string, lang: "fr" | "en" | "ar"): {
  state: string;
  postalCode: string;
} {
  const labels = {
    us: {
      fr: { state: "État", postalCode: "Code ZIP" },
      en: { state: "State", postalCode: "ZIP Code" },
      ar: { state: "الولاية", postalCode: "الرمز البريدي" },
    },
    uk: {
      fr: { state: "Comté", postalCode: "Code postal" },
      en: { state: "County", postalCode: "Postcode" },
      ar: { state: "المقاطعة", postalCode: "الرمز البريدي" },
    },
    fr: {
      fr: { state: "Région", postalCode: "Code postal" },
      en: { state: "Region", postalCode: "Postal Code" },
      ar: { state: "المنطقة", postalCode: "الرمز البريدي" },
    },
    ar: {
      fr: { state: "Émirat/Province", postalCode: "Code postal" },
      en: { state: "Emirate/Province", postalCode: "Postal Code" },
      ar: { state: "الإمارة/المحافظة", postalCode: "الرمز البريدي" },
    },
    generic: {
      fr: { state: "Province/État", postalCode: "Code postal" },
      en: { state: "State/Province", postalCode: "Postal Code" },
      ar: { state: "الولاية/المحافظة", postalCode: "الرمز البريدي" },
    },
  };

  return labels[format as keyof typeof labels]?.[lang] || labels.generic[lang];
}
