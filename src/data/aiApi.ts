export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Gagal memuat balasan (HTTP ${res.status})`);
  return data.reply as string;
}
