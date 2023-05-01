import { useEffect, useRef, useState } from "react";
import { Chat } from "./Chat";
import { SetUsername } from "./SetUsername";
import { supabase } from "./supabase";
import useLocalStorage from "./useLocalStorage";

interface ChatMessage {
  id: number;
  username: string;
  message: string;
}

export default function App() {
  const [username, setUsername] = useLocalStorage("username", "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  async function getMessages() {
    const { data } = await supabase.from("messages").select();
    setMessages(data);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [username, messages]);

  useEffect(() => {
    getMessages();

    const channel = supabase
      .channel("realtime chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
        },
        (payload) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as ChatMessage,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <div className="mx-auto max-w-2xl py-32">
      {username ? (
        <>
          <div className="flex w-full my-4 justify-between">
            <p className="text-gray-100 text-lg">Welcome, {username}</p>
            <button
              onClick={() => setUsername("")}
              className=" bg-violet-500 transition-all hover:bg-violet-600 text-gray-100 px-4 py-1 rounded-md"
            >
              Logout
            </button>
          </div>

          <Chat username={username} bottomRef={bottomRef} messages={messages} />
        </>
      ) : (
        <SetUsername setUsername={(name) => setUsername(name)} />
      )}
    </div>
  );
}
