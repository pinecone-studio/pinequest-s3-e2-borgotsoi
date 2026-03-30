// import Anthropic from "@anthropic-ai/sdk";
// import { z } from "zod";

// export const runtime = "edge";

// // ─── Request validation ───────────────────────────────────────────────────────
// const requestSchema = z.object({
//   classId:   z.string(),
//   className: z.string().default(""),
//   students:  z.array(z.object({ id: z.string(), name: z.string(), score: z.number(), variant: z.string() })),
//   questions: z.array(z.object({ no: z.number(), text: z.string(), score: z.number(), options: z.array(z.string()), correct: z.string() })),
//   stats:     z.array(z.object({ q: z.string(), wrong: z.number() })),
// });

// // ─── JSON Schema for structured output ───────────────────────────────────────
// const RESPONSE_SCHEMA = {
//   type: "object",
//   required: [
//     "summary", "weakTopic", "weakTopicReason",
//     "recommendation", "positiveNote", "trendingMisconception",
//     "classHealthScore", "nextLessonPlan",
//     "atRiskStudents", "studentDiagnostics",
//   ],
//   properties: {
//     summary:               { type: "string", description: "Ангийн нийт дүнгийн тойм тайлбар (3-4 өгүүлбэр)" },
//     weakTopic:             { type: "string", description: "Хамгийн их алдаа гарсан сэдвийн нэр" },
//     weakTopicReason:       { type: "string", description: "Яагаад энэ сэдвээр алдаа гарсан тайлбар" },
//     recommendation:        { type: "string", description: "Дараагийн хичээлд хэрэгжүүлэх тодорхой зөвлөмж" },
//     positiveNote:          { type: "string", description: "Ангийн сайн тал, амжилтын мөч" },
//     trendingMisconception: { type: "string", description: "Сурагчдын нийтлэг гаргаж буй логик алдаа" },
//     classHealthScore:      { type: "number", description: "Ангийн эрүүл мэндийн үзүүлэлт 0-100" },
//     nextLessonPlan:        { type: "string", description: "Маргаашийн хичээлийн action plan" },
//     atRiskStudents: {
//       type: "array",
//       items: {
//         type: "object",
//         required: ["name", "reason"],
//         properties: {
//           name:   { type: "string" },
//           reason: { type: "string", description: "Яагаад эрсдэлтэй гэж үзсэн тайлбар" },
//         },
//       },
//     },
//     studentDiagnostics: {
//       type: "array",
//       items: {
//         type: "object",
//         required: ["name", "score", "riskLevel", "knowledgeGaps", "trendingMisconception", "learningPath", "strengths"],
//         properties: {
//           name:      { type: "string" },
//           score:     { type: "number" },
//           riskLevel: { type: "string", enum: ["high", "medium", "low"] },
//           knowledgeGaps: {
//             type: "array",
//             items: { type: "string" },
//             description: "Дутуу мэдлэгийн чиглэлүүд",
//           },
//           trendingMisconception: { type: "string", description: "Энэ сурагчийн онцлог логик алдаа" },
//           strengths: {
//             type: "array",
//             items: { type: "string" },
//             description: "Сурагчийн давуу талууд",
//           },
//           learningPath: {
//             type: "array",
//             description: "Персонализ сургалтын зам — 3 алхам",
//             items: {
//               type: "object",
//               required: ["step", "action", "type"],
//               properties: {
//                 step:   { type: "number" },
//                 action: { type: "string", description: "Тодорхой хийх ажил" },
//                 type:   { type: "string", enum: ["practice", "review", "challenge"] },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// };

// // ─── Shared AI Prompt Engine ──────────────────────────────────────────────────
// function buildSystemPrompt(className: string): string {
//   return `Та боловсролын мэргэжлийн дата шинжээч AI багш юм.
  
// Таны зорилт:
// 1. Шалгалтын үр дүнд тулгуурлан ХИЧЭЭЛИЙН АГУУЛГААС (Математик, Хими, Түүх, Уран зохиол г.м) тухайн хичээлийн нэр томьёог ашиглан шинжилгээ хийх
// 2. Сурагч бүрийн "Knowledge Gaps" — мэдлэгийн цоорхойг нарийн тодорхойлох
// 3. "Trending Misconceptions" — нийтлэг логик алдааг илрүүлэх
// 4. Сурагч бүрт "Personalized Learning Path" — хувийн сургалтын замыг гаргах

// Хэл: Монгол хэлээр, мэргэжлийн боловч дулаан хандлагатай.
// Анги: ${className || "Тодорхойгүй анги"}

// ЧУХАЛ: Зөвхөн JSON форматаар, тайлбар, markdown тэмдэглэлгүй хариулна уу.`;
// }

// function buildUserPrompt(
//   students: z.infer<typeof requestSchema>["students"],
//   questions: z.infer<typeof requestSchema>["questions"],
//   stats: z.infer<typeof requestSchema>["stats"],
// ): string {
//   const avgScore = Math.round(students.reduce((s, g) => s + g.score, 0) / students.length);
//   const hardest  = stats.reduce((a, b) => a.wrong > b.wrong ? a : b);
//   const atRisk   = students.filter(s => s.score < 70);

//   return `## Шалгалтын үр дүн

// **Ангийн дундаж:** ${avgScore}%
// **Хамгийн хэцүү асуулт:** ${hardest.q} (${hardest.wrong} сурагч алдсан)
// **Эрсдэлтэй сурагчид:** ${atRisk.map(s => s.name).join(", ") || "Байхгүй"}

// ### Сурагчдын дүн
// ${students.map(s => `- ${s.name}: ${s.score}% (${s.variant} вариант)`).join("\n")}

// ### Шалгалтын асуултууд
// ${questions.map(q => `${q.no}. ${q.text} [Зөв: ${q.correct}]`).join("\n")}

// ### Алдалтын статистик
// ${stats.map(s => `${s.q}: ${s.wrong} сурагч алдсан`).join("\n")}

// Дээрх өгөгдөлд тулгуурлан бүрэн шинжилгээ хийж, заасан JSON schema-аар хариулна уу.`;
// }

// // ─── Route handler ────────────────────────────────────────────────────────────
// export async function POST(req: Request): Promise<Response> {
//   try {
//     const body   = await req.json();
//     const parsed = requestSchema.parse(body);
//     const { className, students, questions, stats } = parsed;

//     const client = new Anthropic();

//     // Use tool_use for structured JSON output with streaming
//     const stream = await client.messages.stream({
//       model:      "claude-opus-4-5",
//       max_tokens: 4096,
//       system:     buildSystemPrompt(className),
//       tools: [
//         {
//           name:        "submit_class_analysis",
//           description: "Submit the complete class analysis report as structured JSON",
//           input_schema: RESPONSE_SCHEMA as Anthropic.Tool["input_schema"],
//         },
//       ],
//       tool_choice: { type: "auto" },
//       messages: [
//         {
//           role:    "user",
//           content: buildUserPrompt(students, questions, stats),
//         },
//       ],
//     });

//     // Stream the raw response and collect tool input
//     const encoder = new TextEncoder();

//     const readable = new ReadableStream({
//       async start(controller) {
//         let toolInput = "";
//         let inToolUse = false;

//         for await (const event of stream) {
//           if (
//             event.type === "content_block_start" &&
//             event.content_block.type === "tool_use" &&
//             event.content_block.name === "submit_class_analysis"
//           ) {
//             inToolUse = true;
//           }

//           if (
//             inToolUse &&
//             event.type === "content_block_delta" &&
//             event.delta.type === "input_json_delta"
//           ) {
//             toolInput += event.delta.partial_json;
//             // Stream partial JSON so the client can show progress
//             controller.enqueue(encoder.encode(event.delta.partial_json));
//           }

//           if (event.type === "content_block_stop" && inToolUse) {
//             inToolUse = false;
//           }

//           if (event.type === "message_stop") {
//             // If no tool was used, fall back to text content
//             if (!toolInput) {
//               const finalMsg = await stream.finalMessage();
//               const textBlock = finalMsg.content.find(b => b.type === "text");
//               if (textBlock && textBlock.type === "text") {
//                 controller.enqueue(encoder.encode(textBlock.text));
//               }
//             }
//             break;
//           }
//         }

//         controller.close();
//       },
//     });

//     return new Response(readable, {
//       headers: {
//         "Content-Type":  "application/json; charset=utf-8",
//         "Cache-Control": "no-cache",
//         "X-Accel-Buffering": "no",
//       },
//     });
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : "Тодорхойгүй алдаа";
//     console.error("[exam-result API]", err);
//     return Response.json({ error: message }, { status: 500 });
//   }
// }
import OpenAI from "openai";
import { z } from "zod";

export const runtime = "edge";

// ─── Request validation ───────────────────────────────────────────────────────
const requestSchema = z.object({
  classId: z.string(),
  className: z.string().default(""),
  students: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      score: z.number(),
      variant: z.string(),
    })
  ),
  questions: z.array(
    z.object({
      no: z.number(),
      text: z.string(),
      score: z.number(),
      options: z.array(z.string()),
      correct: z.string(),
    })
  ),
  stats: z.array(
    z.object({
      q: z.string(),
      wrong: z.number(),
    })
  ),
  // route.ts доторх AI-ийн Schema хэсэг
atRiskStudents: z.array(z.object({
  name: z.string(),
  reason: z.string()
})).default([]), // Энэ мөрийг заавал нэмээрэй
});

// ─── Prompt builders ─────────────────────────────────────────────────────────
function buildSystemPrompt(className: string): string {
  return `Та боловсролын мэргэжлийн дата шинжээч AI багш юм.

Таны зорилт:
1. Хичээлийн агуулгаар анализ хийх
2. Knowledge gaps тодорхойлох
3. Misconceptions илрүүлэх
4. Personalized learning path гаргах

Хэл: Монгол
Анги: ${className || "Тодорхойгүй"}

ЧУХАЛ:
- ЗӨВХӨН JSON буцаа
- Markdown, тайлбар бүү бич
- Strict JSON format баримтал`;
}

function buildUserPrompt(
  students: z.infer<typeof requestSchema>["students"],
  questions: z.infer<typeof requestSchema>["questions"],
  stats: z.infer<typeof requestSchema>["stats"]
): string {
  const avgScore = Math.round(
    students.reduce((s, g) => s + g.score, 0) / students.length
  );
  const hardest = stats.reduce((a, b) =>
    a.wrong > b.wrong ? a : b
  );
  const atRisk = students.filter((s) => s.score < 70);

  return `DATA:

AVG: ${avgScore}
HARDEST: ${hardest.q}
AT_RISK: ${atRisk.map((s) => s.name).join(", ") || "none"}

STUDENTS:
${students.map((s) => `${s.name}:${s.score}`).join("\n")}

QUESTIONS:
${questions.map((q) => `${q.no}. ${q.text}`).join("\n")}

STATS:
${stats.map((s) => `${s.q}:${s.wrong}`).join("\n")}

OUTPUT:
Return full analysis JSON.`;
}

// ─── Route ───────────────────────────────────────────────────────────────────
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);
    const { className, students, questions, stats } = parsed;

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(className),
        },
        {
          role: "user",
          content: buildUserPrompt(students, questions, stats),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // 🧹 clean markdown хамгаалалт
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedJson;

    try {
      parsedJson = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed:", cleaned);
      return Response.json(
        { error: "AI буруу формат буцаалаа", raw },
        { status: 500 }
      );
    }

    return Response.json(parsedJson);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Тодорхойгүй алдаа";
    console.error("[exam-result API]", err);
    return Response.json({ error: message }, { status: 500 });
  }
}