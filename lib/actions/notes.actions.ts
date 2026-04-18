"use server";

import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addNoteToBrief(briefId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (!content.trim()) throw new Error("Note cannot be empty");

  const note = await prisma.note.create({
    data: {
      content,
      briefId,
      authorId: session.user.id, // Securely pulled from the session, not the client!
    },
    // Return the author's name so we can render it in the UI immediately
    include: {
      author: { select: { name: true } } 
    }
  });

  // Revalidate the specific brief's detail page
  revalidatePath(`/brief/${briefId}`);

  return note;
}