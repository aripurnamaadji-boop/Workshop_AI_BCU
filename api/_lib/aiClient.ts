import { firstEnv, AI_KEY_KEYS } from "./env.js";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function callAi(
  messages: ChatMessage[],
  opts: { system?: string; maxTokens?: number } = {},
): Promise<{ text: string; provider: string }> {
  const found = firstEnv(...AI_KEY_KEYS);
  if (!found) throw new Error(`Tidak ada API key AI terkonfigurasi (dicoba: ${AI_KEY_KEYS.join(", ")})`);
  const maxTokens = opts.maxTokens ?? 600;

  if (found.name === "ANTHROPIC_API_KEY") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": found.value, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: maxTokens,
        system: opts.system,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (!r.ok) throw new Error(`Anthropic API HTTP ${r.status}: ${await r.text()}`);
    const data = (await r.json()) as { content: Array<{ text?: string }> };
    return { text: data.content.map((c) => c.text ?? "").join(""), provider: found.name };
  }

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${found.value}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      messages: [...(opts.system ? [{ role: "system" as const, content: opts.system }] : []), ...messages],
    }),
  });
  if (!r.ok) throw new Error(`OpenAI API HTTP ${r.status}: ${await r.text()}`);
  const data = (await r.json()) as { choices: Array<{ message: { content: string } }> };
  return { text: data.choices[0]?.message?.content ?? "", provider: found.name };
}
