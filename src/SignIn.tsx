import { FormEvent, useState } from "react";
import { supabase } from "./supabase";

export function SignIn() {
  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Something went wrong");
    }
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      onSubmit={handleSignIn}
      className="py-24 bg-gray-800 border-2 border-gray-700 rounded-md"
    >
      <div className="mx-auto space-y-6 w-2/3">
        <h3 className="text-2xl font-medium text-gray-50">Sign In</h3>
        <div>
          <label
            htmlFor="email"
            className="block font-medium leading-6 text-gray-100"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block bg-gray-800 outline-none w-full pl-3 rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-medium leading-6 text-gray-100"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              autoComplete="true"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block bg-gray-800 outline-none w-full pl-3 rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-violet-500 font-medium text-sm transition-all hover:bg-violet-600 text-gray-100 px-4 py-1 rounded-md"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
