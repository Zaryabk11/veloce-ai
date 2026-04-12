import { generateObject } from "ai";
import { google } from "@ai-sdk/google"; // Or your preferred provider
import { aiAnalysisSchema } from "../validations/intake";

export async function analyzeProjectBrief(description: string, title: string) {
  const { object } = await generateObject({
    model: google("gemini-2.5-flash"), 
    schema: aiAnalysisSchema,
    prompt: `
      Analyze the following project brief.
      Title: ${title}
      Description: ${description}
      
      Extract the requirements, classify the project, estimate hours, suggest a tech stack, and assign a complexity score (1-5).
    `,
  });

  return object;
}