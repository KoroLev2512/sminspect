import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { JsonLd } from "@/components/JsonLd";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";
import { rootMetadata } from "@/lib/metadata";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#001733",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={inter.className}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <AnalyticsProvider>
          <AuthProvider>
            <SiteChrome>{children}</SiteChrome>
            <CookieBanner />
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
