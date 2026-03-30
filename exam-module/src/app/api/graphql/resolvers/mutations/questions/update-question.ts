import { getDb } from "@/db";
import { questions as questionsTable } from "@/db/schema";
import { MutationResolvers } from "@/gql/graphql";
import { eq } from "drizzle-orm";

function assertAttachmentKeyForExam(examId: string, key: string | null | undefined) {
  if (key == null || key === "") return;
  const prefix = `exams/${examId}/`;
  if (!key.startsWith(prefix) || key.includes("..")) {
    throw new Error("Invalid attachment key for this exam");
  }
}

const epochToISOString = (value: unknown) => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new Error("Invalid epoch timestamp");
  const ms = n > 1e12 ? n : n * 1000;
  return new Date(ms).toISOString();
};

export const updateQuestion: MutationResolvers["updateQuestion"] = async (
  _,
  { id, examId, question, answers, correctIndex, variation, attachmentKey },
  context,
) => {
  const db = getDb(context.db);

  const existing = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.id, id))
    .limit(1);
  if (!existing[0]) throw new Error("Question not found");

  const patch: {
    examId?: string;
    question?: string;
    answers?: string[];
    correctIndex?: number;
    variation?: string;
    attachmentKey?: string | null;
  } = {};

  if (examId !== undefined && examId !== null) patch.examId = examId;
  if (question !== undefined && question !== null) patch.question = question;
  if (answers !== undefined && answers !== null) patch.answers = answers;
  if (correctIndex !== undefined && correctIndex !== null) {
    patch.correctIndex = correctIndex;
  }
  if (variation !== undefined && variation !== null) patch.variation = variation;
  if (attachmentKey !== undefined) {
    patch.attachmentKey = attachmentKey ?? null;
  }

  const targetExamId = patch.examId ?? existing[0].examId;
  if (attachmentKey !== undefined) {
    assertAttachmentKeyForExam(targetExamId, attachmentKey ?? null);
  }

  if (Object.keys(patch).length > 0) {
    await db.update(questionsTable).set(patch).where(eq(questionsTable.id, id));
  }

  const rows = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.id, id))
    .limit(1);

  if (!rows[0]) throw new Error("Question not found");
  const row = rows[0];

  return {
    id: row.id,
    examId: row.examId,
    question: row.question,
    answers: row.answers,
    correctIndex: row.correctIndex,
    variation: row.variation,
    attachmentKey: row.attachmentKey ?? null,
    createdAt: epochToISOString(row.createdAt),
    updatedAt: epochToISOString(row.updatedAt),
  };
};

