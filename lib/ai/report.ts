import { z } from "zod";
import { generateText, isAiConfigured } from "@/lib/ai/llm";

const reportSchema = z.object({
  executiveSummary: z.string().min(1).max(2000),
  topThemes: z.array(z.object({ name: z.string(), count: z.number().int().nonnegative(), insight: z.string() })).max(5),
  quotes: z.array(z.string()).max(5),
  recommendedActions: z.array(z.string()).max(5)
});

export type ReportContent = z.infer<typeof reportSchema>;

export async function generateReportContent(input: {
  periodLabel: string;
  feedbackCount: number;
  topThemes: Array<{ name: string; count: number }>;
  sentimentShift: string;
  quotes: string[];
}): Promise<ReportContent> {
  const fallback: ReportContent = {
    executiveSummary: `${input.periodLabel} contained ${input.feedbackCount} feedback item${input.feedbackCount === 1 ? "" : "s"} with ${input.sentimentShift}.`,
    topThemes: input.topThemes.map((theme) => ({ ...theme, insight: `Review the ${theme.name} feedback trend.` })),
    quotes: input.quotes,
    recommendedActions: input.topThemes.slice(0, 3).map((theme) => `Review customer feedback related to ${theme.name}.`)
  };
  if (!isAiConfigured()) return fallback;

  try {
    const text = await generateText({
      system: "You write a Voice-of-Customer report strictly from supplied aggregates and quotes. Return only valid JSON with executiveSummary, topThemes (name, count, insight), quotes, and recommendedActions. Do not invent metrics, customers, or quotes.",
      user: JSON.stringify(input),
      maxTokens: 1000,
      json: true
    });
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) throw new Error("REPORT_INVALID");
    return reportSchema.parse(JSON.parse(json));
  } catch (error) {
    console.error("REPORT_AI_FAILED", error instanceof Error ? error.message : error);
    return fallback;
  }
}