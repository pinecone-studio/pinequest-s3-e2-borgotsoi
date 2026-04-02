"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetClassesQuery,
  useGetExamssQueryQuery,
  useGetExamCreateOptionsQuery,
  useTopicsBySubjectQuery,
} from "@/gql/graphql";
import ExamVariationsHub from "./_components/ExamVariationsHub";
import { formatExamCardDate, gradientForExamId } from "./_components/mock";
import MaterialCard from "./_components/Materialcard";
import AddCard from "./_components/Addcard";
import { ChevronDown, Search } from "lucide-react";

export default function MaterialsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"mine" | "bank">("mine");
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const [materialSearch, setMaterialSearch] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [classId, setClassId] = useState("");

  const { data: classesData } = useGetClassesQuery();

  const { data, loading, error } = useGetExamssQueryQuery({
    fetchPolicy: "cache-and-network",
  });

  const { data: optionsData } = useGetExamCreateOptionsQuery({
    fetchPolicy: "cache-and-network",
  });

  const { data: topicsData } = useTopicsBySubjectQuery({
    variables: { subjectId },
    skip: !subjectId,
  });

  useGetClassesQuery();

  const showFilters = activeTab === "bank";

  const filteredMaterials = useMemo(() => {
    const exams = data?.exams ?? [];
    const q = materialSearch.trim().toLowerCase();

    return exams
      .filter((exam) => {
        if (activeTab === "bank" && !exam.isPublic) return false;

        if (q && !exam.name.toLowerCase().includes(q)) return false;

        if (showFilters) {
          if (subjectId && exam.subjectId !== subjectId) return false;
          if (topicId && exam.topicId !== topicId) return false;
        }

        return true;
      })
      .map((exam) => ({
        id: exam.id,
        title: exam.name,
        date: formatExamCardDate(exam.createdAt),
        gradient: gradientForExamId(exam.id),
      }));
  }, [data?.exams, activeTab, materialSearch, subjectId, topicId, showFilters]);

  return (
    <div className="bg-white p-6 px-10 min-h-screen">
      {!selectedExamId && (
        <div className="mb-8">
          <h1 className=" text-[24px] font-bold text-gray-900">
            Шалгалтын материал
          </h1>

          <p className="mb-10 text-[#666666] text-[14px]  font-medium ">
            Шалгалтын материал үүсгэн ангиудад хуваарилах
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between  pb-4">
            <div className="flex gap-8">
              <button
                onClick={() => {
                  setActiveTab("mine");
                  setSelectedExamId(null);
                }}
                className={`pb-2  text-[14px] font-medium = relative ${
                  activeTab === "mine"
                    ? "text-[#5136a8] border-b border-[#21005D]"
                    : "text-gray-400"
                }`}
              >
                Миний материалууд
              </button>

              <button
                onClick={() => {
                  setActiveTab("bank");
                  setSelectedExamId(null);
                }}
                className={`pb-2 text-[14px] font-medium relative ${
                  activeTab === "bank"
                    ? "text-[#5136a8] border-b border-[#21005D]"
                    : "text-gray-400"
                }`}
              >
                Шалгалтын сан
              </button>
            </div>

            <div className="relative w-[285px] overflow-hidden overflow-x-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="search"
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                placeholder="Материалын нэрээр хайх..."
                className="w-full rounded-full border border-gray-200 bg-gray-50/50 py-2.5 pl-11 pr-4 text-sm outline-none focus:bg-white"
              />
            </div>
          </div>

          {showFilters && (
            <div className="flex items-center gap-4 mt-10">
              <div className="relative w-[222px]">
                <select
                  value={subjectId}
                  onChange={(e) => {
                    setSubjectId(e.target.value);
                    setTopicId("");
                  }}
                  className="w-full h-[36px] px-4 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                >
                  <option value="">Хичээл сонгох</option>
                  {optionsData?.subjects?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative w-[222px]">
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  disabled={!subjectId}
                  className="w-full h-[36px] px-4 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {subjectId ? "Бүх сэдэв" : "Эхлээд хичээл сонгоно"}
                  </option>
                  {topicsData?.topics?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      )}

      {loading && !data ? (
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div>
          {selectedExamId ? (
            <ExamVariationsHub
              examId={selectedExamId}
              materialsTab={activeTab}
              onMaterialsTabChange={setActiveTab}
            />
          ) : (
            <div className="grid grid-cols-5 gap-5">
              {activeTab === "mine" && !materialSearch && !subjectId && (
                <AddCard onClick={() => router.push("/materials/create")} />
              )}

              {filteredMaterials.map((m) => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  onClick={() => {
                    if (activeTab === "bank") {
                      router.push(`/materials/${m.id}/preview`);
                    } else {
                      setSelectedExamId(m.id);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
