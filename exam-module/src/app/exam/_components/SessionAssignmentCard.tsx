import AssignmentCard from "./Assignment.Card";
import type { ExamSession } from "./exam-types";

type SessionAssignmentCardProps = {
  session: ExamSession;
  type: "upcoming" | "ongoing" | "finished";
};

export default function SessionAssignmentCard({
  session,
  type,
}: SessionAssignmentCardProps) {
  return (
    <AssignmentCard
      title={session.description}
      classInfo={session.class?.name || "Тодорхойгүй"}
      date={new Date(session.startTime).toLocaleDateString()}
      startTime={new Date(session.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
      endTime={new Date(session.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
      type={type}
    />
  );
}
