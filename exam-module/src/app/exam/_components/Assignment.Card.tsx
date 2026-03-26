interface AssignmentCardProps {
  title: string;
  classInfo: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "upcoming" | "ongoing" | "finished";
}

export default function AssignmentCard({
  title,
  classInfo,
  date,
  startTime,
  endTime,
}: AssignmentCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{classInfo}</p>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Шалгалт авах огноо: {date}</p>
        <p>
          Эхлэх цаг: {startTime} Дуусах цаг: {endTime}
        </p>
      </div>
    </div>
  );
}

// interface AssignmentCardProps {
//   description: string;
//   classData?: {
//     name: string;
//   } | null;
//   startTime: string;
//   endTime: string;x
//   type: "upcoming" | "ongoing" | "finished";
// }

// export default function AssignmentCard({
//   description,
//   classData,
//   startTime,
//   endTime,
// }: AssignmentCardProps) {
//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return "";
//     return new Date(dateStr).toLocaleDateString("mn-MN");
//   };

//   const formatTime = (dateStr: string) => {
//     if (!dateStr) return "";
//     return new Date(dateStr).toLocaleTimeString("mn-MN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
//       <h3 className="font-semibold text-lg text-gray-900 mb-2">
//         {description || "Гарчиггүй"}
//       </h3>

//       <p className="text-gray-600 text-sm mb-4">
//         {classData?.name || "Анги сонгогдоогүй"}
//       </p>

//       <div className="text-xs text-gray-500 space-y-1">
//         <p>Шалгалт авах огноо: {formatDate(startTime)}</p>
//         <p>
//           Эхлэх цаг: {formatTime(startTime)} Дуусах цаг: {formatTime(endTime)}
//         </p>
//       </div>
//     </div>
//   );
// }
