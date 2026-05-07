"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import PusherClient from "pusher-js";
import { updateBriefStage } from "@/lib/actions/pipeline.actions";
import Column from "./Column";

const STAGES = ["NEW", "UNDER_REVIEW", "PROPOSAL_SENT", "WON", "ARCHIVED"] as const;

export default function Board({ initialBriefs }: { initialBriefs: any[] }) {
  const [briefs, setBriefs] = useState(initialBriefs);
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // 1. Keep local state in sync with server data
  // When router.refresh() runs, initialBriefs will change. This updates the UI.
  useEffect(() => {
    setBriefs(initialBriefs);
  }, [initialBriefs]);

  // 2. Setup Pusher and Hydration check
  useEffect(() => {
    setIsMounted(true);

    // Initialize the Pusher client
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the channel we broadcasted to in our Server Action
    const channel = pusher.subscribe("pipeline");

    // When the event fires, tell Next.js to quietly re-fetch the Server Component
    channel.bind("brief-updated", () => {
      router.refresh();
    });

    // Clean up the connection if the user navigates away from the page
    return () => {
      pusher.unsubscribe("pipeline");
    };
  }, [router]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const briefId = active.id as string;
    const newStage = over.id as string;

    const activeBrief = briefs.find((b) => b.id === briefId);
    if (!activeBrief || activeBrief.stage === newStage) return;

    // Optimistic UI Update: Move the card instantly for a snappy feel
    setBriefs((prev) =>
      prev.map((brief) =>
        brief.id === briefId ? { ...brief, stage: newStage } : brief
      )
    );

    // Background Database Update
    startTransition(async () => {
      try {
        await updateBriefStage(briefId, newStage as any);
      } catch (error) {
        console.error("Failed to update stage", error);
        // If the server fails, revert back to the true server state
        setBriefs(initialBriefs);
      }
    });
  };

  // Prevent DndKit from crashing during Server-Side Rendering
  if (!isMounted) return null;

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-full items-start">
        {STAGES.map((stage) => {
          const columnBriefs = briefs.filter((b) => b.stage === stage);
          return (
            <Column
              key={stage}
              id={stage}
              title={stage.replace("_", " ")}
              briefs={columnBriefs}
            />
          );
        })}
      </div>
    </DndContext>
  );
}