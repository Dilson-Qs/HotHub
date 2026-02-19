import { useMemo } from "react";
import { useAppSetting } from "@/hooks/useAppSettings";

export type SpecialOfferConfig = {
  badgeText: string;
  title: string;
  price: number;
  originalPrice: number;
  checkoutUrl: string;
  telegramMessage: string;
  benefits: string[];
  expiresAt: string; // ISO string
};

const DEFAULT_CONFIG: SpecialOfferConfig = {
  badgeText: "Limited Time Offer",
  title: "All Content Bundle",
  price: 100,
  originalPrice: 200,
  checkoutUrl: "https://checkout.gadgetxafrica.store/b/eVq3cw8RX5ClctNbLqgA80N",
  telegramMessage: "I want to buy the SPECIAL OFFER - All Content for $100",
  benefits: [
    "Access to ALL premium content",
    "Instant delivery after payment",
    "One-time payment, lifetime access",
    "Exclusive members-only content",
    "24/7 Telegram support",
  ],
  // default: today at 23:59:59
  expiresAt: (() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d.toISOString();
  })(),
};

const parseConfig = (raw: string | null): SpecialOfferConfig => {
  if (!raw) return DEFAULT_CONFIG;
  try {
    const obj = JSON.parse(raw) as Partial<SpecialOfferConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...obj,
      price: Number(obj.price ?? DEFAULT_CONFIG.price),
      originalPrice: Number(obj.originalPrice ?? DEFAULT_CONFIG.originalPrice),
      benefits: Array.isArray(obj.benefits) ? obj.benefits.filter(Boolean) : DEFAULT_CONFIG.benefits,
      expiresAt: typeof obj.expiresAt === "string" && obj.expiresAt ? obj.expiresAt : DEFAULT_CONFIG.expiresAt,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
};

export const useSpecialOffer = () => {
  const { value, isLoading } = useAppSetting("special_offer");
  const config = useMemo(() => parseConfig(value), [value]);
  return { config, isLoading };
};
