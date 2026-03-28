import { getDb } from "@/db";
import {
  subjects as subjectsTable,
  topics as topicsTable,
} from "@/db/schema";
import { MutationResolvers } from "@/gql/graphql";

const epochToISOString = (value: unknown) => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new Error("Invalid epoch timestamp");
  const ms = n > 1e12 ? n : n * 1000;
  return new Date(ms).toISOString();
};

export const createSubject: MutationResolvers["createSubject"] = async (
  _,
  { name },
  context,
) => {
  const db = getDb(context.db);
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Subject name is required");

  const subject = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(subjectsTable)
      .values({ name: trimmed })
      .returning();

    if (!inserted) throw new Error("Subject not created");

    await tx.insert(topicsTable).values({
      name: "Others",
      grade: 0,
      subjectId: inserted.id,
    });

    return inserted;
  });

  return {
    id: subject.id,
    name: subject.name,
    createdAt: epochToISOString(subject.createdAt),
    updatedAt: epochToISOString(subject.updatedAt),
  };
};
