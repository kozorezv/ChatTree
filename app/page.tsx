"use client";
import { useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  parentId: number | null;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage(parentId: number | null = null) {
    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      parentId,
    };
    const updated = [...messages, newMessage];
    setMessages(updated);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: updated.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    const data = await res.json();

    setMessages([
      ...updated,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
        parentId: newMessage.id,
      },
    ]);
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ChatTree 🌳</h1>

      <div className="space-y-4 mb-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "text-right"
                : "text-left"
            }
          >
            <div
              className={
                m.role === "user"
                  ? "inline-block bg-gray-900 text-white px-3 py-2 rounded-xl"
                  : "inline-block"
              }
            >
              <p className="whitespace-pre-wrap">{m.content}</p>

              {/* Only show branch button on assistant messages */}
              {m.role === "assistant" && (
                <button
                  onClick={() => sendMessage(m.id)}
                  className="text-xs text-gray-500 ml-2 hover:underline"
                >
                  branch here
                </button>
              )}
            </div>
          </div>
        ))}
      </div>


      <div className="flex gap-2">
        <input
          className="border flex-grow p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={() => sendMessage()}
          className="bg-gray-900 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </main>
  );
}
