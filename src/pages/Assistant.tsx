import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import PageHeader from "../components/PageHeader";
import { sendChatMessage, type ChatMessage } from "../data/aiApi";
import styles from "./Assistant.module.css";

const SUGGESTIONS = [
  "Bagaimana progres Killer Program Non-Staff bulan ini?",
  "Program apa yang paling tertinggal dari target?",
  "Ringkas capaian BCU sejauh ini dalam 3 poin",
  "Apa rekomendasi fokus untuk semester 2?",
];

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);
    setError(null);
    try {
      const reply = await sendChatMessage(next);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
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

      <div className={styles.chatCard}>
        <div className={styles.messages} ref={scrollRef}>
          {messages.length === 0 && (
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
  );
}
