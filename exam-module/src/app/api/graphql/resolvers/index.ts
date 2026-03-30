import { deriveExamSessionStatusFromRowTimes } from "@/lib/exam-session-derived-status";
import { examFileDownloadUrl } from "@/lib/exam-file-url";
import type { GraphQLContext } from "../graphql-context";
import * as Mutation from "./mutations";
import * as Query from "./queries";

export const resolvers = {
  Query: {
    ...Query,
  },
  Mutation: {
    ...Mutation,
  },
  Question: {
    attachmentUrl(
      parent: { attachmentKey?: string | null },
      _: unknown,
      context: GraphQLContext,
    ) {
      const k = parent.attachmentKey;
      if (!k) return null;
      return examFileDownloadUrl(context.requestOrigin, k);
    },
  },
  ExamQuestionForTaker: {
    attachmentUrl(
      parent: { attachmentKey?: string | null },
      _: unknown,
      context: GraphQLContext,
    ) {
      const k = parent.attachmentKey;
      if (!k) return null;
      return examFileDownloadUrl(context.requestOrigin, k);
    },
  },
  ExamSession: {
    status(parent: { startTime: string; endTime: string }) {
      return deriveExamSessionStatusFromRowTimes(
        new Date(parent.startTime).getTime(),
        new Date(parent.endTime).getTime(),
      );
    },
  },
};
