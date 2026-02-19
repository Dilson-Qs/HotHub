export interface PurchaseNotification {
  id: string;
  buyerName: string;
  country: string;
  countryCode: string;
  productName: string;
  price: number;
}

const BUYER_NAMES = [
  'Someone', 'A customer', 'A buyer', 'Someone', 'A customer', 'Someone',
  'A buyer', 'Someone', 'A customer', 'Someone'
];

const COUNTRIES = [
  { name: 'USA', code: 'US', flag: '🇺🇸' },
  { name: 'UK', code: 'GB', flag: '🇬🇧' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
];

const PRODUCT_NAMES = [
  'Exclusive Content 🔥',
  'Premium Bundle',
  'Hot Collection 🔥',
  'VIP Content',
  'Special Pack',
  'Premium Access',
];

const PRICES = [20, 25, 30, 35, 40, 45, 60, 65, 85, 95];

export const getCountryFlag = (countryCode: string): string => {
  return COUNTRIES.find(c => c.code === countryCode)?.flag || '🌍';
};

export const generateRandomNotification = (): PurchaseNotification => {
  const buyerName = BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)];
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const productName = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
  const price = PRICES[Math.floor(Math.random() * PRICES.length)];

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    buyerName,
    country: country.name,
    countryCode: country.code,
    productName,
    price,
  };
};
