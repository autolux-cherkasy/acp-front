import type { MetadataRoute } from "next";

import { popularRoutes } from "@/src/entities/trip";
import { locales } from "@/src/shared/i18n/config";
import { localizeHref } from "@/src/shared/i18n/routing";
import { buildAbsoluteUrl, getLocaleAlternates } from "@/src/shared/seo/metadata";

const staticPages = [
  { pathname: "/", changeFrequency: "daily" as const, priority: 1 },
  { pathname: "/cafe", changeFrequency: "weekly" as const, priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = staticPages.flatMap(({ pathname, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: buildAbsoluteUrl(localizeHref(pathname, locale)),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: getLocaleAlternates(pathname),
      },
    })),
  );

  const routeEntries = popularRoutes.flatMap((route) =>
    locales.map((locale) => {
      const pathname = `/tickets/${route.id}`;

      return {
        url: buildAbsoluteUrl(localizeHref(pathname, locale)),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: getLocaleAlternates(pathname),
        },
      };
    }),
  );

  return [...staticEntries, ...routeEntries];
}
