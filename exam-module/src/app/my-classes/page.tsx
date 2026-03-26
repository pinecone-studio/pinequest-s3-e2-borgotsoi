"use client";
import React from "react";
import { useGetMyClassesQuery } from "@/gql/graphql";
import { ClassCard } from "./_components/Class-Card";

export default function MyClassesPage() {
  const { loading, error, data } = useGetMyClassesQuery();

  if (loading) return <p>Уншиж байна...</p>;
  if (error) return <p>Алдаа гарлаа: {error.message}</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Миний ангиуд</h1>
            <p className="text-gray-600 mt-1">
              Шинэ анги үүсгэж, сурагчдаа нэмэн хичээлийн үйл ажиллагааг
            </p>
          </div>
          <button className="bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-800 transition">
            <span className="text-xl">+</span> Анги нэмэх
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.getClasses.map((item: any) => (
            <ClassCard
              key={item.id}
              id={item.id}
              name={item.name}
              roomNumber="204 тоот"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
