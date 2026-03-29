import EmptyExamListState from "./EmptyExamListState";
import SessionAssignmentCard from "./SessionAssignmentCard";
import type { ExamSession } from "./exam-types";

type UpcomingExamsTabProps = {
  sessions: ExamSession[];
};

export default function UpcomingExamsTab({ sessions }: UpcomingExamsTabProps) {
  if (sessions.length === 0) {
    return (
      <EmptyExamListState
        title="Төлөвлөгдсөн шалгалт байхгүй"
        description="Одоогоор авах шалгалт харагдахгүй байна."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sessions.map((item) => (
        <SessionAssignmentCard key={item.id} session={item} type="upcoming" />
      ))}
    </div>
  );
}
