import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { intakePayloadSchema } from "@/lib/validations/intake";
import { analyzeProjectBrief } from "@/lib/ai/analyze-brief";
import { ratelimit } from "@/lib/redis"; // Assuming you export your Upstash ratelimit instance

// Helper to verify HMAC signature
function verifySignature(payload: string, signature: string, secret: string) {
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function POST(req: Request) {
    try {

        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const { success } = await ratelimit.limit(ip);
        if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

        // 2. Read raw body for HMAC verification
        const rawBody = await req.text();
        const signature = req.headers.get("x-hmac-signature");
        const secret = process.env.WEBHOOK_SECRET;

        if (!signature || !secret || !verifySignature(rawBody, signature, secret)) {
            return NextResponse.json({ error: "Unauthorized: Invalid Signature" }, { status: 401 });
        }

        // 3. Parse and Validate the payload
        const body = JSON.parse(rawBody);
        const validatedData = intakePayloadSchema.parse(body);

        // 4. Save the Raw Brief first
        const projectBrief = await prisma.projectBrief.create({
            data: {
                ...validatedData,
                source: "webhook",
            },
        });

        // 5. Run the AI Pipeline
        const aiResult = await analyzeProjectBrief(validatedData.description, validatedData.title);

        // 6. Save the linked AI Analysis
        const analysisRecord = await prisma.aIAnalysis.create({
            data: {
                features: aiResult.features,
                category: aiResult.category,
                estimatedHours: aiResult.estimatedHoursRange,
                techStack: aiResult.techStack,
                complexity: aiResult.complexityScore,
                briefId: projectBrief.id,
            },
        });

        // 7. Return success response
        return NextResponse.json({
            success: true,
            briefId: projectBrief.id,
            analysis: analysisRecord
        }, { status: 201 });

    } catch (error: any) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}