import type { ProctorLogPayload } from "@/hooks/useProctorLogsPusher";
import { ProctorVideoGrid } from "./ProctorVideoGrid";
import EmptyExamListState from "./EmptyExamListState";
import ProctorLogsSidebar from "./ProctorLogsSidebar";
import SessionAssignmentCard from "./SessionAssignmentCard";
import type { ExamSession } from "./exam-types";

type LiveMonitoringTabProps = {
  ongoing: ExamSession[];
  effectiveViewerSessionId: string | null;
  onPickSession: (sessionId: string | null) => void;
  viewerSession: ExamSession | null;
  proctorLoading: boolean;
  ongoingLogs: ProctorLogPayload[];
};

export default function LiveMonitoringTab({
  ongoing,
  effectiveViewerSessionId,
  onPickSession,
  viewerSession,
  proctorLoading,
  ongoingLogs,
}: LiveMonitoringTabProps) {
  return (
    <div className="space-y-6">
      {ongoing.length > 0 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[24px] border border-[#E8DEF8] bg-white px-4 py-3">
          <label className="text-sm font-medium text-gray-700">
            Видео хяналтын сесс
            <select
              className="ml-0 mt-2 block w-full rounded-xl border border-gray-200 bg-[#FCFBFF] px-3 py-2 text-sm text-gray-900 sm:ml-3 sm:mt-0 sm:inline-block sm:w-auto"
              value={effectiveViewerSessionId ?? ""}
              onChange={(e) => onPickSession(e.target.value || null)}
            >
              {ongoing.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.description?.trim() || s.id.slice(0, 8)}…
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {effectiveViewerSessionId ? (
          <ProctorVideoGrid
            examSessionId={effectiveViewerSessionId}
            examId={viewerSession?.exam?.id ?? null}
            enabled
          />
        ) : null}
        <ProctorLogsSidebar
          hasOngoingSessions={ongoing.length > 0}
          logs={ongoingLogs}
        />
      </div>
    </div>
  );
}
