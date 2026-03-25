// import { getDb } from "@/db";
// import { examSessions } from "@/db/schema";
// import { MutationResolvers } from "@/gql/graphql";

// export const createExamSession: MutationResolvers["createExamSession"] = async (
//   _,
//   { input },
//   context,
// ) => {
//   const db = getDb(context.db);

//   const result = await db
//     .insert(examSessions)
//     .values({
//       examId: input.examId,
//       classId: input.classId,
//       startTime: new Date(input.startTime),
//       endTime: new Date(input.endTime),
//       status: "scheduled",
//     })
//     .returning();

//   const session = result[0];

//   return session;
// };
