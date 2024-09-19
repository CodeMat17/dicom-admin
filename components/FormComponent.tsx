// components/FormComponent.tsx
"use client";

import { login, signup } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, MinusIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

// Define the schema for login and signup
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const signupSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function FormComponent() {
  // const router = useRouter()
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flipPW, setFlipPW] = useState(false);

  const flipPassword = () => {
    setFlipPW(!flipPW);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // router.push(`/login?message=Loading...`)
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validation = isLogin
      ? loginSchema.safeParse(data)
      : signupSchema.safeParse(data);
    if (!validation.success) {
      const formErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          formErrors[error.path[0]] = error.message;
        }
      });
      setErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);
      const formActionData = new FormData();
      formActionData.append("email", data.email);
      formActionData.append("password", data.password);

      if (isLogin) {
        await login(formActionData);
      } else {
        await signup(formActionData);
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-4 w-full'>
        <div>
          <label htmlFor='email' className='text-[16px] text-gray-400'>
            Email:
          </label>

          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Enter your email'
            className='w-full bg-gray-100 mt-1.5'
          />

          {errors.email && (
            <p className='text-red-500 text-sm'>{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor='password' className='text-[16px] text-gray-400'>
            Password:
          </label>
          <div className='flex items-center justify-center gap-3'>
            <Input
              id='password'
              name='password'
              type={`${flipPW ? "text" : "password"}`}
              placeholder='Enter your password'
              className='w-full bg-gray-100 mt-1.5'
            />

            <div
              onClick={flipPassword}
              className='mt-1 border p-2 rounded-md hover: cursor-pointer bg-transparent hover:bg-gray-100'>
              {flipPW ? (
                <EyeOffIcon className='w-5 h-5' />
              ) : (
                <EyeIcon className='w-5 h-5' />
              )}
            </div>
          </div>
          {errors.password && (
            <p className='text-red-500 text-sm'>{errors.password}</p>
          )}
        </div>

        {!isLogin && (
          <div>
            <label className='text-[16px] text-gray-400'>
              Confirm password:
            </label>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='Confirm your password'
              className='w-full bg-gray-900 mt-1.5'
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>
            )}
          </div>
        )}

        <div>
          <Button
            type='submit'
            className={`w-full ${
              isLoading ? "bg-sky-950" : "bg-sky-500 hover:bg-sky-700"
            } text-white`}
            disabled={isLoading}>
            {isLoading ? (
              <MinusIcon className='animate-spin' />
            ) : isLogin ? (
              "Log in"
            ) : (
              "Sign up"
            )}
          </Button>
        </div>

        <div className='text-sm text-gray-400 flex justify-end mt-1'>
          <p className='text-sm text-gray-400'>Sign Up is disabled</p>
          {/* <button
            type='button'
            onClick={() => setIsLogin(!isLogin)}
            className='text-sky-500 hover:text-sky-700'>
            {isLogin
              ? "Visiting for the first time? Sign up"
              : "Already have an account? Log in"}
          </button> */}
        </div>
      </form>
    </>
  );
}
