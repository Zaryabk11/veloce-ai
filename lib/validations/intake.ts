import { z } from "zod";

// 1. Validation for the incoming payload (Form or Webhook)
export const intakePayloadSchema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().min(10, "Description must be detailed"),
    budgetRange: z.string(),
    timeline: z.string(),
    contactInfo: z.string().email("Valid email required"),
});

export type IntakePayload = z.infer<typeof intakePayloadSchema>;

// 2. Validation for the AI structured output
export const aiAnalysisSchema = z.object({
    features: z.array(z.string()).describe("A structured list of core features extracted from the brief"),
    category: z.enum(["Web App", "Mobile", "AI/ML", "Automation", "Integration", "Other"]),
    estimatedHoursRange: z.string().describe("Estimated effort range in hours, e.g., '20-40' or '100+'"),
    techStack: z.array(z.string()).describe("Suggested technologies, e.g., ['Next.js', 'PostgreSQL']"),
    complexityScore: z.number().min(1).max(5).describe("Complexity score from 1 (simple) to 5 (enterprise/highly complex)"),
});