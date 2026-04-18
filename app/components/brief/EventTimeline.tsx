export default function EventTimeline({ logs }: { logs: any[] }) {
    if (logs.length === 0) {
        return <p className="text-sm text-gray-400 italic">No activity recorded.</p>;
    }

    return (
        <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
            {logs.map((log) => (
                <div key={log.id} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5" />
                        <div className="w-px h-full bg-gray-200 my-1" />
                    </div>
                    <div className="pb-4">
                        <p className="font-medium text-gray-900">
                            {log.action.replace("_", " ")}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">{log.details}</p>
                        <p suppressHydrationWarning className="text-gray-400 text-xs mt-1">
                            {new Date(log.createdAt).toLocaleString()}
                            {log.user && ` • by ${log.user.name}`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}