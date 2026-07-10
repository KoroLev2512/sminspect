import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { neon } from "@neondatabase/serverless";
import type { Lead, LeadStatus, NewLead } from "./leads-types";

// Server-side store for demo requests (заявки).
//
// Two backends, chosen automatically:
//   • DATABASE_URL set  → Neon Postgres (persistent, for production on Vercel).
//   • DATABASE_URL unset → local JSON file in .data/ (zero-config local dev).
//
// On Vercel: add a Neon Postgres integration (Storage → Create Database) — it
// injects DATABASE_URL for you. The `leads` table is created automatically on
// first write. Locally, run `vercel env pull .env.local` to use the same DB,
// or leave it unset to keep using the file store.

export type { Lead, LeadStatus, NewLead };

const CONNECTION = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
const sql = CONNECTION ? neon(CONNECTION) : null;

// ---------- Postgres (Neon) backend ----------------------------------------

let schemaReady: Promise<void> | null = null;

function ensureSchema(db: NonNullable<typeof sql>) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db`
        CREATE TABLE IF NOT EXISTS leads (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          email text NOT NULL,
          company text NOT NULL,
          role text NOT NULL DEFAULT '',
          segment text NOT NULL,
          message text NOT NULL DEFAULT '',
          status text NOT NULL DEFAULT 'new',
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
    })();
  }
  return schemaReady;
}

function mapRow(r: Record<string, unknown>): Lead {
  return {
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    company: String(r.company),
    role: String(r.role ?? ""),
    segment: String(r.segment),
    message: String(r.message ?? ""),
    status: r.status as LeadStatus,
    createdAt: new Date(r.created_at as string).toISOString(),
  };
}

// ---------- File backend (local dev fallback) ------------------------------

const DATA_DIR = process.env.LEADS_DIR || path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "leads.json");

// Sample заявки so the admin page is populated in file mode (demo project).
const seed: Lead[] = [
  {
    id: "seed-1",
    name: "Дмитрий Ковалёв",
    email: "d.kovalev@avtodor-region.ru",
    company: 'ГКУ «Автодор-Регион»',
    role: "Начальник отдела эксплуатации",
    segment: "Муниципалитет / госорган",
    message:
      "Интересует пилот на 120 км региональных дорог и двух мостах. Нужна оценка сроков внедрения.",
    status: "new",
    createdAt: "2026-07-09T10:24:00.000Z",
  },
  {
    id: "seed-2",
    name: "Елена Соколова",
    email: "sokolova@moststroy-ug.ru",
    company: 'ООО «Мостстрой-Юг»',
    role: "Главный инженер проекта",
    segment: "Дорожно-строительная компания",
    message: "Хотим контролировать качество покрытия на этапе сдачи объектов.",
    status: "in_progress",
    createdAt: "2026-07-07T14:52:00.000Z",
  },
  {
    id: "seed-3",
    name: "Артём Лебедев",
    email: "a.lebedev@translogistic.ru",
    company: 'ООО «ТрансЛогистик»',
    role: "Директор по логистике",
    segment: "Логистика / транспорт",
    message: "Нужен анализ состояния маршрутов для планирования перевозок.",
    status: "done",
    createdAt: "2026-07-03T09:15:00.000Z",
  },
];

async function readFile(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Lead[];
  } catch {
    await writeFile(seed);
    return [...seed];
  }
}

async function writeFile(leads: Lead[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(leads, null, 2), "utf8");
}

// ---------- Public API ------------------------------------------------------

export async function addLead(input: NewLead): Promise<Lead> {
  if (sql) {
    await ensureSchema(sql);
    const rows = (await sql`
      INSERT INTO leads (name, email, company, role, segment, message)
      VALUES (${input.name.trim()}, ${input.email.trim()}, ${input.company.trim()},
              ${input.role.trim()}, ${input.segment.trim()}, ${input.message.trim()})
      RETURNING *
    `) as Record<string, unknown>[];
    return mapRow(rows[0]);
  }

  const leads = await readFile();
  const lead: Lead = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company.trim(),
    role: input.role.trim(),
    segment: input.segment.trim(),
    message: input.message.trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await writeFile([lead, ...leads]);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  if (sql) {
    await ensureSchema(sql);
    const rows = (await sql`
      SELECT * FROM leads ORDER BY created_at DESC
    `) as Record<string, unknown>[];
    return rows.map(mapRow);
  }

  const leads = await readFile();
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead | null> {
  if (sql) {
    await ensureSchema(sql);
    const rows = (await sql`
      UPDATE leads SET status = ${status} WHERE id = ${id} RETURNING *
    `) as Record<string, unknown>[];
    return rows[0] ? mapRow(rows[0]) : null;
  }

  const leads = await readFile();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  leads[idx] = { ...leads[idx], status };
  await writeFile(leads);
  return leads[idx];
}
