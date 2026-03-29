type ExamPageHeaderProps = {
  onCreateExam: () => void;
};

export default function ExamPageHeader({ onCreateExam }: ExamPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Шалгалт</h1>
        <p className="text-gray-600 mt-1">
          Шалгалттай холбоотой мэдээлэл болон шалгалт үүсгэх
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateExam}
        className="bg-[#65558F] hover:bg-[#65558F]/90 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
      >
        + Шалгалт үүсгэх
      </button>
    </div>
  );
}
