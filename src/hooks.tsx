import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "./supabase";

export function useProfile() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [, setLoading] = useState(true);

  const session = useSession();

  useEffect(() => {
    async function getUser() {
      if (session) {
        setLoading(true);
        const { user } = session;

        const { data, error } = await supabase
          .from("profiles")
          .select(`username, id`)
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setUserId(data.id);
        }
        setLoading(false);
      }
    }

    getUser();
  }, [session]);

  return { username, userId };
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return session;
}

const messagesSchema = z.array(
  z.object({
    id: z.number(),
    username: z.string(),
    message: z.string(),
  })
);

interface ChatMessage {
  id: number;
  username: string;
  message: string;
}

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  async function getMessages() {
    const { data } = await supabase.from("messages").select();
    const safeData = messagesSchema.parse(data);
    setMessages(safeData);
  }

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

  return messages;
}
