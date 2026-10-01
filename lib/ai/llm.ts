type LlmRequest = { system: string; user: string; maxTokens: number; json?: boolean };

export function isAiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY);
}

async function callGemini(req: LlmRequest): Promise<string> {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY as string },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: req.system }] },
      contents: [{ role: "user", parts: [{ text: req.user }] }],
      generationConfig: {
        maxOutputTokens: req.maxTokens * 4,
        temperature: 0.2,
        ...(req.json ? { responseMimeType: "application/json" } : {})
      }
    })
  });
  if (!res.ok) throw new Error(`GEMINI_${res.status}`);
  const data = await res.json();
  const parts: Array<{ text?: string }> = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((part) => part.text ?? "").join("").trim();
}

async function callClaude(req: LlmRequest): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    max_tokens: req.maxTokens,
    system: req.system,
    messages: [{ role: "user", content: req.user }]
  });
  return response.content.map((part) => (part.type === "text" ? part.text : "")).join("").trim();
}

export async function generateText(req: LlmRequest): Promise<string> {
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callGemini(req);
    } catch (error) {
      console.error("GEMINI_FAILED", error instanceof Error ? error.message : error);
      if (!process.env.ANTHROPIC_API_KEY) throw error;
    }
  }
  if (process.env.ANTHROPIC_API_KEY) return callClaude(req);
  throw new Error("AI_NOT_CONFIGURED");
}