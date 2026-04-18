"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Pipeline Board", href: "/pipeline" },
    { name: "Analytics", href: "/analytics" },
  ];

  return (
    <div className="flex flex-col w-64 h-screen bg-gray-900 border-r border-gray-800 text-white">
      <div className="flex items-center h-16 px-6 font-bold text-xl tracking-wide">
        IntakeAI
      </div>
      <div className="flex flex-col flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-indigo-600 text-white font-medium" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}