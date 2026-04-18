import DetailHeader from "@/app/components/brief/DetailHeader";
import EventTimeline from "@/app/components/brief/EventTimeline";
import NotesThread from "@/app/components/brief/NotesThread";
import SideBySideView from "@/app/components/brief/SidebySideView";
import {prisma} from "@/lib/prisma";
import { notFound } from "next/navigation";


export default async function BriefDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // 1. Fetch EVERYTHING related to this brief in one query
  const brief = await prisma.projectBrief.findUnique({
    where: { id },
    include: {
      analysis: true,
      assignee: { select: { name: true, email: true } },
      notes: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "asc" }, // Oldest notes at the top
      },
      eventLogs: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" }, // Newest events at the top
      },
    },
  });

  if (!brief) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
      <DetailHeader brief={brief} />

      {/* Grid Layout: Main content on left (2/3), Sidebar on right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: The Data */}
        <div className="lg:col-span-2 space-y-6">
          <SideBySideView brief={brief} analysis={brief.analysis} />
        </div>

        {/* Right Column: Communication & History */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[400px] flex flex-col">
            <h3 className="font-semibold border-b pb-2 mb-4">Internal Notes</h3>
            <NotesThread briefId={brief.id} initialNotes={brief.notes} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold border-b pb-2 mb-4">Activity Timeline</h3>
            <EventTimeline logs={brief.eventLogs} />
          </div>
        </div>
      </div>
    </div>
  );
}