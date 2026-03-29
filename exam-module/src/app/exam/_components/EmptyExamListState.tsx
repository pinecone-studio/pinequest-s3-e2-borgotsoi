type EmptyExamListStateProps = {
  title: string;
  description: string;
};

export default function EmptyExamListState({
  title,
  description,
}: EmptyExamListStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
      <p className="font-medium text-gray-700">{title}</p>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}
