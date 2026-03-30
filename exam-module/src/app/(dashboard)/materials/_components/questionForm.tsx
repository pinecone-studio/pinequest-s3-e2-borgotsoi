"use client";

import { useEffect, useMemo } from "react";
import { Question } from "./mock";

interface QuestionFormProps {
  question: Question;
  onChange: (updated: Question) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  showVariation?: boolean;
}

const ACCEPT =
  "application/pdf,.pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp";

function isImageLike(nameOrKey: string): boolean {
  return /\.(jpe?g|png|gif|webp)$/i.test(nameOrKey);
}

export default function QuestionForm({
  question,
  onChange,
  onDelete,
  onDuplicate,
  showVariation,
}: QuestionFormProps) {
  const blobPreviewUrl = useMemo(() => {
    if (!question.attachmentFile) return null;
    return URL.createObjectURL(question.attachmentFile);
  }, [question.attachmentFile]);

  useEffect(() => {
    return () => {
      if (blobPreviewUrl) URL.revokeObjectURL(blobPreviewUrl);
    };
  }, [blobPreviewUrl]);

  const serverPreviewUrl = useMemo(() => {
    if (question.attachmentFile || !question.attachmentKey) return null;
    if (typeof window === "undefined") return null;
    return `${window.location.origin}/api/exam-file?k=${encodeURIComponent(question.attachmentKey)}`;
  }, [question.attachmentFile, question.attachmentKey]);

  const displayUrl = blobPreviewUrl ?? serverPreviewUrl;

  const isImagePreview = useMemo(() => {
    if (question.attachmentFile) {
      const t = question.attachmentFile.type.toLowerCase();
      if (t.startsWith("image/")) return true;
      return isImageLike(question.attachmentFile.name);
    }
    if (question.attachmentKey) return isImageLike(question.attachmentKey);
    return false;
  }, [question.attachmentFile, question.attachmentKey]);

  const isPdfPreview = useMemo(() => {
    if (question.attachmentFile) {
      const n = question.attachmentFile.name.toLowerCase();
      const t = question.attachmentFile.type.toLowerCase();
      return t.includes("pdf") || n.endsWith(".pdf");
    }
    if (question.attachmentKey) {
      return question.attachmentKey.toLowerCase().endsWith(".pdf");
    }
    return false;
  }, [question.attachmentFile, question.attachmentKey]);

  const hasAttachment =
    Boolean(question.attachmentFile) || Boolean(question.attachmentKey);

  const fileLabel = question.attachmentFile?.name ?? null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4 gap-2">
        <input
          value={question.text}
          onChange={(e) => onChange({ ...question, text: e.target.value })}
          placeholder="Асуултаа оруулна уу"
          className="flex-1 border-b border-gray-200 outline-none text-sm pb-2 text-gray-900 bg-transparent min-w-0"
        />
        <div className="flex items-center gap-2 shrink-0">
          {showVariation && question.variation ? (
            <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-1">
              {question.variation}
            </span>
          ) : null}
          {onDuplicate ? (
            <button
              type="button"
              onClick={onDuplicate}
              className="text-xs font-medium text-gray-600 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50"
            >
              Хувилбар хуулах
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs text-red-600 border border-red-100 rounded-md px-2 py-1 hover:bg-red-50"
            >
              Устгах
            </button>
          ) : null}
          <span className="text-sm text-gray-500 whitespace-nowrap">Оноо : {question.score}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1.5">
          Файл хавсралт (PDF, зураг) — заавал биш
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept={ACCEPT}
            className="text-xs text-gray-600 file:mr-2 file:rounded-md file:border file:border-gray-200 file:bg-white file:px-2 file:py-1"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              onChange({
                ...question,
                attachmentFile: f,
                attachmentKey: f ? null : question.attachmentKey,
              });
              e.target.value = "";
            }}
          />
          {fileLabel ? (
            <span className="text-xs text-gray-700 truncate max-w-[200px]" title={fileLabel}>
              {fileLabel}
            </span>
          ) : question.attachmentKey && !question.attachmentFile ? (
            <span className="text-xs text-gray-500 truncate max-w-[200px]" title={question.attachmentKey}>
              Хадгалагдсан файл
            </span>
          ) : null}
          {hasAttachment ? (
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...question,
                  attachmentFile: null,
                  attachmentKey: null,
                })
              }
              className="text-xs text-red-600 border border-red-100 rounded-md px-2 py-1 hover:bg-red-50"
            >
              Хавсралт арилгах
            </button>
          ) : null}
        </div>
        {displayUrl && isImagePreview ? (
          <div className="mt-3 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt="Хавсралтын урьдчилан харах"
              className="max-h-48 w-full object-contain"
            />
          </div>
        ) : null}
        {displayUrl && isPdfPreview ? (
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 max-w-md">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="shrink-0 text-red-600">
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-800">PDF</p>
              {fileLabel ? (
                <p className="text-xs text-gray-600 truncate">{fileLabel}</p>
              ) : (
                <a
                  href={displayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Шалгах / шинэ цонхонд нээх
                </a>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <p className="text-xs text-gray-500 mb-2">Зөв хариултыг сонгоно уу</p>
      <div className="flex flex-wrap gap-2 items-start">
        {question.answers.map((ans, i) => (
          <label
            key={i}
            className={`flex items-center gap-2 border rounded-lg px-2 py-2 text-sm text-gray-700 min-w-[120px] cursor-pointer ${
              question.correctIndex === i ? "border-blue-400 bg-blue-50/50" : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name={`correct-${question.id}`}
              checked={question.correctIndex === i}
              onChange={() => onChange({ ...question, correctIndex: i })}
              className="shrink-0"
            />
            <input
              value={ans}
              onChange={(e) => {
                const newAnswers = [...question.answers];
                newAnswers[i] = e.target.value;
                onChange({ ...question, answers: newAnswers });
              }}
              placeholder={`Хариулт ${i + 1}`}
              className="flex-1 min-w-0 border-0 outline-none bg-transparent text-gray-700"
            />
          </label>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...question,
              answers: [...question.answers, ""],
              correctIndex: question.answers.length === 0 ? 0 : question.correctIndex,
            })
          }
          className="border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 flex items-center gap-1 hover:bg-gray-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Хариулт нэмэх
        </button>
      </div>
    </div>
  );
}
