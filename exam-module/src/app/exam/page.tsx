"use client";

import { useState, useMemo, useCallback } from "react";
import TabButton from "./_components/TabButton";
import NewAssignmentModal from "./_components/NewAssigmentModal";
import ExamPageHeader from "./_components/ExamPageHeader";
import UpcomingExamsTab from "./_components/UpcomingExamsTab";
import FinishedExamsTab from "./_components/FinishedExamsTab";
import LiveMonitoringTab from "./_components/LiveMonitoringTab";
import { tabs } from "./_components/mock";
import { partitionExamSessions } from "./_components/partitionExamSessions";
import {
  useGetActiveSessionQuery,
  useGetProctorLogsQuery,
} from "@/gql/graphql";
import {
  useProctorLogsPusher,
  type ProctorLogPayload,
} from "@/hooks/useProctorLogsPusher";

export default function ShalgaltPage() {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pusherLogs, setPusherLogs] = useState<ProctorLogPayload[]>([]);
  const [pickedViewerSessionId, setPickedViewerSessionId] = useState<
    string | null
  >(null);

  const { data, loading, error } = useGetActiveSessionQuery();
  const { data: proctorData, loading: proctorLoading } = useGetProctorLogsQuery(
    {
      fetchPolicy: "cache-and-network",
      pollInterval: 5000,
    },
  );

  const sessions = useMemo(
    () => data?.getActiveSessions ?? [],
    [data?.getActiveSessions],
  );

  const filteredAssignments = useMemo(
    () => partitionExamSessions(sessions),
    [sessions],
  );

  const seedLogs = useMemo(() => {
    const rows = proctorData?.proctorLogs ?? [];
    return rows.map((r) => ({
      id: r.id,
      examId: r.examId ?? null,
      studentId: r.studentId ?? "",
      eventType: r.eventType,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }, [proctorData?.proctorLogs]);

  const liveLogs = useMemo(() => {
    const byId = new Map<string, ProctorLogPayload>();
    for (const row of pusherLogs) byId.set(row.id, row);
    for (const row of seedLogs) byId.set(row.id, row);
    return Array.from(byId.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [seedLogs, pusherLogs]);

  const onNewLog = useCallback((log: ProctorLogPayload) => {
    setPusherLogs((prev) => {
      if (prev.some((p) => p.id === log.id)) return prev;
      return [...prev, log];
    });
  }, []);

  useProctorLogsPusher(true, onNewLog);

  const ongoingExamIds = useMemo(() => {
    const ids = filteredAssignments.ongoing
      .map((s) => s.exam?.id)
      .filter((id): id is string => Boolean(id));
    return new Set(ids);
  }, [filteredAssignments.ongoing]);

  const effectiveViewerSessionId = useMemo(() => {
    const ongoing = filteredAssignments.ongoing;
    if (ongoing.length === 0) return null;
    if (
      pickedViewerSessionId &&
      ongoing.some((s) => s.id === pickedViewerSessionId)
    ) {
      return pickedViewerSessionId;
    }
    return ongoing[0]!.id;
  }, [filteredAssignments.ongoing, pickedViewerSessionId]);

  const viewerSession = useMemo(
    () =>
      filteredAssignments.ongoing.find(
        (s) => s.id === effectiveViewerSessionId,
      ) ?? null,
    [filteredAssignments.ongoing, effectiveViewerSessionId],
  );

  const ongoingLogs = useMemo(() => {
    if (liveLogs.length === 0) return [];
    if (ongoingExamIds.size === 0) return liveLogs;
    const scoped = liveLogs.filter(
      (log) => !log.examId || ongoingExamIds.has(log.examId),
    );
    return scoped.length > 0 ? scoped : liveLogs;
  }, [liveLogs, ongoingExamIds]);

  if (loading)
    return <div className="p-8 text-center text-gray-500">Уншиж байна...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Алдаа: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <ExamPageHeader onCreateExam={() => setIsModalOpen(true)} />

        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab, index) => (
            <TabButton
              key={index}
              label={tab}
              isActive={activeTab === index}
              onClick={() => setActiveTab(index as 0 | 1 | 2)}
            />
          ))}
        </div>

        <div className="space-y-8">
          {activeTab === 0 && (
            <UpcomingExamsTab sessions={filteredAssignments.upcoming} />
          )}
          {activeTab === 1 && (
            <FinishedExamsTab sessions={filteredAssignments.finished} />
          )}
          {activeTab === 2 && (
            <LiveMonitoringTab
              ongoing={filteredAssignments.ongoing}
              effectiveViewerSessionId={effectiveViewerSessionId}
              onPickSession={setPickedViewerSessionId}
              viewerSession={viewerSession}
              proctorLoading={proctorLoading}
              ongoingLogs={ongoingLogs}
            />
          )}
        </div>
      </div>

      <NewAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
