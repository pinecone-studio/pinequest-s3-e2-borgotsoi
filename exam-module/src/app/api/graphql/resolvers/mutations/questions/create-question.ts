import { getDb } from "@/db";
import { questions as questionsTable } from "@/db/schema";
import { MutationResolvers } from "@/gql/graphql";

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

export const createQuestion: MutationResolvers["createQuestion"] = async (
  _,
  { examId, question, answers, correctIndex, variation, attachmentKey },
  context,
) => {
  const db = getDb(context.db);
  assertAttachmentKeyForExam(examId, attachmentKey ?? null);

  const result = await db
    .insert(questionsTable)
    .values({
      examId,
      question,
      answers,
      correctIndex,
      variation: variation ?? "A",
      attachmentKey: attachmentKey ?? null,
    })
    .returning();

  const created = result[0];
  if (!created) throw new Error("Question not created");
  return {
    id: created.id,
    examId: created.examId,
    question: created.question,
    answers: created.answers,
    correctIndex: created.correctIndex,
    variation: created.variation,
    attachmentKey: created.attachmentKey ?? null,
    createdAt: epochToISOString(created.createdAt),
    updatedAt: epochToISOString(created.updatedAt),
  };
};
