"use client";

import { useEffect, useState, useTransition } from "react";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { updateBriefStage } from "@/lib/actions/pipeline.actions";
import Column from "./Column";


// Must exactly match your Prisma schema Stage enum
const STAGES = ["NEW", "UNDER_REVIEW", "PROPOSAL_SENT", "WON", "ARCHIVED"] as const;

export default function Board({ initialBriefs }: { initialBriefs: any[] }) {
  const [briefs, setBriefs] = useState(initialBriefs);
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null; // Or return a loading spinner

  // The function that runs the moment you drop a card
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // If dropped outside a column, do nothing
    if (!over) return;

    const briefId = active.id as string;
    const newStage = over.id as string;

    // Find the brief we are dragging
    const activeBrief = briefs.find((b) => b.id === briefId);
    if (!activeBrief || activeBrief.stage === newStage) return;

    // 1. Optimistic UI Update: Instantly snap the card to the new column
    setBriefs((prev) =>
      prev.map((brief) =>
        brief.id === briefId ? { ...brief, stage: newStage } : brief
      )
    );

    // 2. Background Server Update: Save to database without blocking the UI
    startTransition(async () => {
      try {
        await updateBriefStage(briefId, newStage as any);
      } catch (error) {
        // If the server fails, revert the card back to its original column
        console.error("Failed to update stage", error);
        setBriefs(initialBriefs);
      }
    });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-full items-start">
        {STAGES.map((stage) => {
          // Filter briefs that belong to this specific column
          const columnBriefs = briefs.filter((b) => b.stage === stage);

          return (
            <Column
              key={stage}
              id={stage}
              title={stage.replace("_", " ")} // "UNDER_REVIEW" -> "UNDER REVIEW"
              briefs={columnBriefs}
            />
          );
        })}
      </div>
    </DndContext>
  );
}