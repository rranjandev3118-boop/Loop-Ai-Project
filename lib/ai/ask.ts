import { generateText, isAiConfigured } from "@/lib/ai/llm";

const NO_EVIDENCE = "Not enough evidence in the available feedback.";

export async function answerFromRetrievedFeedback(question: string, context: string): Promise<string> {
  if (!isAiConfigured()) return NO_EVIDENCE;
  try {
    return await generateText({
      system: "You answer questions using only the supplied feedback records. Never infer facts that are not supported by those records. If the answer is not supported, say exactly: Not enough evidence in the available feedback. Cite supporting record numbers like [1] and [2].",
      user: `Question: ${question}\n\nRetrieved feedback records:\n${context}`,
      maxTokens: 700
    });
  } catch (error) {
    console.error("ASK_AI_FAILED", error instanceof Error ? error.message : error);
    return context.trim()
      ? `The AI summary is unavailable right now. Most relevant feedback records:\n\n${context.slice(0, 1500)}`
      : NO_EVIDENCE;
  }
}