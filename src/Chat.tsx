import { FormEvent, useState } from "react";
import { supabase } from "./supabase";

export function Chat({
  username,
  messages,
  bottomRef,
}: {
  username: string;
  messages: any;
  bottomRef: any;
}) {
  const [message, setMessage] = useState("");

  async function handleNewMessage(e: FormEvent) {
    e.preventDefault();
    await supabase
      .from("messages")
      .insert({ message: message, username: username });
    setMessage("");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div>
      Welcome, {username}
      <ul style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages.map((msg: any) => (
          <li key={msg.id}>
            <span>{msg.username}:</span> {msg.message}
          </li>
        ))}
        <div ref={bottomRef}></div>
      </ul>
      <form onSubmit={handleNewMessage}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Send message</button>
      </form>
    </div>
  );
}
