import { NextResponse } from "next/server";

interface DemoPayload {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  segment?: string;
  message?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: DemoPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат данных" }, { status: 400 });
  }

  const { name, email, company, segment } = body;

  if (!name?.trim() || !email?.trim() || !company?.trim() || !segment?.trim()) {
    return NextResponse.json(
      { error: "Заполните обязательные поля: имя, эл. почта, компания, сегмент" },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Укажите корректный адрес электронной почты" }, { status: 400 });
  }

  // TODO: integrate CRM / email notification
  console.info("[demo-request]", {
    name: name.trim(),
    email: email.trim(),
    company: company.trim(),
    role: body.role?.trim() ?? "",
    segment: segment.trim(),
    message: body.message?.trim() ?? "",
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
