import type { ProctorLogPayload } from "@/hooks/useProctorLogsPusher";
import {
  formatLogTime,
  getEventIcon,
  getEventLabel,
  getStudentShort,
} from "./proctor-log-format";

type ProctorLogsSidebarProps = {
  hasOngoingSessions: boolean;
  logs: ProctorLogPayload[];
};

export default function ProctorLogsSidebar({
  hasOngoingSessions,
  logs,
}: ProctorLogsSidebarProps) {
  return (
    <aside className="rounded-[28px] bg-[#F7F7FB] p-4 xl:sticky xl:top-6 xl:h-[calc(100vh-120px)] xl:overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <span className="h-2.5 w-2.5 rounded-full bg-[#36C38A]" />
          <span className="font-medium">Үлдсэн хугацаа: 25:00</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-xl border border-[#65558F] bg-white px-4 py-2 text-sm font-medium text-[#65558F]"
        >
          Зөрчил
        </button>
        <button
          type="button"
          className="rounded-xl border border-[#E8DEF8] bg-[#FCFBFF] px-4 py-2 text-sm font-medium text-gray-500"
        >
          Ирц
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto xl:max-h-[calc(100%-92px)] pr-1">
        {logs.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-400">
            {!hasOngoingSessions
              ? "Эхэлсэн шалгалт байхгүй."
              : "Хяналтын бүртгэл олдсонгүй."}
          </div>
        ) : (
          logs.map((row) => (
            <div
              key={row.id}
              className="rounded-[22px] border border-[#F2B7BE] bg-[#FFF1F3] px-4 py-4"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-semibold text-gray-900">
                    {getStudentShort(row.studentId)}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {getEventLabel(row.eventType)}
                  </p>
                </div>

                <span className="shrink-0 text-lg text-[#E85D75]">
                  {getEventIcon(row.eventType)}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {formatLogTime(row.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
