"use client";

import { exchangeCodeForSession, resetUserPassword } from "@/lib/api/auth";
import { AuthTokenResponse, UserResponse } from "@supabase/supabase-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import Link from "next/link";

const formSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must contain at least 6 chars"),
    confirmPassword: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must contain at least 6 chars"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const { toast } = useToast();

  const params = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const code = params.get("code") || null;
      if (code) {
        const response: AuthTokenResponse = JSON.parse(
          await exchangeCodeForSession(code)
        );

        if (response?.error) {
          return toast({
            title: response?.error?.message,
            variant: "destructive",
          });
        }
      }

      const response: UserResponse = JSON.parse(
        await resetUserPassword(values.password)
      );

      if (response?.error) {
        return toast({
          title: response?.error?.message,
          variant: "destructive",
        });
      }

      setIsPasswordUpdated(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center gap-6 md:gap-8">
      {isPasswordUpdated ? (
        <div className="w-full sm:w-96 h-fit p-6 md:p-8 flex flex-col gap-6 rounded-md border bg-muted">
          <h2 className="text-center text-xl sm:text-2xl lg:text-3xl text-foreground font-bold">
            Password updated!
          </h2>
          <Link href="/auth/signin">
            <Button className="w-full">Continue to sign in</Button>
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-foreground font-bold">
            Reset password
          </h2>
          <div className="w-full sm:w-96 h-fit p-6 md:p-8 rounded-md border bg-muted">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <Link href="/auth/forgot-password">
            <Button variant="link">Forgot password?</Button>
          </Link>
        </>
      )}
    </section>
  );
}
