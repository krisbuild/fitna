"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useZuri } from "@/lib/data/context";
import { CoachMessage, Profile } from "@/lib/types";
import { IconArrowRight } from "@/components/icons";

const SUGGESTIONS = [
  "Is amala okay for my Season?",
  "What should I eat before a workout?",
  "How do I hit my protein target?",
  "Give me a quick dinner idea",
];

export default function CoachPage() {
  const { adapter } = useZuri();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!adapter) return;
    const [p, m] = await Promise.all([
      adapter.getProfile(),
      adapter.getCoachMessages(),
    ]);
    setProfile(p);
    setMessages(m);
  }, [adapter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  async function send(text: string) {
    if (!adapter || !profile || !text.trim() || sending) return;
    setSending(true);
    setInput("");

    const userMsg = await adapter.addCoachMessage({
      role: "user",
      content: text.trim(),
    });
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          profile,
          message: text.trim(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const coachMsg = await adapter.addCoachMessage({
        role: "coach",
        content: data.reply,
      });
      setMessages((prev) => [...prev, coachMsg]);
    } finally {
      setSending(false);
    }
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-12.5rem)] sm:h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Your Coach
        </h1>
        <p className="text-ink-soft text-sm mt-1">
          Ask anything about food, your Season, or how to stay on track.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs font-medium rounded-full border border-ink/[0.15] px-3 py-2 text-ink-soft hover:bg-black/[0.03]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-forest-600 text-sand-50 px-4 py-2.5 text-sm"
                  : "max-w-[80%] rounded-2xl rounded-bl-sm bg-white shadow-card px-4 py-2.5 text-sm text-ink"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-white shadow-card px-4 py-2.5 text-sm text-ink-muted">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex items-center gap-2 pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          className="input-field"
          placeholder="Ask your coach…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="btn-primary !px-4 shrink-0"
          disabled={sending || !input.trim()}
          aria-label="Send"
        >
          <IconArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
