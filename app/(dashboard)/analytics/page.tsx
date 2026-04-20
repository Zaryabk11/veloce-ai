import DashboardCharts from "@/app/components/analytics/DashboardCharts";
import { getAnalyticsData } from "@/lib/actions/analytics.actions";


export default async function AnalyticsPage() {
  let data = null;
  let error = null;

  try {
    // Only an Admin can successfully fetch this data
    data = await getAnalyticsData();
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500">High-level view of your intake pipeline and AI estimates.</p>
      </div>

      {error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-800 border border-red-200">
          {error}
        </div>
      ) : (
        <DashboardCharts data={data} />
      )}
    </div>
  );
}