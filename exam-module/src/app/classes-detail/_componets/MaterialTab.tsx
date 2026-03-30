"use client";

import { useState, useRef } from "react";
import {
  Plus, FileText, Download, Eye, MoreVertical, TrendingUp,
  Brain, Sparkles, AlertTriangle, ChevronRight, Target,
  BookOpen, Lightbulb, User, RefreshCw, ArrowRight, Zap,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MaterialCardProps { title: string; date: string; type: string; index: number }

interface StudentDiagnostic {
  name: string;
  score: number;
  riskLevel: "high" | "medium" | "low";
  knowledgeGaps: string[];
  trendingMisconception: string;
  learningPath: {
    step: number;
    action: string;
    type: "practice" | "review" | "challenge";
  }[];
  strengths: string[];
}

interface AIReport {
  summary: string;
  weakTopic: string;
  weakTopicReason: string;
  atRiskStudents: { name: string; reason: string }[];
  recommendation: string;
  positiveNote: string;
  trendingMisconception: string;
  classHealthScore: number;
  nextLessonPlan: string;
  studentDiagnostics: StudentDiagnostic[];
}

interface MaterialTabProps {
  classId: string;
  className?: string;
  students?: { id: string; name: string }[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_MATERIALS = [
  { id: "1", title: "Логарифм функц - Теорем ба тодорхойлолт", date: "2024.03.20", type: "PDF" },
  { id: "2", title: "Уламжлал бодох үндсэн аргачлал",          date: "2024.03.18", type: "Doc" },
  { id: "3", title: "Бие даалтын удирдамж #4",                  date: "2024.03.15", type: "PDF" },
  { id: "4", title: "Тригонометрийн томъёонууд",                date: "2024.03.12", type: "Image" },
  { id: "5", title: "Интеграл бодох хичээл",                    date: "2024.03.10", type: "PDF" },
  { id: "6", title: "Шалгалтын бэлтгэл материал",               date: "2024.03.05", type: "PDF" },
];

const MOCK_QUESTION_STATS = [
  { q: "А-1", wrong: 8 },  { q: "А-2", wrong: 15 },
  { q: "А-3", wrong: 3 },  { q: "А-4", wrong: 4 },
  { q: "А-5", wrong: 11 }, { q: "А-6", wrong: 6 },
  { q: "А-7", wrong: 5 },  { q: "А-8", wrong: 20 },
  { q: "А-9", wrong: 12 }, { q: "А-10", wrong: 11 },
  { q: "А-11", wrong: 11 },{ q: "А-12", wrong: 13 },
  { q: "А-13", wrong: 4 }, { q: "А-14", wrong: 13 },
  { q: "А-15", wrong: 11 },
];

const MOCK_GRADES = [
  { id: "1", name: "А.Анужин",   score: 95, variant: "А" },
  { id: "2", name: "Г.Анужин",   score: 80, variant: "Б" },
  { id: "3", name: "Батбаяр",    score: 73, variant: "А" },
  { id: "4", name: "Барсболд",   score: 81, variant: "Б" },
  { id: "5", name: "Д.Анужин",   score: 67, variant: "А" },
];

const MOCK_QUESTIONS = [
  { no: 1, text: "21*10⁷*(12*10⁻⁸) Утгыг ол.", score: 2,
    options: ["А. 14.2", "Б. 15", "В. 25.2", "Г. 14"], correct: "В" },
  { no: 2, text: "Квадрат функцийн графикийг сонгоорой.", score: 1,
    options: ["А. Гипербол", "Б. Парабол", "В. Шулуун", "Г. Тойрог"], correct: "Б" },
  { no: 3, text: "log₂(8) = ?", score: 1,
    options: ["А. 2", "Б. 4", "В. 3", "Г. 8"], correct: "В" },
];

const COLORS = [
  "from-[#b1a5e3] to-[#7165a3]",
  "from-[#919ceb] to-[#5161d6]",
  "from-[#a3d9e2] to-[#68a9b5]",
  "from-[#d1c9f0] to-[#a195d4]",
];

const hardestQ = MOCK_QUESTION_STATS.reduce((a, b) => a.wrong > b.wrong ? a : b);
const classAvg = Math.round(MOCK_GRADES.reduce((s, g) => s + g.score, 0) / MOCK_GRADES.length);

// ─── Helper Components ────────────────────────────────────────────────────────
const MaterialCard = ({ title, date, type, index }: MaterialCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md group transition-all">
    <div className={`h-32 bg-gradient-to-br ${COLORS[index % COLORS.length]} p-4 flex flex-col justify-between relative rounded-b-2xl`}>
      <div className="flex justify-between items-start">
        <div className="bg-white/30 p-1.5 rounded-lg backdrop-blur-sm text-white">
          <FileText size={16} />
        </div>
        <span className="text-[10px] font-bold bg-black/10 px-2 py-0.5 rounded-full text-white uppercase tracking-wider">
          {type}
        </span>
      </div>
      <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 pr-4">{title}</h4>
    </div>
    <div className="p-3">
      <p className="text-[11px] text-gray-400 mb-2">{date}</p>
      <div className="flex justify-end gap-3 text-gray-400">
        <Eye size={15} className="cursor-pointer hover:text-[#5136a8]" />
        <Download size={15} className="cursor-pointer hover:text-[#5136a8]" />
        <MoreVertical size={15} className="cursor-pointer hover:text-[#5136a8]" />
      </div>
    </div>
  </div>
);

// Streaming text renderer
const StreamingText = ({ text, isStreaming }: { text: string; isStreaming: boolean }) => (
  <span>
    {text}
    {isStreaming && (
      <span className="inline-block w-0.5 h-4 bg-[#5136a8] ml-0.5 align-middle animate-pulse" />
    )}
  </span>
);

// Risk badge
const RiskBadge = ({ level }: { level: "high" | "medium" | "low" }) => {
  const map = {
    high:   { label: "Өндөр эрсдэл", cls: "bg-red-50 text-red-600 border-red-200" },
    medium: { label: "Дунд эрсдэл",  cls: "bg-amber-50 text-amber-600 border-amber-200" },
    low:    { label: "Тогтвортой",   cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  };
  const { label, cls } = map[level];
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>
  );
};

// Learning path step
const LearningStep = ({ step }: { step: { step: number; action: string; type: "practice" | "review" | "challenge" } }) => {
  const icons = { practice: <Target size={12} />, review: <BookOpen size={12} />, challenge: <Zap size={12} /> };
  const colors = {
    practice:  "bg-blue-50 text-blue-600 border-blue-100",
    review:    "bg-purple-50 text-purple-600 border-purple-100",
    challenge: "bg-orange-50 text-orange-600 border-orange-100",
  };
  return (
    <div className="flex items-start gap-2.5 py-2">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#5136a8]/10 text-[#5136a8] flex items-center justify-center text-[10px] font-black mt-0.5">
        {step.step}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-700 leading-relaxed">{step.action}</p>
        <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colors[step.type]}`}>
          {icons[step.type]}
          {step.type === "practice" ? "Дасгал" : step.type === "review" ? "Давталт" : "Сорил"}
        </span>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const MaterialTab = ({ classId, className = "", students = [] }: MaterialTabProps) => {
  const [report, setReport]               = useState<AIReport | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [aiLoading, setAiLoading]         = useState(false);
  const [error, setError]                 = useState("");
  const [selectedStudent, setSelectedStudent] = useState(MOCK_GRADES[0]);
  const [activeView, setActiveView]       = useState<"overview" | "diagnostics" | "paths">("overview");
  const [selectedDiag, setSelectedDiag]   = useState<StudentDiagnostic | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Streaming AI call ──────────────────────────────────────────────────────
  const handleAIAnalyze = async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setAiLoading(true);
    setReport(null);
    setStreamingText("");
    setError("");
    setActiveView("overview");

    try {
      const res = await fetch("/api/exam-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          classId,
          className,
          students: MOCK_GRADES,
          questions: MOCK_QUESTIONS,
          stats: MOCK_QUESTION_STATS,
        }),
      });

      if (!res.ok) {
        const e = await res.json() as { error?: string };
        throw new Error(e.error ?? "Сервер алдаа");
      }

      if (!res.body) return;

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        raw += chunk;
        setStreamingText(raw);
      }

      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed  = JSON.parse(cleaned) as AIReport;
      setReport(parsed);
      setStreamingText("");
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") {
        setError(e instanceof Error ? e.message : "Алдаа гарлаа");
      }
    } finally {
      setAiLoading(false);
    }
  };

  const healthColor = !report ? "" :
    report.classHealthScore >= 75 ? "text-emerald-600" :
    report.classHealthScore >= 55 ? "text-amber-600" : "text-red-600";

  return (
    <div className="space-y-8">

      {/* ── Chart Section ──────────────────────────────────────────────────── */}
      <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <TrendingUp size={16} />
            <span>Шугаман график</span>
          </div>
          <select className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
            <option>Явцын шалгалт</option>
            <option>Улирлын шалгалт</option>
          </select>
        </div>

        <div className="flex gap-6 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-bold text-gray-800">
              {className || "12А"} ангийн явцын шалгалтын анализ
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Сурагчдын хамгийн их алдаа гаргасан асуултуудын үзүүлэлт
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-purple-50 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Хамгийн хэцүү</p>
              <p className="text-2xl font-black text-[#5136a8]">{hardestQ.q}</p>
            </div>
            <div className="rounded-xl px-5 py-3 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Дундаж дүн</p>
              <p className="text-2xl font-black text-gray-800">{classAvg}%</p>
            </div>
            {report && (
              <div className="rounded-xl px-5 py-3 text-center border border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 mb-1">Эрүүл мэндийн үзүүлэлт</p>
                <p className={`text-2xl font-black ${healthColor}`}>{report.classHealthScore}%</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_QUESTION_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="q" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                formatter={(v) => [v != null ? `${v} сурагч` : "N/A", "Алдсан"]}
              />
              <ReferenceLine y={hardestQ.wrong} stroke="#e2d9f3" strokeDasharray="4 4" />
              <Line
                type="monotone" dataKey="wrong" stroke="#7165a3" strokeWidth={2.5}
                dot={{ fill: "#7165a3", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#5136a8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Students + Questions ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade list */}
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
          <div className="mb-4">
            <h4 className="font-bold text-gray-800">{className || "12А"} анги</h4>
            <p className="text-xs text-gray-400">Явцын шалгалт</p>
          </div>
          <div className="flex justify-between text-xs text-gray-400 px-2 mb-2">
            <span>Сурагчдын нэрс</span>
            <span>Авсан дүн</span>
          </div>
          <div className="space-y-1">
            {MOCK_GRADES.map((g) => {
              const diag = report?.studentDiagnostics?.find(d => d.name === g.name);
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedStudent(g);
                    if (diag) { setSelectedDiag(diag); setActiveView("diagnostics"); }
                  }}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm transition-all ${
                    selectedStudent.id === g.id
                      ? "border border-[#5136a8] text-[#5136a8] font-semibold bg-purple-50"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{g.name}</span>
                    {diag && <RiskBadge level={diag.riskLevel} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{g.score}%</span>
                    {diag && <ChevronRight size={14} className="text-gray-300" />}
                  </div>
                </button>
              );
            })}
          </div>
          {report && (
            <p className="text-[11px] text-gray-400 text-center mt-3">
              ↑ Нэр дараад нарийвчилсан оношилгоо харах
            </p>
          )}
        </div>

        {/* Question detail */}
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-800">{selectedStudent.name}</h4>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>{selectedStudent.variant} Вариант</span>
              <span>Дүн: <strong className="text-gray-800">{selectedStudent.score}%</strong></span>
            </div>
          </div>
          <div className="space-y-5">
            {MOCK_QUESTIONS.map((q) => (
              <div key={q.no} className="border-b border-gray-50 pb-4 last:border-0">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm font-medium text-gray-800">{q.no}. {q.text}</p>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{q.score} оноо</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {q.options.map((opt) => {
                    const letter    = opt.charAt(0);
                    const isCorrect = letter === q.correct;
                    return (
                      <div
                        key={opt}
                        className={`px-2 py-1.5 rounded-lg text-xs text-center font-medium ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-gray-50 text-gray-500 border border-gray-100"
                        }`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI Analysis Header ──────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-800">AI Шинжилгээ</h3>
            {report && (
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                {(["overview", "diagnostics", "paths"] as const).map((v) => {
                  const labels = { overview: "Тойм", diagnostics: "Оношилгоо", paths: "Сурах зам" };
                  return (
                    <button
                      key={v}
                      onClick={() => setActiveView(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeView === v
                          ? "bg-white text-[#5136a8] shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {labels[v]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {aiLoading && (
              <button
                onClick={() => abortRef.current?.abort()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition"
              >
                <RefreshCw size={14} className="animate-spin" /> Зогсоох
              </button>
            )}
            <button
              onClick={handleAIAnalyze}
              disabled={aiLoading}
              className="flex items-center gap-2 bg-[#5136a8] hover:bg-[#3e2880] text-white px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 shadow-sm shadow-purple-200"
            >
              <Sparkles size={15} />
              {aiLoading ? "Шинжилж байна..." : "AI шинжилгээ ✨"}
            </button>
          </div>
        </div>

        {/* Streaming indicator */}
        {aiLoading && streamingText && (
          <div className="mb-4 bg-purple-50 border border-purple-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-[#5136a8] animate-pulse" />
              <span className="text-xs font-semibold text-[#5136a8]">AI боловсруулж байна...</span>
            </div>
            <p className="text-xs text-gray-500 font-mono leading-relaxed line-clamp-3">
              <StreamingText text={streamingText} isStreaming={true} />
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {aiLoading && !streamingText && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            <div className="lg:col-span-3 h-28 bg-slate-100 rounded-2xl" />
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {report && activeView === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary banner */}
            <div className="lg:col-span-3 bg-gradient-to-br from-[#5136a8] to-[#3e2880] text-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-6 bg-purple-300 rounded-full" />
                <p className="text-xs font-bold uppercase tracking-widest text-purple-200">AI Шинжээчийн тайлан</p>
              </div>
              <p className="text-base font-light leading-relaxed text-purple-50 mb-4">{report.summary}</p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb size={12} /> Маргаашийн хичээлийн төлөвлөгөө
                </p>
                <p className="text-sm text-purple-100">{report.nextLessonPlan}</p>
              </div>
            </div>

            {/* Weak topic */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3 flex items-center gap-1.5">
                <AlertTriangle size={12} /> Аюултай сэдэв
              </p>
              <p className="text-2xl font-black text-red-600 mb-2">{report.weakTopic}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{report.weakTopicReason}</p>
            </div>

            {/* Recommendation */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 flex items-center gap-1.5">
                <Target size={12} /> Зөвлөмж
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{report.recommendation}</p>
            </div>

            {/* Positive */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3">🌟 Сайн тал</p>
              <p className="text-sm text-slate-700 leading-relaxed">{report.positiveNote}</p>
            </div>

            {/* Misconception */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-1.5">
                <Brain size={12} /> Нийтлэг логик алдаа
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">{report.trendingMisconception}</p>
            </div>

            {/* At-risk students */}
  {/* 516-р мөр орчимд дараах байдлаар өөрчил: */}

{/* report болон atRiskStudents байгаа эсэхийг заавал шалгана */}
{report && report.atRiskStudents && report.atRiskStudents.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    {report.atRiskStudents.map((s, index) => (
      <div key={`${s.name}-${index}`} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-3 flex items-center gap-1.5">
          <User size={12} /> Тусламж хэрэгтэй
        </p>
        <p className="text-xl font-black text-slate-800 mb-2">{s.name}</p>
        <p className="text-sm text-slate-500 leading-relaxed italic border-l-2 border-orange-100 pl-3">
          {`"${s.reason}"`}
        </p>
        
        {/* Багшид зориулсан үйлдлийн товчлуур */}
        <button className="mt-4 w-full py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2">
          <Zap size={14} /> Батаатгах дасгал илгээх
        </button>
      </div>
    ))}
  </div>
) : null}
          </div>
        )}

        {/* ── DIAGNOSTICS TAB ── */}
        {report && activeView === "diagnostics" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.studentDiagnostics?.map((diag) => (
                <div
                  key={diag.name}
                  onClick={() => { setSelectedDiag(diag); }}
                  className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    selectedDiag?.name === diag.name
                      ? "border-[#5136a8] ring-2 ring-[#5136a8]/10"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{diag.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{diag.score}% оноо</p>
                    </div>
                    <RiskBadge level={diag.riskLevel} />
                  </div>

                  {/* Score bar */}
                  <div className="mb-4">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          diag.score >= 75 ? "bg-emerald-400" :
                          diag.score >= 55 ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ width: `${diag.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Knowledge gaps */}
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Мэдлэгийн цоорхой</p>
                    <div className="flex flex-wrap gap-1">
                      {diag.knowledgeGaps.slice(0, 2).map((g) => (
                        <span key={g} className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">
                          {g}
                        </span>
                      ))}
                      {diag.knowledgeGaps.length > 2 && (
                        <span className="text-[10px] text-gray-400">+{diag.knowledgeGaps.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2">{diag.trendingMisconception}</p>

                  <div className="flex items-center gap-1 mt-3 text-[#5136a8] text-xs font-semibold">
                    <span>Сурах зам харах</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected student detail */}
            {selectedDiag && (
              <div className="mt-6 bg-white border border-[#5136a8]/20 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{selectedDiag.name}</h4>
                    <p className="text-sm text-gray-400">Нарийвчилсан оношилгоо</p>
                  </div>
                  <RiskBadge level={selectedDiag.riskLevel} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Gaps */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Мэдлэгийн цоорхой</p>
                    <div className="space-y-1.5">
                      {selectedDiag.knowledgeGaps.map((g) => (
                        <div key={g} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Давуу тал</p>
                    <div className="space-y-1.5">
                      {selectedDiag.strengths.map((s) => (
                        <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Misconception */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Нийтлэг алдааны логик</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedDiag.trendingMisconception}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LEARNING PATHS TAB ── */}
        {report && activeView === "paths" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
              <Zap size={18} className="text-[#5136a8]" />
              <p className="text-sm text-gray-700">
                AI сурагч бүрийн алдааны хэлбэрт тулгуурлан хувийн сургалтын замыг тодорхойлсон.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.studentDiagnostics?.map((diag) => (
                <div key={diag.name} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#5136a8]/10 flex items-center justify-center text-[#5136a8] font-black text-sm">
                        {diag.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{diag.name}</p>
                        <p className="text-[10px] text-gray-400">{diag.score}% · {diag.learningPath.length} алхам</p>
                      </div>
                    </div>
                    <RiskBadge level={diag.riskLevel} />
                  </div>
                  <div className="divide-y divide-gray-50">
                    {diag.learningPath.map((step) => (
                      <LearningStep key={step.step} step={step} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Materials Grid ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Материалын сан</h3>
          <button className="flex items-center gap-1.5 text-sm text-[#5136a8] font-semibold hover:underline">
            <Plus size={14} /> Материал нэмэх
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOCK_MATERIALS.map((m, i) => (
            <MaterialCard key={m.id} title={m.title} date={m.date} type={m.type} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
