import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

function isSafeR2Key(key: string): boolean {
  if (!key || key.length > 512) return false;
  if (key.includes("..") || key.startsWith("/")) return false;
  return key.split("/").every((seg) => seg.length > 0 && !seg.includes(".."));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("k");
  if (!key || !isSafeR2Key(key)) {
    return new Response("Bad request", { status: 400 });
  }

  let env: { EXAM_FILES: R2Bucket };
  try {
    ({ env } = getRequestContext<{ EXAM_FILES: R2Bucket }>());
  } catch {
    return new Response("Storage unavailable", { status: 503 });
  }

  const obj = await env.EXAM_FILES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const ct =
    obj.httpMetadata?.contentType ??
    (key.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream");

  const headers = new Headers();
  headers.set("Content-Type", ct);
  headers.set("Cache-Control", "private, max-age=3600");
  if (obj.size != null) headers.set("Content-Length", String(obj.size));

  return new Response(obj.body, { status: 200, headers });
}
