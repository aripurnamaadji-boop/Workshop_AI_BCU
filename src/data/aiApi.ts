export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Conversation = { id: number; title: string; updatedAt: string };

async function json<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request gagal (HTTP ${res.status})`);
  return data;
}

export async function listConversations(): Promise<Conversation[]> {
  const res = await fetch("/api/ai/conversations");
  const data = await json<{ conversations: Conversation[] }>(res);
  return data.conversations;
}

export async function createConversation(): Promise<Conversation> {
  const res = await fetch("/api/ai/conversations", { method: "POST" });
  const data = await json<{ conversation: Conversation }>(res);
  return data.conversation;
}

export async function deleteConversation(id: number): Promise<void> {
  const res = await fetch(`/api/ai/conversations/${id}`, { method: "DELETE" });
  await json(res);
}

export async function getConversationMessages(id: number): Promise<ChatMessage[]> {
  const res = await fetch(`/api/ai/conversations/${id}`);
  const data = await json<{ messages: ChatMessage[] }>(res);
  return data.messages;
}

export async function sendChatMessage(conversationId: number, message: string): Promise<{ reply: string; title: string }> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ conversationId, message }),
  });
  return json(res);
}
