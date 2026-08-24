import { NextRequest, NextResponse } from "next/server";
import { buildCoachSystemPrompt, getFallbackCoachReply } from "@/lib/ai/coach";
import { Profile } from "@/lib/types";

interface ChatTurn {
  role: "user" | "coach";
  content: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const profile: Profile | undefined = body?.profile;
  const message: string = String(body?.message ?? "");
  const history: ChatTurn[] = Array.isArray(body?.history) ? body.history : [];

  if (!profile || !message.trim()) {
    return NextResponse.json({ error: "Missing profile or message" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const reply = await callClaude(apiKey, profile, history, message);
      if (reply) return NextResponse.json({ reply, source: "ai" });
    } catch {
      // fall through to canned reply
    }
  }

  return NextResponse.json({
    reply: getFallbackCoachReply(profile, message),
    source: "rule",
  });
}

async function callClaude(
  apiKey: string,
  profile: Profile,
  history: ChatTurn[],
  message: string
): Promise<string | null> {
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  const messages = [
    ...history.map((turn) => ({
      role: turn.role === "coach" ? ("assistant" as const) : ("user" as const),
      content: turn.content,
    })),
    { role: "user" as const, content: message },
  ];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 512,
      system: buildCoachSystemPrompt(profile),
      messages,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  return typeof text === "string" ? text : null;
}
