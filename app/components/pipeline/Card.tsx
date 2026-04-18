"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

export default function Card({ brief }: { brief: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: brief.id,
  });

  // This handles the visual movement of the card while you drag it
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          {brief.analysis?.category || "Uncategorized"}
        </span>
        <span className="text-xs font-medium text-gray-500">
          {brief.analysis?.complexity ? `Score: ${brief.analysis.complexity}` : ""}
        </span>
      </div>
      
      {/* Clicking the title navigates to the detail page (we haven't built this page yet!) */}
      <Link href={`/brief/${brief.id}`} className="block mb-2 hover:underline pointer-events-auto">
        <h4 className="font-semibold text-gray-900 text-sm leading-snug">
          {brief.title}
        </h4>
      </Link>
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-500">{brief.budgetRange}</span>
        {brief.assignee ? (
          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold" title={brief.assignee.name}>
            {brief.assignee.name.charAt(0)}
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
}