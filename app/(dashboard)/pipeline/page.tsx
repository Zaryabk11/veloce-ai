import Board from "@/app/components/pipeline/Board";
import { getDashboardBriefs } from "@/lib/actions/pipeline.actions";


export default async function PipelinePage() {
  // 1. Fetch data securely on the server
  const briefs = await getDashboardBriefs();

  // 2. Pass it to the interactive client component
  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Project Pipeline</h1>
        <p className="text-gray-500">Drag and drop briefs to update their stage.</p>
      </div>
      
      {/* The Board needs to take up the remaining height to allow dragging */}
      <div className="flex-1 overflow-x-auto pb-4">
        <Board initialBriefs={briefs} />
      </div>
    </div>
  );
}