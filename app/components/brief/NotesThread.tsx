"use client";

import { useState } from "react";
import { addNoteToBrief } from "@/lib/actions/notes.actions";

export default function NotesThread({ briefId, initialNotes }: { briefId: string, initialNotes: any[] }) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setIsSubmitting(true);
        await addNoteToBrief(briefId, content);
        setContent("");
        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Scrollable messages area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {initialNotes.length === 0 ? (
                    <p className="text-sm text-gray-400 italic text-center mt-4">No notes yet.</p>
                ) : (
                    initialNotes.map((note) => (
                        <div key={note.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm text-gray-800">{note.author.name}</span>
                                <span suppressHydrationWarning className="text-xs text-gray-400">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{note.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-auto">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-20"
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="mt-2 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSubmitting ? "Posting..." : "Post Note"}
                </button>
            </form>
        </div>
    );
}