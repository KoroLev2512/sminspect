import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Страница не найдена",
  description: "Запрашиваемая страница не существует.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <p className="eyebrow">Ошибка 404</p>
        <h1 className="headingLg">Страница не найдена</h1>
        <p className="bodyMuted" style={{ margin: "24px auto" }}>
          Возможно, ссылка устарела или страница была перемещена.
        </p>
        <Link href="/" className="btnPrimary">
          На главную
        </Link>
      </div>
    </section>
  );
}
