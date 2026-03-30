"use client";

export const runtime = "edge";

import { useParams } from "next/navigation";
import ExamVariationsHub from "../_components/ExamVariationsHub";

export default function MaterialsExamHubPage() {
  const params = useParams();
  const examId = typeof params.examId === "string" ? params.examId : "";
  return <ExamVariationsHub examId={examId} />;
}
