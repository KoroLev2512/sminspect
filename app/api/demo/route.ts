import { NextResponse } from "next/server";
import { addLead } from "@/lib/leads";

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
      { error: "Заполните обязательные поля: имя, электронная почта, компания, сегмент" },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Укажите корректный адрес электронной почты" }, { status: 400 });
  }

  try {
    await addLead({
      name,
      email,
      company,
      role: body.role ?? "",
      segment,
      message: body.message ?? "",
    });
  } catch (err) {
    console.error("[demo-request] failed to store lead", err);
    return NextResponse.json(
      { error: "Не удалось сохранить заявку. Попробуйте позже." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
