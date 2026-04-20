"use server";

import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getTeamMembers() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return [];

  return await prisma.user.findMany({
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" }
  });
}