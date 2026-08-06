import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";
import PageHeader from "../components/PageHeader";
import {
  createConversation,
  deleteConversation,
  getConversationMessages,
  listConversations,
  sendChatMessage,
  type ChatMessage,
  type Conversation,
} from "../data/aiApi";
import styles from "./Assistant.module.css";

const SUGGESTIONS = [
  "Bagaimana progres Killer Program Non-Staff bulan ini?",
  "Program apa yang paling tertinggal dari target?",
  "Ringkas capaian BCU sejauh ini dalam 3 poin",
  "Apa rekomendasi fokus untuk semester 2?",
];

export default function Assistant() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setLoadingList(true);
      try {
        const list = await listConversations();
        setConversations(list);
        if (list.length > 0) await selectConversation(list[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function selectConversation(id: number) {
    setActiveId(id);
    setLoadingMessages(true);
    setError(null);
    try {
      const msgs = await getConversationMessages(id);
      setMessages(msgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleNewConversation() {
    setError(null);
    try {
      const conv = await createConversation();
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleDelete(id: number, e: MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Hapus percakapan ini?")) return;
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setError(null);
    setInput("");

    try {
      let conversationId = activeId;
      if (!conversationId) {
        const conv = await createConversation();
        setConversations((prev) => [conv, ...prev]);
        setActiveId(conv.id);
        conversationId = conv.id;
      }

      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      const { reply, title } = await sendChatMessage(conversationId, trimmed);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setConversations((prev) =>
        [...prev]
          .map((c) => (c.id === conversationId ? { ...c, title, updatedAt: new Date().toISOString() } : c))
          .sort((a, b) => (a.id === conversationId ? -1 : b.id === conversationId ? 1 : 0)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Assistant AI"
        subtitle="Tanya apa saja soal data program BCU, atau pertanyaan umum seputar people development"
        pills={["Ditenagai AI"]}
      />

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <button className={styles.newBtn} onClick={handleNewConversation}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Percakapan baru
          </button>
          <div className={styles.convList}>
            {loadingList ? (
              <div className={styles.convEmpty}>Memuat...</div>
            ) : conversations.length === 0 ? (
              <div className={styles.convEmpty}>Belum ada percakapan.</div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  className={`${styles.convItem} ${c.id === activeId ? styles.convActive : ""}`}
                  onClick={() => selectConversation(c.id)}
                >
                  <span className={styles.convTitle}>{c.title}</span>
                  <button className={styles.convDelete} onClick={(e) => handleDelete(c.id, e)} aria-label="Hapus percakapan">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5 5 13a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-8.5" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.chatCard}>
          <div className={styles.messages} ref={scrollRef}>
            {!loadingMessages && messages.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyTitle}>Mulai percakapan</div>
                <div className={styles.emptyBody}>
                  Assistant AI bisa menjawab pertanyaan tentang data monitoring program BCU yang tersimpan di dashboard, atau
                  pertanyaan umum lain seputar training &amp; people development.
                </div>
                <div className={styles.suggestions}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className={styles.suggestionChip} onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`${styles.bubbleRow} ${m.role === "user" ? styles.fromUser : styles.fromAssistant}`}>
                <div className={styles.bubble}>{m.content}</div>
              </div>
            ))}

            {sending && (
              <div className={`${styles.bubbleRow} ${styles.fromAssistant}`}>
                <div className={`${styles.bubble} ${styles.typing}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
          </div>

          {error && <div className={styles.errorBar}>{error}</div>}

          <form className={styles.inputBar} onSubmit={handleSubmit}>
            <textarea
              className={styles.textarea}
              placeholder="Tulis pertanyaan kamu... (Enter untuk kirim, Shift+Enter baris baru)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className={styles.sendBtn} type="submit" disabled={sending || !input.trim()}>
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
