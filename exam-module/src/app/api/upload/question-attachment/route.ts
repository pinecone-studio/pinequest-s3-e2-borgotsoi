import { getRequestContext } from "@cloudflare/next-on-pages";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { exams } from "@/db/schema";

export const runtime = "edge";

const MAX_BYTES = 20 * 1024 * 1024;

const EXAM_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_EXT = new Set(["pdf", "jpeg", "jpg", "png", "gif", "webp"]);

function extFromFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const dot = name.lastIndexOf(".");
  if (dot >= 0) {
    const e = name.slice(dot + 1);
    if (ALLOWED_EXT.has(e)) return e === "jpeg" ? "jpg" : e;
  }
  const t = file.type.toLowerCase();
  if (t === "application/pdf" || t === "application/x-pdf") return "pdf";
  if (t === "image/jpeg" || t === "image/jpg") return "jpg";
  if (t === "image/png") return "png";
  if (t === "image/gif") return "gif";
  if (t === "image/webp") return "webp";
  return null;
}

function contentTypeForExt(ext: string): string {
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function isAllowedFile(file: File): boolean {
  return extFromFile(file) != null;
}

export async function POST(request: Request) {
  let env: { DB: D1Database; EXAM_FILES: R2Bucket };
  try {
    ({ env } = getRequestContext<{ DB: D1Database; EXAM_FILES: R2Bucket }>());
  } catch {
    return Response.json(
      { error: "Upload is only available on Cloudflare (Pages) with R2 bound." },
      { status: 503 },
    );
  }

  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("multipart/form-data")) {
    return Response.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const examId = String(form.get("examId") ?? "").trim();
  if (!EXAM_ID_RE.test(examId)) {
    return Response.json({ error: "Invalid examId" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }

  if (!isAllowedFile(file)) {
    return Response.json(
      { error: "Allowed: PDF, JPEG, JPG, PNG, GIF, WebP" },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: `File too large (max ${MAX_BYTES / (1024 * 1024)} MB)` },
      { status: 400 },
    );
  }

  const db = getDb(env.DB);
  const examRow = await db
    .select({ id: exams.id })
    .from(exams)
    .where(eq(exams.id, examId))
    .limit(1);
  if (!examRow[0]) {
    return Response.json({ error: "Exam not found" }, { status: 404 });
  }

  const ext = extFromFile(file)!;
  const key = `exams/${examId}/${crypto.randomUUID()}.${ext}`;
  const buf = await file.arrayBuffer();

  await env.EXAM_FILES.put(key, buf, {
    httpMetadata: { contentType: contentTypeForExt(ext) },
  });

  return Response.json({ key });
}
