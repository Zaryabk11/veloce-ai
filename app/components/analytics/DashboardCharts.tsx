"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardCharts({ data }: { data: any }) {
  // If a reviewer tries to access this page, data might be null due to the action's security check
  if (!data) return <p className="p-8 text-red-500">You do not have permission to view analytics.</p>;

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Total Pipeline Briefs" value={data.totalBriefs} />
        <KPICard title="Win/Conversion Rate" value={data.conversionRate} />
        <KPICard title="Avg AI Complexity" value={`${data.averageComplexity} / 5`} />
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Top Categories</h3>
          <div className="mt-2 text-sm text-gray-900">
            {data.topCategories.map((cat: any) => (
              <div key={cat.category} className="flex justify-between">
                <span>{cat.category || "Uncategorized"}</span>
                <span className="font-bold">{cat._count.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[400px]">
        <h3 className="font-semibold text-gray-800 mb-6">Pipeline by Stage</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.stageData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// Simple helper component for the top row cards
function KPICard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}