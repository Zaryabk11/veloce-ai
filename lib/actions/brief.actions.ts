"use server";

import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAIOverride(analysisId: string, briefId: string, hours: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (!reason.trim()) throw new Error("A reason must be provided to override AI estimates.");

  await prisma.$transaction([
    // 1. Update the AI record
    prisma.aIAnalysis.update({
      where: { id: analysisId },
      data: {
        overrideHours: hours,
        overrideReason: reason,
      },
    }),
    // 2. Log that an override happened
    prisma.eventLog.create({
      data: {
        action: "ESTIMATE_OVERRIDDEN",
        details: `Reviewer ${session.user.name} changed estimate to ${hours} hrs`,
        briefId: briefId,
        userId: session.user.id,
      }
    })
  ]);

  revalidatePath(`/brief/${briefId}`);
  return { success: true };
}