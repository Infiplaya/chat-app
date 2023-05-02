import { Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useMessages } from "./hooks";
import { supabase } from "./supabase";

export function Chat({
  username,
  userId,
  session,
}: {
  username: string;
  userId: string;
  session: Session;
}) {
  const [message, setMessage] = useState("");

  const messages = useMessages();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session, messages]);

  async function handleNewMessage(e: FormEvent) {
    e.preventDefault();
    if (!message) return;
    await supabase
      .from("messages")
      .insert({ message: message, username: username, user_id: userId });
    setMessage("");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div>
      <ul className="max-h-96 px-3 py-6 rounded-md overflow-y-auto text-gray-200 bg-gray-800 border-2 border-gray-700">
        {messages.map((msg) => (
          <li key={msg.id}>
            <span className="font-semibold text-violet-400">
              {msg.username}:
            </span>{" "}
            {msg.message}
          </li>
        ))}
        <div ref={bottomRef}></div>
      </ul>
      <form
        onSubmit={handleNewMessage}
        className="flex flex-col mt-4 items-start"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message"
          className="block bg-gray-800 outline-none w-full pl-3 rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
        />
        <button
          type="submit"
          className=" bg-violet-500 self-end mt-2 font-medium transition-all hover:bg-violet-600 text-gray-100 px-4 py-1 rounded-md"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
