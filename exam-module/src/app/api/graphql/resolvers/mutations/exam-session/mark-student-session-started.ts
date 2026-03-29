import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { examSessions, studentSessionStatus, students } from "@/db/schema";
import { MutationResolvers } from "@/gql/graphql";

export const markStudentExamSessionStarted: MutationResolvers["markStudentExamSessionStarted"] =
  async (_, { sessionId, studentId }, context) => {
    const db = getDb(context.db);

    const [sess] = await db
      .select()
      .from(examSessions)
      .where(eq(examSessions.id, sessionId))
      .limit(1);
    if (!sess) {
      throw new Error("Exam session not found");
    }

    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);
    if (!student || student.classId !== sess.classId) {
      throw new Error("Student is not enrolled in this session's class");
    }

    const updated = await db
      .update(studentSessionStatus)
      .set({ isStarted: true })
      .where(
        and(
          eq(studentSessionStatus.sessionId, sessionId),
          eq(studentSessionStatus.studentId, studentId),
        ),
      )
      .returning({ id: studentSessionStatus.id });

    if (updated.length === 0) {
      await db.insert(studentSessionStatus).values({
        sessionId,
        studentId,
        isStarted: true,
        isFinished: false,
      });
    }

    return true;
  };
