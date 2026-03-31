import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const sourceQuestionSchema = z.object({
  question: z.string(),
  answers: z.array(z.string()),
  correctIndex: z.number().int().nonnegative(),
});

const bodySchema = z.object({
  questions: z.array(sourceQuestionSchema).min(1),
});

interface GeminiCandidate {
  content?: { parts?: Array<{ text?: string }> };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY;
  return key || null;
}

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

function getGeminiModelId(): string {
  const raw = process.env.GEMINI_MODEL?.trim();
  const id = raw || DEFAULT_GEMINI_MODEL;
  if (!/^[a-zA-Z0-9._-]+$/.test(id)) {
    return DEFAULT_GEMINI_MODEL;
  }
  return id;
}

const SYSTEM_PROMPT = `Та боловсролын мэргэжилтэн, шалгалтын асуулт үүсгэгч юм.

Танд өмнөх хувилбарын олон сонголттой асуултууд (JSON) өгөгдөнө. Таны даалгавар:
1. Асуулт бүрийн сэдэв, ойлголтын түвшин, хэцүү байдлыг ойлгоно.
2. Ижил тооны ШИНЭ асуулт үүсгэнэ — текст, тоо, нөхцөл нь өмнөхөөс ӨӨР байна (хуулбар биш).
3. Сэдэв болон хэцүү байдлыг (жижиг алхамууд, ойлголтын гүн, тооцооны урт) өмнөхтэй ижил түвшинд хадгална.
4. Асуулт бүрт хариултын сонголтын тоо нь эх сурвалжийн адилхан байна (жишээ нь 4 сонголт бол 4).
5. Зөв хариултын индекс (correctIndex) нь 0-ээс эхлэн answers массивын хязгаарт байна.
6. Хэл нь эх асуултын хэлтэй ижил (Монгол бол Монгол гэх мэт).

ГАРГАЛТ: Зөвхөн JSON массив. Markdown, тайлбар бүү нэм.

Формат:
[
  { "question": "...", "answers": ["...", "..."], "correctIndex": 0 },
  ...
]

Массивын урт эх асуултын тоотой яг тэнцүү байх ёстой.`;

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedBody = bodySchema.safeParse(json);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid body: expected { questions: [...] }" },
      { status: 400 },
    );
  }

  const { questions: source } = parsedBody.data;

  const payloadSize = JSON.stringify(source).length;
  if (payloadSize > 200_000) {
    return NextResponse.json(
      { error: "Request payload too large" },
      { status: 400 },
    );
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key is not configured (GEMINI_API_KEY)" },
      { status: 503 },
    );
  }

  const userPayload = JSON.stringify(
    source.map((q, i) => ({
      index: i + 1,
      question: q.question,
      answers: q.answers,
      correctIndex: q.correctIndex,
      optionCount: q.answers.length,
    })),
  );

  const modelId = getGeminiModelId();
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:generateContent?key=${apiKey}`;

  let geminiRes: Response;
  try {
    geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            parts: [
              {
                text: `Эх хувилбарын асуултууд (дараалал хадгалагдана). Шинэ хувилбарын ижил тооны асуултыг JSON массиваар буцаана уу:\n\n${userPayload}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: "application/json",
        },
      }),
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: `Failed to reach Gemini API: ${e instanceof Error ? e.message : "unknown error"}`,
      },
      { status: 502 },
    );
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text().catch(() => "");
    return NextResponse.json(
      {
        error: `Gemini API error (${geminiRes.status}): ${errText.slice(0, 500)}`,
      },
      { status: 502 },
    );
  }

  let geminiData: GeminiResponse;
  try {
    geminiData = (await geminiRes.json()) as GeminiResponse;
  } catch {
    return NextResponse.json(
      { error: "Failed to parse Gemini response" },
      { status: 502 },
    );
  }

  const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  let generated: unknown;
  try {
    generated = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      {
        error: "Failed to parse questions from LLM response",
        raw: rawText.slice(0, 2000),
      },
      { status: 422 },
    );
  }

  if (!Array.isArray(generated)) {
    return NextResponse.json(
      { error: "LLM returned a non-array JSON" },
      { status: 422 },
    );
  }

  if (generated.length !== source.length) {
    return NextResponse.json(
      {
        error: `Expected ${source.length} questions, got ${generated.length}`,
      },
      { status: 422 },
    );
  }

  const out: z.infer<typeof sourceQuestionSchema>[] = [];

  for (let i = 0; i < generated.length; i++) {
    const item = generated[i] as Record<string, unknown>;
    const q =
      typeof item.question === "string" ? item.question.trim() : "";
    const answersRaw = Array.isArray(item.answers)
      ? (item.answers as unknown[]).filter(
          (a): a is string => typeof a === "string",
        )
      : [];
    const answers = answersRaw.map((a) => a.trim()).filter((a) => a.length > 0);
    const correctIndex =
      typeof item.correctIndex === "number" && Number.isInteger(item.correctIndex)
        ? item.correctIndex
        : -1;

    const expectedOptions = source[i]!.answers.length;
    if (answers.length !== expectedOptions) {
      return NextResponse.json(
        {
          error: `Question ${i + 1}: expected ${expectedOptions} answers, got ${answers.length}`,
        },
        { status: 422 },
      );
    }
    if (correctIndex < 0 || correctIndex >= answers.length) {
      return NextResponse.json(
        {
          error: `Question ${i + 1}: invalid correctIndex`,
        },
        { status: 422 },
      );
    }
    if (!q) {
      return NextResponse.json(
        { error: `Question ${i + 1}: empty question text` },
        { status: 422 },
      );
    }

    out.push({ question: q, answers, correctIndex });
  }

  return NextResponse.json({ questions: out });
}
