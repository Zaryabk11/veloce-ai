"use client";

import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";


interface ColumnProps {
  id: string;
  title: string;
  briefs: any[];
}

export default function Column({ id, title, briefs }: ColumnProps) {
  // This registers the div as a valid drop zone using the Stage name (id)
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 shrink-0 bg-gray-100 rounded-xl p-4 min-h-[500px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
        <span className="bg-gray-200 text-gray-600 text-xs py-1 px-2 rounded-full font-medium">
          {briefs.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 flex-1 transition-colors rounded-lg ${
          isOver ? "bg-indigo-50/50 outline-dashed outline-2 outline-indigo-300" : ""
        }`}
      >
        {briefs.map((brief) => (
          <Card key={brief.id} brief={brief} />
        ))}
      </div>
    </div>
  );
}