const DEFAULT_TELEGRAM_USERNAME = "HotHub";

/**
 * Extracts a clean Telegram username from various input formats:
 * - "username" → "username"
 * - "@username" → "username"
 * - "https://t.me/username" → "username"
 * - "t.me/username" → "username"
 */
export const cleanTelegramUsername = (input: string): string => {
  if (!input) return DEFAULT_TELEGRAM_USERNAME;
  let cleaned = input.trim();
  if (cleaned.startsWith('@')) cleaned = cleaned.slice(1);
  const match = cleaned.match(/(?:https?:\/\/)?t\.me\/([^/?]+)/i);
  if (match) return match[1];
  return cleaned;
};

export const generateBuyLink = (telegramUsername: string = DEFAULT_TELEGRAM_USERNAME): string => {
  const username = cleanTelegramUsername(telegramUsername);
  return `https://t.me/${username}`;
};

export const generateSupportLink = (
  title: string,
  price: number,
  telegramUsername: string = DEFAULT_TELEGRAM_USERNAME
): string => {
  const username = cleanTelegramUsername(telegramUsername);
  const message = encodeURIComponent(
    `Hello HotHub support, I want to buy: ${title} – Price: $${price.toFixed(2)}`
  );
  return `https://t.me/${username}?text=${message}`;
};

/**
 * Build a Telegram link with a custom message.
 * Handles any username format (plain, @, full URL).
 */
export const buildTelegramLink = (telegramUsername: string, message: string): string => {
  const username = cleanTelegramUsername(telegramUsername);
  return `https://t.me/${username}?text=${encodeURIComponent(message)}`;
};

/** Debounce guard: prevents opening the same URL twice within 1 second */
let lastOpenedUrl = '';
let lastOpenedTime = 0;

/**
 * Safely open an external URL in a new tab.
 * - Adds https:// if missing
 * - Prevents duplicate tabs (debounce within 1s)
 */
export const safeOpenExternal = (url: string): void => {
  let finalUrl = url?.trim();
  if (!finalUrl) return;
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = 'https://' + finalUrl;
  }

  const now = Date.now();
  if (finalUrl === lastOpenedUrl && now - lastOpenedTime < 1000) {
    return; // skip duplicate
  }
  lastOpenedUrl = finalUrl;
  lastOpenedTime = now;

  window.open(finalUrl, "_blank", "noopener,noreferrer");
};

export const openTelegramLink = (url: string): void => {
  let finalUrl = url?.trim();
  if (!finalUrl) {
    finalUrl = `https://t.me/${DEFAULT_TELEGRAM_USERNAME}`;
  }
  safeOpenExternal(finalUrl);
};
