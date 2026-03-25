"use client";

import { useState } from "react";
import { Assignment } from "../_components/mock";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddAssignment: (newAssignment: Assignment) => void;
}

type FormData = {
  title: string;
  classInfo: string;
  secondTitle: string;
  date: string;
  startTime: string;
  endTime: string;
};

export default function NewAssignmentModal({
  isOpen,
  onClose,
  onAddAssignment,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    secondTitle:"",
    classInfo: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.classInfo || !formData.date) {
      alert("Та бүх заавал бөглөх талбарыг бөглөнө үү!");
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now(),
      title: formData.title,
      secondTitle: formData.secondTitle,
      classInfo: formData.classInfo,
      date: formData.date,
      startTime: formData.startTime || "09:00",
      endTime: formData.endTime || "10:00",
    };

    onAddAssignment(newAssignment);
    onClose();

    // reset form
    setFormData({
      title: "",
      secondTitle:"",
      classInfo: "",
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Шалгалт үүсгэх
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600  text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Шалгалтын материал
            </label>
            <input
              type="text"
              placeholder="Шалгалтын материалаа сонгоно уу"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Шалгалтын нэр
            </label>
            <input
              type="text"
              placeholder="Шалгалтын нэрээ оруулна уу"
              value={formData.secondTitle}
              onChange={(e) =>
                setFormData({ ...formData, secondTitle: e.target.value })
              }
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Огноо
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Эхлэх цаг
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Дуусах цаг
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
              <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Анги сонгох
            </label>
            <input
              type="text"
              placeholder="Ангиа сонгоно уу"
              value={formData.classInfo}
              onChange={(e) =>
                setFormData({ ...formData, classInfo: e.target.value })
              }
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition"
            >
              Буцах
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#DFDFDF] text-[#4C4C4C] rounded-2xl font-medium hover:bg-purple-700 transition"
            >
              Илгээх
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}