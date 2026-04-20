import AssigneeSelect from "./AssigneeSelect";

export default function DetailHeader({ brief, isAdmin, teamMembers }: { brief: any, isAdmin: boolean, teamMembers: { id: string; name: string }[] }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{brief.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Source: <span className="font-medium text-gray-700">{brief.source}</span></span>
                    <span suppressHydrationWarning>Submitted: {new Date(brief.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-sm">
                    {brief.stage.replace("_", " ")}
                </span>
                {isAdmin ? (
                    <AssigneeSelect
                        briefId={brief.id}
                        currentAssigneeId={brief.assigneeId}
                        teamMembers={teamMembers}
                    />
                ) : (
                    <span className="text-sm text-gray-500">
                        Assigned to: <span className="font-medium text-gray-900">{brief.assignee?.name || "Unassigned"}</span>
                    </span>
                )}
            </div>
        </div>
    );
}