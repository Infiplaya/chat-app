import { useEffect, useState } from "react";
import { Chat } from "./Chat";
import { supabase } from "./supabase";
import type { Session } from "@supabase/supabase-js";
import SignUp from "./SignUp";
import { SignIn } from "./SignIn";

export default function App() {
  const [username, setUsername] = useState("");
  const [authState, setAuthState] = useState<"signUp" | "signIn">("signUp");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState<Session | null>(null);

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

  return (
    <div className="mx-auto max-w-2xl py-32">
      {session ? (
        <>
          <div className="flex w-full my-4 justify-between">
            <p className="text-gray-100 text-lg">Welcome Back {username}!</p>
            <button
              onClick={() => {
                supabase.auth.signOut();
              }}
              className=" bg-violet-500 font-medium transition-all hover:bg-violet-600 text-gray-100 px-4 py-1 rounded-md"
            >
              Logout
            </button>
          </div>

          <Chat username={username} userId={userId} session={session} />
        </>
      ) : (
        <div>
          <div className="mt-10 flex gap-10 text-white">
            <button onClick={() => setAuthState("signIn")}>Sign In</button>
            <button onClick={() => setAuthState("signUp")}>Sign Up</button>
          </div>

          {authState === "signIn" ? <SignIn /> : <SignUp />}
        </div>
      )}
    </div>
  );
}
