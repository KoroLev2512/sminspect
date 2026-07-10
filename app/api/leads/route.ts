import { NextResponse } from "next/server";
import { listLeads, setLeadStatus, type LeadStatus } from "@/lib/leads";
import { isAdminAuthed } from "@/lib/admin-auth";

const statuses: LeadStatus[] = ["new", "in_progress", "done"];

const unauthorized = () =>
  NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();

  const leads = await listLeads();
  return NextResponse.json({ leads });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthed())) return unauthorized();

  let body: { id?: string; status?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат данных" }, { status: 400 });
  }

  const { id, status } = body;

  if (!id || !status || !statuses.includes(status as LeadStatus)) {
    return NextResponse.json({ error: "Укажите id и корректный статус" }, { status: 400 });
  }

  const updated = await setLeadStatus(id, status as LeadStatus);
  if (!updated) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }

  return NextResponse.json({ lead: updated });
}
