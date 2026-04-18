"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getAnalyticsData() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only Admins can view analytics");
  }



  // 1. Briefs by Stage (For Bar Chart)
  const briefsByStage = await prisma.projectBrief.groupBy({
    by: ['stage'],
    _count: { id: true },
  });

  // 2. Average AI Complexity
  const complexityData = await prisma.aIAnalysis.aggregate({
    _avg: { complexity: true },
  });

  // 3. Conversion Rate (Won / Total)
  const totalBriefs = await prisma.projectBrief.count();
  const wonBriefs = await prisma.projectBrief.count({
    where: { stage: "WON" }
  });
  const conversionRate = totalBriefs > 0 ? (wonBriefs / totalBriefs) * 100 : 0;

  // 4. Extract categories for top projects
  const topCategories = await prisma.aIAnalysis.groupBy({
    by: ['category'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5, // Top 5 categories
  });

  // Format the data perfectly for Recharts
  const formattedStageData = briefsByStage.map(item => ({
    name: item.stage.replace("_", " "),
    count: item._count.id
  }));

  return {
    stageData: formattedStageData,
    averageComplexity: complexityData._avg.complexity?.toFixed(1) || 0,
    conversionRate: conversionRate.toFixed(1) + "%",
    topCategories,
    totalBriefs
  };
}