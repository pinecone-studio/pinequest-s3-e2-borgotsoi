import EmptyExamListState from "./EmptyExamListState";
import ProgressTable from "./Progresstable";
import SessionAssignmentCard from "./SessionAssignmentCard";
import type { ExamSession } from "./exam-types";

type FinishedExamsTabProps = {
  sessions: ExamSession[];
};

export default function FinishedExamsTab({ sessions }: FinishedExamsTabProps) {
  if (sessions.length === 0) {
    return (
      <EmptyExamListState
        title="Дууссан шалгалтын түүх байхгүй"
        description="Session-ууд дууссан шалгалтад тохирохгүй байна."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((item) => (
          <SessionAssignmentCard key={item.id} session={item} type="finished" />
        ))}
      </div>
      <ProgressTable />
    </>
  );
}
