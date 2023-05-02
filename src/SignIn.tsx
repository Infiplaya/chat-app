import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "./supabase";

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must contain at least 6 characters" }),
  })
  .required();

type LoginForm = z.infer<typeof loginSchema>;

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [credentialsError, setCredentialsError] = useState("");

  async function handleSignIn(data: LoginForm) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setCredentialsError("Invalid credentials!");
    }
  }
  return (
    <form
      onSubmit={handleSubmit(handleSignIn)}
      className="py-24 bg-gray-800 shadow-lg shadow-gray-800 border-2 border-gray-700 rounded-md"
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
              {...register("email")}
              className="block bg-gray-800 outline-none w-full pl-3 rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-400 font-medium text-sm mt-2">
              {errors.email?.message}
            </p>
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
              {...register("password")}
              className="block bg-gray-800 outline-none w-full pl-3 rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-400 font-medium text-sm mt-2">
              {errors.password?.message}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-violet-500 font-medium text-sm transition-all hover:bg-violet-600 text-gray-100 px-4 py-1 rounded-md"
        >
          Sign In
        </button>
        <p className="text-red-400 font-medium mt-2">{credentialsError}</p>
      </div>
    </form>
  );
}
