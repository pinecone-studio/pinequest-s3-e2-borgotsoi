import { students } from "@/db/schema";
import { getDb } from "@/db";
import { MutationResolvers } from "@/gql/graphql";

export const createStudent: MutationResolvers["createStudent"] = async (
  _,
  { name, classId, email },
  context,
) => {
  const db = getDb(context.db);

  const [newStudent] = await db
    .insert(students)
    .values({
      name,
      classId,
      email: email ?? "",
    })
    .returning();

  return {
    ...newStudent,
    classId: newStudent.classId!,
  };
};
