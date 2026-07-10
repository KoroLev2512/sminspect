import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionValue, verifyToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let body: { token?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат данных" }, { status: 400 });
  }

  if (!verifyToken(body.token ?? "")) {
    return NextResponse.json({ error: "Неверный ключ доступа" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
