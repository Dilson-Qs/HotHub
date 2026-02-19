/**
 * Resolve image URL.
 * External URLs are returned as-is.
 * Empty/null values return an empty string.
 */
export const resolveImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  return imageUrl;
};
