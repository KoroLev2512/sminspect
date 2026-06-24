import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartInspect — автоматизированная диагностика дорог и мостов",
  description:
    "Облачная платформа для выявления дефектов инфраструктуры с помощью компьютерного зрения и ИИ. Прогнозирование износа, интерактивная карта, отчёты в реальном времени.",
  openGraph: {
    title: "SmartInspect — инфраструктура под постоянным контролем",
    description:
      "Автоматизированная диагностика дефектов мостов и дорожного покрытия с применением ИИ.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
