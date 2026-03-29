import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  examSessions,
  studentSessionStatus,
  students,
} from "@/db/schema";
import { QueryResolvers } from "@/gql/graphql";

export const studentExamSessionStatus: QueryResolvers["studentExamSessionStatus"] =
  async (_, { sessionId, studentId }, context) => {
    const db = getDb(context.db);

    const [sess] = await db
      .select()
      .from(examSessions)
      .where(eq(examSessions.id, sessionId))
      .limit(1);
    if (!sess) return null;

    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);
    if (!student || student.classId !== sess.classId) return null;

    const [row] = await db
      .select({
        isStarted: studentSessionStatus.isStarted,
        isFinished: studentSessionStatus.isFinished,
      })
      .from(studentSessionStatus)
      .where(
        and(
          eq(studentSessionStatus.sessionId, sessionId),
          eq(studentSessionStatus.studentId, studentId),
        ),
      )
      .limit(1);

    if (!row) {
      return { isStarted: false, isFinished: false };
    }

    return {
      isStarted: row.isStarted,
      isFinished: row.isFinished,
    };
  };
