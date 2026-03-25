import { mockStudents } from "./mock";

export default function ProgressTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-lg">Явцын шалгалт</h3>
          <p className="text-sm text-gray-500">12В анги 210 тоот</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Нийт сурагчид</p>
          <p className="font-medium">210 тоот</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 font-medium text-gray-600">Сурагчдын нэрс</th>
              <th className="text-right py-3 font-medium text-gray-600">Авсан дүн</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockStudents.map((student, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-4 text-gray-900 font-medium">{student.name}</td>
                <td className="py-4 text-right font-semibold text-gray-700">
                  {student.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}