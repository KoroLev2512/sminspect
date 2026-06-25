import type { Metadata, Viewport } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";
import { rootMetadata } from "@/lib/metadata";
import { organizationSchema, websiteSchema } from "@/lib/schema";

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
    <html lang="ru">
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
