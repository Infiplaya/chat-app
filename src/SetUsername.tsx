import { FormEvent, useState } from "react";

export function SetUsername({
  setUsername,
}: {
  setUsername: (name: string) => void;
}) {
  function handleSetUsername(e: FormEvent) {
    e.preventDefault();
    setUsername(name);
  }
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={handleSetUsername}
      className="py-24 bg-gray-800 border-2 border-gray-700 rounded-md"
    >
      <div className="mx-auto w-2/3">
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6 text-gray-100"
        >
          Username
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="username"
            name="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block bg-gray-800 outline-none w-full pl-3 rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-violet-500 transition-all hover:bg-violet-600 text-gray-100 px-4 py-1 rounded-md"
        >
          Join chat
        </button>
      </div>
    </form>
  );
}
