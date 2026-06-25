import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { newsArticles } from "@/lib/news";
import { solutions } from "@/lib/solutions";

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" },
  { path: "/solutions", priority: 0.8, changeFrequency: "monthly" },
  { path: "/demo", priority: 0.8, changeFrequency: "monthly" },
  { path: "/news", priority: 0.7, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    })),
    ...solutions.map((solution) => ({
      url: absoluteUrl(`/solutions/${solution.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...newsArticles.map((article) => ({
      url: absoluteUrl(`/news/${article.slug}`),
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
