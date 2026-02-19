export const CHECKOUT_URLS: Record<number, string> = {
  20: "https://checkout.gadgetxafrica.store/b/eVq9AU0lrc0J51l02IgA80D",
  25: "https://checkout.gadgetxafrica.store/b/cNi14o0lrd4NalFbLqgA80M",
  30: "https://checkout.gadgetxafrica.store/b/00w14oech6GpgK3g1GgA80L",
  35: "https://checkout.gadgetxafrica.store/b/cNi6oIfgl7KteBV5n2gA80B",
  40: "https://checkout.gadgetxafrica.store/b/6oU14o7NT8OxgK39DigA80E",
  45: "https://checkout.gadgetxafrica.store/b/4gM00k0lrfcVgK3bLqgA80F",
  60: "https://checkout.gadgetxafrica.store/b/00wfZi2tze8RgK302IgA80G",
  65: "https://checkout.gadgetxafrica.store/b/9B65kEechaWFgK3cPugA80H",
  85: "https://checkout.gadgetxafrica.store/b/cNicN62tzfcV1P916MgA80I",
  95: "https://checkout.gadgetxafrica.store/b/eVqfZi5FL5Cl1P98zegA80J",
  100: "https://checkout.gadgetxafrica.store/b/eVq3cw8RX5ClctNbLqgA80N",
  150: "https://checkout.gadgetxafrica.store/b/6oUcN69W12q9ctNeXCgA80K",
};

export const getCheckoutUrlForPrice = (price: number): string | undefined => {
  return CHECKOUT_URLS[price];
};
