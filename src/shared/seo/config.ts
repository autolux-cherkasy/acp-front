const DEFAULT_SITE_URL = "https://acp-front-95e5.vercel.app";

function resolveSiteUrl() {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;

  try {
    return new URL(candidate);
  } catch (error) {
    console.warn(`Invalid NEXT_PUBLIC_SITE_URL value "${candidate}". Falling back to ${DEFAULT_SITE_URL}.`, error);
    return new URL(DEFAULT_SITE_URL);
  }
}

export const siteUrl = resolveSiteUrl();
export const siteOrigin = siteUrl.origin;
export const defaultOgImagePath = "/BookingHero/main_photo_bus.png";
