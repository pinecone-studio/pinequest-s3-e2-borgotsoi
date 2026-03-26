interface ClassCardProps {
  id: string;
  name: string;
  roomNumber: string;
}

export const ClassCard = ({ name, roomNumber }: ClassCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="h-24 bg-gradient-to-r from-purple-100 to-indigo-200 p-4">
        <h3 className="text-indigo-900 font-semibold">
          {name} - {roomNumber}
        </h3>
        <p className="text-xs text-indigo-700 mt-1">Математик</p>
      </div>

      <div className="p-3 flex justify-end gap-4 text-gray-400">
        <button className="hover:text-indigo-600 transition">↗</button>
        <button className="hover:text-indigo-600 transition">📁</button>
        <button className="hover:text-indigo-600 transition">⋮</button>
      </div>
    </div>
  );
};
