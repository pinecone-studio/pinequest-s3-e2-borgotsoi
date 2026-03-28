"use client";

import { UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const pageTitles: Record<string, string> = {
    "/": "Нүүр",
    "/schedule": "Хуваарь",
    "/my-classes": "Анги",
    "/exam": "Шалгалт",
    "/materials": "Шалгалтын материал",
    "/settings": "Тохиргоо",
  };

  const title = mounted
    ? pageTitles[pathname] || "Ажилтны портал"
    : "Ажилтны портал";

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm font-medium text-slate-600 flex">
          <SidebarTrigger />
          <p className="mt-1">{title}</p>
        </div>
        <UserCircle2 />
      </div>
    </header>
  );
}
