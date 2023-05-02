import { useState } from "react";
import { supabase } from "./supabase";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z
  .object({
    email: z.string().email(),
    username: z
      .string()
      .min(3, { message: "Username must contain at least 3 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must contain at least 6 characters" }),
  })
  .required();

type RegisterForm = z.infer<typeof registerSchema>;

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);
  async function handleSignUp(data: RegisterForm) {
    setLoading(true);

    await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    const { data: supabaseData } = await supabase.auth.getUser();

    await supabase.from("profiles").insert({
      id: supabaseData.user?.id,
      username: data.username,
    });

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className="py-24 bg-gray-800 border-2 border-gray-700 shadow-lg shadow-gray-800 rounded-md"
    >
      <div className="mx-auto space-y-6 w-2/3">
        <h3 className="text-2xl font-medium text-gray-50">Sign Up</h3>
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
              aria-invalid={errors.email ? "true" : "false"}
              className="block bg-gray-800 invalid:border-pink-500 invalid:text-pink-600
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500 outline-none w-full pl-3 rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-400 font-medium text-sm mt-2">
              {errors.email?.message}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block font-medium leading-6 text-gray-100"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              {...register("username")}
              aria-invalid={errors.username ? "true" : "false"}
              className="block bg-gray-800  outline-none w-full pl-3 rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-400 font-medium text-sm mt-2">
              {errors.username?.message}
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
              aria-invalid={errors.password ? "true" : "false"}
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
          Sign Up
        </button>
      </div>
    </form>
  );
}
