import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site";

const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — диагностика дорог и мостов`,
};

interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

function buildOpenGraph({
  title,
  description,
  url,
  type,
  publishedTime,
}: {
  title: string;
  description: string;
  url: string;
  type: "website" | "article";
  publishedTime?: string;
}) {
  return {
    title,
    description,
    url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type,
    images: [ogImage],
    ...(publishedTime && { publishedTime }),
  };
}

function buildTwitter(title: string, description: string) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: [ogImage.url],
  };
}

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  type = "website",
  publishedTime,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    alternates: {
      canonical: url,
    },
    openGraph: buildOpenGraph({ title, description, url, type, publishedTime }),
    twitter: buildTwitter(title, description),
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — автоматизированная диагностика дорог и мостов`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: buildOpenGraph({
    title: `${siteConfig.name} — инфраструктура под постоянным контролем`,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
  }),
  twitter: buildTwitter(
    `${siteConfig.name} — инфраструктура под постоянным контролем`,
    siteConfig.description,
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
