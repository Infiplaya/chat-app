import { useState } from "react";
import { Chat } from "./Chat";
import { supabase } from "./supabase";
import SignUp from "./SignUp";
import { SignIn } from "./SignIn";
import { useProfile, useSession } from "./hooks";

export default function App() {
  const [authState, setAuthState] = useState<"signUp" | "signIn">("signUp");
  const session = useSession();

  const { userId, username } = useProfile();

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
          <div className="my-5 px-6 flex space-x-5 text-white">
            <button
              onClick={() => setAuthState("signIn")}
              className={`w-full py-2 rounded-md ${
                authState === "signIn" ? "bg-violet-500" : "bg-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthState("signUp")}
              className={`w-full py-2 rounded-md ${
                authState === "signUp" ? "bg-violet-500" : "bg-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {authState === "signIn" ? <SignIn /> : <SignUp />}
        </div>
      )}
    </div>
  );
}
