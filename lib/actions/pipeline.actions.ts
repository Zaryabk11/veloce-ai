"use server";

import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Stage } from "@prisma/client";

// 1. Fetch briefs based on User Role
export async function getDashboardBriefs() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const briefs = await prisma.projectBrief.findMany({
    where: session.user.role === "ADMIN" 
      ? {} // Admins see all
      : { assigneeId: session.user.id }, // Reviewers see only assigned
    include: {
      analysis: true, // Pull in the AI data (category, etc.) for the card
      assignee: { select: { name: true } } // Who is working on it
    },
    orderBy: { createdAt: "desc" },
  });

  return briefs;
}

// 2. Update Stage & Log the Event
export async function updateBriefStage(briefId: string, newStage: Stage) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  // Fetch current brief to check if the stage actually changed
  const currentBrief = await prisma.projectBrief.findUnique({
    where: { id: briefId },
    select: { stage: true }
  });

  if (!currentBrief || currentBrief.stage === newStage) return { success: true };

  // Update the brief and create the log entry in a single transaction
  await prisma.$transaction([
    prisma.projectBrief.update({
      where: { id: briefId },
      data: { stage: newStage },
    }),
    prisma.eventLog.create({
      data: {
        action: "STAGE_CHANGED",
        details: `Moved from ${currentBrief.stage} to ${newStage}`,
        briefId: briefId,
        userId: session.user.id,
      }
    })
  ]);

  // Tell Next.js to purge its cache so the UI updates immediately
  revalidatePath("/pipeline");
  revalidatePath(`/brief/${briefId}`);
  
  return { success: true };
}