import type { ExamSession } from "./exam-types";

export function partitionExamSessions(sessions: ExamSession[]) {
  const now = new Date();

  const upcoming = sessions.filter((s) => new Date(s.startTime) > now);

  const ongoing = sessions.filter((s) => {
    const start = new Date(s.startTime);
    const end = new Date(s.endTime);
    return start <= now && end >= now;
  });

  const finished = sessions.filter((s) => new Date(s.endTime) < now);

  return { upcoming, ongoing, finished };
}
