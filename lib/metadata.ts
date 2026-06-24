import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site";

interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
}

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: absoluteUrl("/logo.png"),
          alt: siteConfig.name,
        },
      ],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — автоматизированная диагностика дорог и мостов`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} — инфраструктура под постоянным контролем`,
    description:
      "Автоматизированная диагностика дефектов мостов и дорожного покрытия с применением ИИ.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: absoluteUrl("/logo.png"),
        alt: siteConfig.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};
