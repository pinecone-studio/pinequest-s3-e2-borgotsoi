import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  exams as examsTable,
  examSessions as examSessionsTable,
  studentSessionStatus as studentSessionStatusTable,
  students as studentsTable,
  users as usersTable,
} from "@/db/schema";
import { sendExamInviteEmails } from "@/lib/send-exam-invite-emails";
import { MutationResolvers } from "@/gql/graphql";
import type { GraphQLContext } from "@/app/api/graphql/graphql-context";

function hasCfWaitUntil(
  ctx: unknown,
): ctx is { cfWaitUntil: (p: Promise<unknown>) => void } {
  return (
    typeof ctx === "object" &&
    ctx !== null &&
    "cfWaitUntil" in ctx &&
    typeof (ctx as { cfWaitUntil: unknown }).cfWaitUntil === "function"
  );
}

const epochToISOString = (value: unknown) => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new Error("Invalid epoch timestamp");
  const ms = n > 1e12 ? n : n * 1000;
  return new Date(ms).toISOString();
};

export const createExamSession: MutationResolvers["createExamSession"] = async (
  _,
  { input },
  context: GraphQLContext,
) => {
  const db = getDb(context.db);

  const [creator] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, input.creatorId))
    .limit(1);
  if (!creator) {
    throw new Error("Creator user not found");
  }

  // #region agent log
  const _startParsed = new Date(input.startTime).getTime();
  const _endParsed = new Date(input.endTime).getTime();
  const _startEpoch = Math.floor(_startParsed / 1000);
  const _endEpoch = Math.floor(_endParsed / 1000);
  fetch('http://127.0.0.1:7898/ingest/430074f6-88ab-43e4-ab27-c5c75c4fee3b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'95efae'},body:JSON.stringify({sessionId:'95efae',location:'examSession.ts:resolver',message:'resolver input & computed epochs',data:{inputStartTime:input.startTime,inputEndTime:input.endTime,inputStartTimeType:typeof input.startTime,inputEndTimeType:typeof input.endTime,startParsedMs:_startParsed,endParsedMs:_endParsed,startEpochSec:_startEpoch,endEpochSec:_endEpoch,startIsNaN:Number.isNaN(_startParsed),endIsNaN:Number.isNaN(_endParsed)},timestamp:Date.now(),hypothesisId:'H2,H3'})}).catch(()=>{});
  // #endregion

  let created;
  try {
    [created] = await db
      .insert(examSessionsTable)
      .values({
        examId: input.examId,
        classId: input.classId,
        creatorId: input.creatorId,
        description: input.description,
        startTime: _startEpoch,
        endTime: _endEpoch,
      })
      .returning();
  } catch (_insertErr) {
    // #region agent log
    fetch('http://127.0.0.1:7898/ingest/430074f6-88ab-43e4-ab27-c5c75c4fee3b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'95efae'},body:JSON.stringify({sessionId:'95efae',location:'examSession.ts:insertCatch',message:'DB insert failed',data:{error:String(_insertErr),errorMessage:(_insertErr as Error)?.message},timestamp:Date.now(),hypothesisId:'H3,H5'})}).catch(()=>{});
    // #endregion
    throw _insertErr;
  }

  if (!created) throw new Error("Exam session not created");

  const [examRow] = await db
    .select()
    .from(examsTable)
    .where(eq(examsTable.id, created.examId))
    .limit(1);

  const classStudents = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.classId, created.classId));

  if (classStudents.length > 0) {
    await db.insert(studentSessionStatusTable).values(
      classStudents.map((s) => ({
        sessionId: created.id,
        studentId: s.id,
        isStarted: false,
        isFinished: false,
      })),
    );
  }

  const recipients = classStudents
    .filter((s) => s.email?.trim())
    .map((s) => ({
      email: s.email!.trim(),
      name: s.name,
      studentId: s.id,
    }));

  const emailPromise = sendExamInviteEmails({
    recipients,
    examId: created.examId,
    examSessionId: created.id,
    examName: examRow?.name ?? "Шалгалт",
    sessionDescription: created.description,
    baseUrl: context.requestOrigin,
  });

  if (hasCfWaitUntil(context)) {
    context.cfWaitUntil(emailPromise);
  } else {
    void emailPromise.catch((err) =>
      console.error("[exam-invite] background send failed:", err),
    );
  }

  return {
    id: created.id,
    examId: created.examId,
    classId: created.classId,
    creatorId: created.creatorId,
    description: created.description,
    startTime: epochToISOString(created.startTime),
    endTime: epochToISOString(created.endTime),
    createdAt: epochToISOString(created.createdAt),
    updatedAt: epochToISOString(created.updatedAt),
  };
};
