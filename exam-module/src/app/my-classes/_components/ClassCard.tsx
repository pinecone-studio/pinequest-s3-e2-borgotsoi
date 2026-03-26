import { ExternalLink, Folder, MoreVertical } from "lucide-react";
import Link from "next/link";

interface ClassCardProps {
  name: string;
  id: string;
  index: number;
}

export const ClassCard = ({ name, id, index }: ClassCardProps) => {
  const colors = [
    "from-[#c9d1fb] to-[#7f88f5]",
    "from-[#b6c2f3] to-[#7888e2]",
    "from-[#b2dbe2] to-[#6297a7]",
    "from-[#d8d1fb] to-[#9c89f5]",
  ];

  return (
    <Link href={`/classes-detail/${id}`}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 cursor-pointer">
        <div
          className={`h-32 bg-gradient-to-br ${colors[index % colors.length]} p-5 rounded-b-2xl flex flex-col justify-between relative`}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-[#1a054d] font-bold text-lg">{name}</h3>
            {index === 0 && (
              <span className="text-xs font-semibold text-[#1a054d]/60">
                Математик
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 p-4 opacity-20">
            <div className="w-24 h-24 bg-white/30 rounded-full -mr-10 -mb-10 blur-xl"></div>
          </div>
        </div>
        <div className="p-3 flex justify-end gap-4 text-gray-400">
          <ExternalLink size={18} className="hover:text-blue-600" />
          <Folder size={18} className="hover:text-blue-600" />
          <MoreVertical size={18} className="hover:text-blue-600" />
        </div>
      </div>
    </Link>
  );
};
