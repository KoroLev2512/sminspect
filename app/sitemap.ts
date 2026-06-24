import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { newsArticles } from "@/lib/news";
import { solutions } from "@/lib/solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/platform", "/solutions", "/demo", "/privacy", "/terms", "/news"];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...solutions.map((solution) => ({
      url: absoluteUrl(`/solutions/${solution.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...newsArticles.map((article) => ({
      url: absoluteUrl(`/news/${article.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
