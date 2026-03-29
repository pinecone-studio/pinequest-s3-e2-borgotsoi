import type { GetActiveSessionQuery } from "@/gql/graphql";

export type ExamSession = GetActiveSessionQuery["getActiveSessions"][number];
