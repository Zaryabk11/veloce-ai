"use client";

import { useState, useTransition } from "react";
import { assignBrief } from "@/lib/actions/brief.actions";

interface Props {
  briefId: string;
  currentAssigneeId: string | null;
  teamMembers: { id: string; name: string }[];
}

export default function AssigneeSelect({ briefId, currentAssigneeId, teamMembers }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleAssign = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newAssigneeId = value === "unassigned" ? null : value;

    startTransition(async () => {
      await assignBrief(briefId, newAssigneeId);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-500 font-medium">Assign to:</label>
      <select
        disabled={isPending}
        value={currentAssigneeId || "unassigned"}
        onChange={handleAssign}
        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1 pl-2 pr-8 bg-gray-50 disabled:opacity-50"
      >
        <option value="unassigned">Unassigned</option>
        {teamMembers.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
}