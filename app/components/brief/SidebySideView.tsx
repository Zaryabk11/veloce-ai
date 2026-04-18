"use client";

import { useState } from "react";
import { updateAIOverride } from "@/lib/actions/brief.actions";

export default function SideBySideView({ brief, analysis }: { brief: any, analysis: any }) {
  const [isOverriding, setIsOverriding] = useState(false);
  const [overrideHours, setOverrideHours] = useState(analysis?.overrideHours || "");
  const [overrideReason, setOverrideReason] = useState(analysis?.overrideReason || "");

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAIOverride(analysis.id, brief.id, overrideHours, overrideReason);
    setIsOverriding(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Original Intake View */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-gray-800">Original Submission</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Description</h4>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap text-sm">{brief.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase">Budget</h4>
              <p className="mt-1 font-semibold text-green-700">{brief.budgetRange}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase">Timeline</h4>
              <p className="mt-1 text-gray-900">{brief.timeline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Analysis View */}
      <div className="bg-indigo-50/50 p-6 rounded-xl shadow-sm border border-indigo-100">
        <div className="flex justify-between items-center border-b border-indigo-200 pb-2 mb-4">
          <h3 className="font-semibold text-lg text-indigo-900">AI Analysis</h3>
          <span className="bg-white text-indigo-700 font-bold px-2 py-1 rounded border border-indigo-200 text-xs">
            Complexity: {analysis?.complexity}/5
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-indigo-800 uppercase tracking-wider">Suggested Stack</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {analysis?.techStack.map((tech: string) => (
                <span key={tech} className="bg-white border border-indigo-200 text-indigo-700 px-2 py-1 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Estimated Effort</h4>
              {!isOverriding && (
                <button onClick={() => setIsOverriding(true)} className="text-xs text-blue-600 hover:underline">
                  Override Estimate
                </button>
              )}
            </div>
            
            {isOverriding ? (
              <form onSubmit={handleOverrideSubmit} className="space-y-3 mt-3 border-t pt-3">
                <input 
                  type="text" 
                  value={overrideHours}
                  onChange={(e) => setOverrideHours(e.target.value)}
                  placeholder="e.g., 60-80" 
                  className="w-full text-sm p-2 border rounded" required 
                />
                <textarea 
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Reason for override..." 
                  className="w-full text-sm p-2 border rounded resize-none" required 
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsOverriding(false)} className="text-xs text-gray-500">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold">Save Override</button>
                </div>
              </form>
            ) : (
              <div>
                <p className={`font-bold text-xl ${analysis?.overrideHours ? 'text-blue-700' : 'text-gray-900'}`}>
                  {analysis?.overrideHours || analysis?.estimatedHours} hours
                </p>
                {analysis?.overrideReason && (
                  <p className="text-xs text-gray-500 mt-1 italic border-l-2 border-blue-300 pl-2">
                    " {analysis.overrideReason} "
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}