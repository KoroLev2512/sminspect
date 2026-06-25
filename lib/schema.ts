import type { NewsArticle } from "./news";
import { absoluteUrl, siteConfig } from "./site";

type Schema = Record<string, unknown>;

export function organizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.operator,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    email: siteConfig.email,
    description: siteConfig.description,
  };
}

export function websiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "ru-RU",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(article: NewsArticle): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    inLanguage: "ru-RU",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/news/${article.slug}`),
    },
  };
}

export function softwareApplicationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    url: absoluteUrl("/platform"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
      description: "Запрос демо через сайт",
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.operator,
    },
  };
}
