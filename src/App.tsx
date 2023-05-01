import { FormEvent, useEffect, useRef, useState } from "react";
import { Chat } from "./Chat";
import { supabase } from "./supabase";
import useLocalStorage from "./useLocalStorage";

export default function App() {
  const [username, setUsername] = useLocalStorage("username", "");
  const [messages, setMessages] = useState<any>([]);

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
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <>
      {username ? (
        <>
          <Chat username={username} bottomRef={bottomRef} messages={messages} />
          <button onClick={() => setUsername("")}>Logout</button>
        </>
      ) : (
        <SetUsername setUsername={(name) => setUsername(name)} />
      )}
    </>
  );
}

function SetUsername({ setUsername }: { setUsername: (name: string) => void }) {
  function handleSetUsername(e: FormEvent) {
    e.preventDefault();
    setUsername(name);
  }
  const [name, setName] = useState("");
  return (
    <form onSubmit={handleSetUsername}>
      <label>Username</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Join chat</button>
    </form>
  );
}
