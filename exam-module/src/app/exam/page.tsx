"use client";

import { useState } from "react";
import TabButton from "./_components/TabButton";
import AssignmentCard from "./_components/Assignment.Card";
import ProgressTable from "./_components/Progresstable";
import NewAssignmentModal from "./_components/NewAssigmentModal";

import {
  tabs,
  mockAssignments as initialAssignments,
  Assignment,
  AssignmentState,
} from "./_components/mock";

export default function ShalgaltPage() {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [assignments, setAssignments] =
    useState<AssignmentState>(initialAssignments);

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments((prev: AssignmentState) => ({
      ...prev,
      upcoming: [newAssignment, ...prev.upcoming],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Шалгалт</h1>
            <p className="text-gray-600 mt-1">
              Шалгалттай холбоотой мэдээлэл болон шалгалт үүсгэх
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#65558F] hover:bg-[#65558F] text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
          >
            + Шалгалт үүсгэх
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab, index) => (
            <TabButton
              key={index}
              label={tab}
              isActive={activeTab === index}
              onClick={() => setActiveTab(index as 0 | 1 | 2)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Upcoming */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.upcoming.map((item) => (
                <AssignmentCard
                  key={item.id}
                  title={item.title}
                  classInfo={item.classInfo}
                  date={item.date}
                  startTime={item.startTime}
                  endTime={item.endTime}
                  type="upcoming"
                />
              ))}
            </div>
          )}

          {/* Ongoing */}
          {activeTab === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.ongoing.map((item) => (
                  <AssignmentCard
                    key={item.id}
                    title={item.title}
                    classInfo={item.classInfo}
                    date={item.date}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    type="ongoing"
                  />
                ))}
              </div>
              <ProgressTable />
            </>
          )}

          {/* Finished */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.finished.map((item) => (
                <AssignmentCard
                  key={item.id}
                  title={item.title}
                  classInfo={item.classInfo}
                  date={item.date}
                  startTime={item.startTime}
                  endTime={item.endTime}
                  type="finished"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <NewAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
